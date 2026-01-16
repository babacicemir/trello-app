const Board = require("../../models/board")
const uuid = require("uuid")

const addUserOnBoard = async (id, email, role) => {
  try {
    const board = await Board.findOne({ id })
    const usersList = board.users
    usersList.push({ email, role })
    const addUser = await Board.updateOne({ id }, { $set: { users: usersList } })
    return addUser
  } catch (error) {
    return error
  }
}

const createBoard = async (data) => {
  const board = new Board({
    id: uuid.v4(),
    name: data.name,
    users: data.users,
  })

  const createdBoard = await board.save()
  return createdBoard
}

const getAllBoards = async () => {
  try {
    const boards = await Board.find()
    return boards
  } catch (error) {
    return error
  }
}

const getBoardById = async (id) => {
  const board = await Board.findOne({ id })
  return board
}


const updateBoard = async (boardId, newName) => {

  
  const board = await Board.findOne({ id: boardId })

  if(!board){
    return null
  }

  board.name = newName
  
  await board.save()

  return board
}

module.exports = { 
  createBoard, 
  getAllBoards, 
  getBoardById, 
  addUserOnBoard,
  updateBoard
}
