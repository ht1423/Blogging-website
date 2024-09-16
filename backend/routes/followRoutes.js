const express = require('express')
const User = require('../models/User')
const router = express.Router()
require('dotenv').config()
const authMiddleware = require('../middleware/authMiddleware')
const checkIfUserExistsMiddleware = require('../middleware/checkUserMiddleware')

router.get('/followers', authMiddleware, checkIfUserExistsMiddleware, async (req,res) => {

    const user = req.foundUser

    try {

        return res.json({
            followers: user.followers
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later."
        })
    }
})

router.get('/following', authMiddleware, checkIfUserExistsMiddleware, async (req,res) => {

    const user = req.foundUser

    try {

        return res.json({
            following: user.following
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later."
        })
    }
})

router.put('/follow/:id', authMiddleware, checkIfUserExistsMiddleware, async (req,res) => {
    
    const {id} = req.params
    const userId = req.user.userId

    try {

        const targetUser = await User.findById(id)

        if(!targetUser){
            return res.status(404).json({
                msg: "User to follow not found"
            })
        }

        const updatedUser = await User.findByIdAndUpdate({
            _id: userId
        },{
            $addToSet: {
                following: id
            }
        },{
            new: true
        })

        await User.findByIdAndUpdate({
            _id: id
        },{
            $addToSet: {
                followers: userId
            }
        },{
            new: true
        })

        return res.json({
            msg: "Following",
            updatedUser
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }

})

router.put('/unfollow/:id', authMiddleware, checkIfUserExistsMiddleware, async (req,res) => {

    const {id} = req.params
    const userId = req.user.userId
    const user = req.foundUser

    try {

        const targetUser = await User.findById(id)

        if(!targetUser){
            return res.status(404).json({
                msg: "User to unfollow not found"
            })
        }

        user.following = user.following.filter(_id => !_id.equals(id)) 

        await User.findByIdAndUpdate({
            _id: userId
        },{
            $set: {
                following: user.following
            }
        },{
            new: true
        })

        targetUser.followers = targetUser.followers.filter(_id => !_id.equals(userId))

        await User.findByIdAndUpdate({
            _id: id
        },{
            $set: {
                followers: targetUser.followers
            }
        },{
            new: true
        })

        return res.json({
            user
        })
    }

    catch (err){
        console.error(err)

        return res.status(500).json({
            msg: 'An internal server error occurred. Please try again later'
        })
    }
})

module.exports = router
