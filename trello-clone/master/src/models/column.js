const { boolean } = require("joi")
const mongoose = require("mongoose")

const columnSchema = new mongoose.Schema({
    name: {
        type: "String",
        "required": true,
    },

    default: {
        type:  Boolean, 
        default: false,
    },

    boardId: {
        type: "String",
        required: true
    }
})

const Column = mongoose.model("Column", columnSchema);


module.exports = Column
