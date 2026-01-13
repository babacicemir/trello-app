const User = require("../../models/user")
const uuid = require("uuid")
const Invitation = require("../../models/invitation")

const getUserById = async (id) => {
  const user = await User.findOne({ id })
  return user
}

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email })
  return user
}

const getUsersByEmails = async (emails) => {
  const users = await User.find({ email: { $in: emails } })
  return users
}

const createUser = async (data) => {
  try {
    const newUser = new User({
      id: parseInt(uuid.v4()),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      active: true,
    })
    const savedUser = await newUser.save()
    return savedUser
  } catch (error) {
    return error
  }
}

const sendInvite = async (idBoard, email, confirmationCode) => {
  const newInvitation = new Invitation({
    boardId: idBoard,
    email,
    confirmationCode,

  })
  await newInvitation.save()

  return newInvitation
}

const findInvitation = async (idBoard, confirmationCode) => {
  try {
    const findInvitation = await Invitation.findOne({ boardId: idBoard, confirmationCode })
    return findInvitation
  } catch (error) {
    return error
  }
}

const updateInvitation = async (id, confirmationCode) => {
  try {
    const updateInvitation = await Invitation.updateOne({ boardId: id, confirmationCode }, { $set: { acceptedInvitation: true } })
    return updateInvitation
  } catch (error) {
    return error
  }
}

module.exports = { getUserByEmail, createUser, sendInvite, getUserById, getUsersByEmails, findInvitation, updateInvitation }
