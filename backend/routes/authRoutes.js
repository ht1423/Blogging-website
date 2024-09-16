const express = require('express')
const User = require('../models/User')
const router = express.Router()
require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { zodUserSignupSchema, zodUserSigninSchema} = require('../zod')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/signup', async (req,res) => {

    const {name, email, password} = req.body

    try {
    
        const checkUser = zodUserSignupSchema.safeParse(req.body)

        if(!checkUser.success){
            return res.status(400).json({
                errors: checkUser.error.format()
            })
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({
                msg: "User already exists, try Sign in"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const payload = {
            user: {
                userId: newUser._id
            }
        }

        const token = jwt.sign(payload,process.env.JWT_SECRET)

        res.cookie('auth-token',token,{
            httpOnly: true
        })

        return res.json({
            msg: "Sign up successful",
            token
        })
        
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
}) 

router.post('/signin', async (req,res) => {

    const {email, password} = req.body

    try {

        const checkUser = zodUserSigninSchema.safeParse(req.body)

        if(!checkUser.success){
            return res.status(400).json({
                errors: checkUser.error.format()
            })
        }

        const existingUser = await User.findOne({email})

        if(!existingUser){
            return res.status(404).json({
                msg: "User not found, try Sign up"
            })
        }

        const check = await bcrypt.compare(password,existingUser.password)

        if(!check){
            return res.status(400).json({
                msg: "Password is incorrect"
            })
        }

        const payload = {
            user: {
                userId: existingUser._id
            }
        }

        const token = jwt.sign(payload,process.env.JWT_SECRET)

        res.cookie('auth-token',token,{
            httpOnly: true
        })

        return res.json({
            msg: "Sign in successful",
            token
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later."
        })
    }
})

router.post('/logout', async (req,res) => {

    try {

        res.clearCookie('auth-token')

        return res.json({
            msg: "User logout successful"
        })
    }

    catch (err){
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later."
        })
    }
})

module.exports = router
