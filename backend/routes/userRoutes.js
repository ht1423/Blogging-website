const express = require('express')
const User = require('../models/User')
const router = express.Router()
require('dotenv').config()
const bcrypt = require('bcryptjs')
const {zodUserUpdateSchema } = require('../zod')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/profile', authMiddleware, async (req,res) => {

    const userId = req.user.userId

    try {

        const user = await User.findById(userId).select('-password')

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

router.put('/update', authMiddleware, async (req,res) => {

    const userId = req.user.userId

    try {

        const checkUser = zodUserUpdateSchema.safeParse(req.body)

        if(!checkUser.success){
            return res.status(400).json({
                errors: checkUser.error.format()
            })
        }

        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password,salt)
        }

        const user = await User.findByIdAndUpdate(
            {
                _id: userId
            },
            {
                $set: req.body
            },{
                new: true
            }
        )

        if(!user){
            return res.status(404).json({
                msg: "User not found"
            })
        }

        return res.json({
            msg: "User updated successfully",
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

router.delete('/delete', authMiddleware, async (req,res) => {
    
    const userId = req.user.userId

    try {

        const user = await User.findByIdAndDelete(userId)

        if(!user){
            return res.status(404).json({
                msg: "User not found"
            })
        }

        return res.json({
            msg: "User deleted successfully"
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later."
        })
    }
})

router.get('/allUsers', authMiddleware, async (req,res) => {

    try {

        const user = await User.find().select('-password')

        if(!user){
            return res.status(404).json({
                msg: "No user found"
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

