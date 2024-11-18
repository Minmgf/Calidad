const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    modelType: { type: String, required: true }, // Ejemplo: 'ISO25000'
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
            value: { type: Number, required: true }
        }
    ],
    finalScore: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);
