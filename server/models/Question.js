// server/models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    category: String,
    weight: {
        type: Number,
        default: 1
    },
    options: [{
        value: Number,
        label: String
    }]
});

module.exports = mongoose.model('Question', QuestionSchema);
