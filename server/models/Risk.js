// server/models/Risk.js
const mongoose = require('mongoose');

const RiskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    description: String,
    category: String,
    alcance: {
        type: Number,
        default: 1,
        required: true
    },
    tiempo: {
        type: Number,
        default: 1,
        required: true
    },
    costo:  {
        type: Number,
        default: 1,
        required: true
    },
    calidad: {
        type: Number,
        default: 1,
        required: true
    },
    status: String,

});

module.exports = mongoose.model('Risk', RiskSchema);
