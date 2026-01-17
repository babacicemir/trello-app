const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    description: {
        type: String,
        default: " ",
        trim: true
    },
    columnId: {
        type: String,
        required: true
    },
    attachments: {
        type: [String],
        default: [""]
    },
    assignee: {
        type: String,
        default: null
    },
    estimate: {
        type: Number,
        min: 0,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const Ticket = mongoose.model("Ticket", ticketSchema)

module.exports = Ticket