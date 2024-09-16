const express = require('express')
const User = require('../models/User')
const router = express.Router()
require('dotenv').config()
const authMiddleware = require('../middleware/authMiddleware')

router.get('/blogs', authMiddleware, async (req,res) => {

    const userId = req.user.userId

    try {
        const user = await User.findById(userId).select('blogs')

        if(!user){
            return res.status(404).json({
                msg: "User not found"
            })
        }

        return res.json({
            user
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later."
        })
    }
})

router.get('/likedBlogs', authMiddleware, async (req,res) => {

    const userId = req.user.userId

    try {

        const user = await User.findById(userId).select('likedBlogs')

        if(!user){
            return res.status(404).json({
                msg: "User not found"
            })
        }

        return res.json({
            user
        })
    }

    catch (err) {
        console.error(err)
        
        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later."
        })
    }
})

router.get('/bookmarkedBlogs', authMiddleware, async (req,res) => {

    const userId = req.user.userId

    try {

        const user = await User.findById(userId).select('bookmarkedBlogs')

        if(!user){
            return res.status(404).json({
                msg: "User not found"
            })
        }

        return res.json({
            user
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






