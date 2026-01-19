const boardRepository = require("../../repositories/boards/index")
const userRepository = require("../../repositories/users/index")
const randomString = require("randomstring")
const jwt = require("jsonwebtoken")
const { sendEmail } = require("../../config/mailservice")


const createBoard = async (req, res) => {
  try {
    const { name, users=[] } = req.body
    const board = {
      name,
      users,
    }

    let token = req.header("Authorization")
    if (!token) {
      return res.status(401).json({ error: "Missing token" })
    }
    token = token.split(" ")[1]

    const decoded = jwt.verify(token, process.env.TOKEN_CODE)
    const loginUser = await userRepository.getUserById(decoded.userId)

    board.users.push({
      email: loginUser.email,
      role: "admin",
    })

    const createdBoard = await boardRepository.createBoard(board)

    const confirmationCode = randomString.generate({
      length: 8,
      charset: "alphanumeric",
    })

    const invitationLink = `${process.env.API_BASE_URL}/api/boards/${createdBoard.id}/join/${confirmationCode}`

    for (const { email } of users) {
      const user = await userRepository.getUserByEmail(email)

      if (user) {
        await userRepository.sendInvite(
          createdBoard.id,
          email,
          confirmationCode
        )

        await sendEmail({
          to: email,
          subject: "Invitation for board",
          html: `
            <h2>You are invited </h2>
            <p>You have been invited to join the board <b>${createdBoard.name}</b>.</p>
            <p>
              Click here to join:
              <a href="${invitationLink}">${invitationLink}</a>
            </p>
          `,
        })
      } else {
        console.log(`User with email "${email}" does not exist`)
      }
    }

    return res.status(201).json({
      message: "Board created!",
      createdBoard,
    })
  } catch (error) {
    console.error("Error creating board:", error)
    res.status(500).json({ error: "Error creating new board!" })
  }
}

const readAllBoards = async (req, res) => {
  try {
    const allBoards = await boardRepository.getAllBoards()
    res.status(200).json({ boards: allBoards })
  } catch (error) {
    res.status(400).json(error)
  }
}

const readBoard = async (req, res) => {
  try {
    const boardID = req.params.id
    const board = await boardRepository.getBoardById(boardID)
    if (!board) {
      return res.status(404).json({})
    } else {
      return res.status(200).json(board)
    }
  } catch (error) {
    console.error("Error reading board:", error)
    return res.status(400).json(error)
  }
}


const updateBoard = async (req, res) => {
  try{
    const { name } = req.body
    const { boardId } = req.params

    if(!name){
      return res.status(400).json({
        message: "Nothing to update!"
      })
    }


    const updatedBoard = await boardRepository.updateBoard(boardId, name)


    if(!updatedBoard){
      return res.status(404).json({
        error: "Board not found!"
      })
    }

    return res.status(200).json({
      message: "Board successfully updated!",
      updatedBoard
    })
  }
  catch(error){
    return res.status(500).json({
      error: "Error updating board"
    })
  }
}


module.exports = { createBoard, readAllBoards, readBoard, updateBoard }
