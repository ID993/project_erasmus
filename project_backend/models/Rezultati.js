const mongoose = require('mongoose');

const resultsSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true,
        min: 0, // Minimum score, customize as needed
    },
    comments: {
        type: String,
        required: false, // Optional field
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User collection
        required: true,
    },
    programId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program', // Reference to the Program collection
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Results', resultsSchema);
