// models/RiskEvaluation.js
const mongoose = require('mongoose');

const RiskEvaluationSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    selectedRisks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Risk'
    }],
    evaluations: [{
        riskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Risk'
        },
        value: {
            type: Number,
            min: 1,
            max: 5
        }
    }],
    status: {
        type: String,
        enum: ['pending_evaluation', 'completed'],
        default: 'pending_evaluation'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
});

module.exports = mongoose.model('RiskEvaluation', RiskEvaluationSchema);
