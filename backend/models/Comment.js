const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    },
    comment: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Comment', CommentSchema)
