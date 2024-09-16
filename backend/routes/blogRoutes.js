const express = require('express')
const User = require('../models/User')
const router = express.Router()
require('dotenv').config()
const authMiddleware = require('../middleware/authMiddleware')
const checkIfUserExistsMiddleware = require('../middleware/checkUserMiddleware')

router.get('/blogs', authMiddleware, checkIfUserExistsMiddleware, async (req,res) => {

    const user = req.foundUser

    try {

        return res.json({
            blogs: user.blogs
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later."
        })
    }
})

router.get('/likedBlogs', authMiddleware, checkIfUserExistsMiddleware, async (req,res) => {

    const user = req.foundUser

    try {

        return res.json({
            likedBlogs: user.likedBlogs
        })
    }

    catch (err) {
        console.error(err)
        
        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later."
        })
    }
})

router.get('/bookmarkedBlogs', authMiddleware, checkIfUserExistsMiddleware, async (req,res) => {

    const user = req.foundUser

    try {

        return res.json({
            bookmarkedBlogs: user.bookmarkedBlogs
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later."
        })
    }
})

module.exports = router






