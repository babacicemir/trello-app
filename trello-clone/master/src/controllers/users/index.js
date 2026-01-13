const userRepository = require("../../repositories/users")
const boardRepository = require("../../repositories/boards")
const User = require("../../models/user")
const { hashPassword } = require("../../utils/index")
const { createTransporter } = require("../../config/mailservice")
const randomString = require("randomstring")
const Invitation = require("../../models/invitation")
const Board = require("../../models/board")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await userRepository.getUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: "User doesn't exist!" })
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password)
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid password!" })
    }

    const payload = {
      email: user.email,
      userId: user.id
    }
    const token = jwt.sign(payload, process.env.TOKEN_CODE)


    return res.status(200).json({ message: "Login successful!", data: { token } })
  } catch (error) {
    return res.status(401).json({ error: "Login unsuccessful" })
  }
}

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(401).json({ error: "User already exists!" })
    }

    const encryptedPassword = hashPassword(password)
    const data = {
      firstName,
      lastName,
      email,
      password: encryptedPassword
    }

    const user = await userRepository.createUser(data)
    if (user) {
      return res.status(200).json({ message: "Successfully created user" })
    }
  } catch (error) {
    return res.status(400).json(error)
  }
}

const invite = async (req, res) => {
  try {
    const { idBoard, email } = req.body

    const userInvited = await Invitation.findOne({ boardId: idBoard, email })
    if (userInvited) {
      return res.status(400).json({ error: "User is already invited" })
    }
    const userOnBoard = await Board.findOne({ id: idBoard, "users.email": email })
    if (userOnBoard) {
      return res.status(400).json({ error: "User is already on board" })
    }

    const confirmationCode = randomString.generate({ length: 8, charset: "alphanumeric" })
    const saveInvitation = await userRepository.sendInvite(idBoard, email, confirmationCode)
    if (!saveInvitation) {
      return res.status(400).json({ error: "Error occurred while saving the invitation" })
    }

    const transporter = createTransporter()
    const invitationLink = `${process.env.URL_BASE}/api/boards/${idBoard}/join/${confirmationCode}`
    const mailData = {
      from: process.env.EMAIL,
      to: email,
      subject: "Invitation for board",
      html: `If you would like to join our board, please click the following link: <a href="${invitationLink}">${invitationLink}</a>`,
    }
    await transporter.sendMail(mailData)
    res.status(200).json({ message: "Invitation is successfully sent", confirmationCode })
  } catch (error) {
    res.status(400).json(error)
  }
}

const acceptInvite = async (req, res) => {
  try {
    const { id, code } = req.params

    const invitation = await userRepository.findInvitation(id, code)
    if (invitation.acceptedInvitation === true) {
      return res.status(400).json({ error: "Already accepted invite" })
    } else {
      await userRepository.updateInvitation(id, code)
    }

    const userEmail = invitation.email

    const role = "member"
    const boardUpdate = await boardRepository.addUserOnBoard(id, userEmail, role)
    if (!boardUpdate) {
      return res.status(400).json({ error: "User is unsuccessfully added on board" })
    }

    return res.status(200).json({ message: "Successfully accepted invite" })
  } catch (error) {
    res.status(400).json(error)
  }
}

module.exports = { login, signup, invite, acceptInvite }
