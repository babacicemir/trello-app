const mongoose = require("mongoose")

const inviteSchema = new mongoose.Schema({
  boardId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  confirmationCode: {
    type: String,
    required: true,
    unique: true,
  },
  acceptedInvitation: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

const Invite = mongoose.model("Invite", inviteSchema)

module.exports = Invite
