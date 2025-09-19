const mongoose = require("mongoose");
// Define Schema
const chatSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    message: {
        type: String,
        maxLength: 60
    },
    created_at: {
        type: Date,
        // required: true
    }
})
// Created Model
const Chat = mongoose.model("Chat", chatSchema);
// Export model
module.exports = Chat;