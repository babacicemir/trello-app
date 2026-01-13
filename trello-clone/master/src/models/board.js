const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "member", "guest"],
    default: "guest"
  }
})

const boardSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true,
    unique: true
  },

  users: [userSchema]
})

const Board = mongoose.model("Board", boardSchema)
module.exports = Board
