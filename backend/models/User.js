const mongoose = require('mongoose')
const { boolean } = require('zod')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
    },
    profileImage: {
        type: String,
    },
    bio: {
        type: String,
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    likedBlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    bookmarkedBlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    role: {
        type: String,
        enum: ['writer','reader','admin'],
        default: 'reader'
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

module.exports = mongoose.model('User',UserSchema)