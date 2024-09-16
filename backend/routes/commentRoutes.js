const express = require('express')
const User = require('../models/User')
const router = express.Router()
require('dotenv').config()
const authMiddleware = require('../middleware/authMiddleware')
const checkIfUserExistsMiddleware = require('../middleware/checkUserMiddleware')
const {zodCommentSchema} = require('../zod')
const Blog = require('../models/Blog')
const Comment = require('../models/Comment')
const checkIfBlogExistsMiddleware = require('../middleware/checkIfBlogMiddleware')

router.post('/comment/:blogId', authMiddleware, checkIfUserExistsMiddleware, checkIfBlogExistsMiddleware, async (req,res) => {

    const {blogId} = req.params
    const userId = req.user.userId

    try {

        const checkComment = zodCommentSchema.safeParse(req.body)

        if(!checkComment.success){
            return res.status(400).json({
                errors: checkComment.error.format()
            })
        }

        const userComment = await Comment.create({
            user: userId,
            blog: blogId,
            comment: req.body.comment
        })

        await Blog.findByIdAndUpdate({
            _id: blogId
        },{
            $addToSet: {
                comments: userComment._id
            }
        },{
            new: true
        })

        await User.findByIdAndUpdate({
            _id: userId
        },{
            $addToSet: {
                comments: userComment._id
            }
        },{
            new: true
        })

        return res.json({
            msg: "Comment done",
            userComment
        })
    }

    catch (err){
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
})

router.put('/updateComment/:commentId', authMiddleware, async (req,res) => {

    const commentId = req.params.commentId

    try {

        const checkComment = zodCommentSchema.safeParse(req.body)

        if(!checkComment.success){
            return res.status(400).json({
                errors: checkComment.error.format()
            })
        }

        const updatedComment = await Comment.findByIdAndUpdate({
            _id: commentId
        },{
            $set: req.body
        },{
            new: true
        })

        if(!updatedComment){
            return res.status(404).json({
                msg: "Comment not found"
            })
        }

        return res.json({
            msg: "Comment updated successfully",
            updatedComment
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
})

router.delete('/deleteComment/:blogId/:commentId', authMiddleware, checkIfUserExistsMiddleware, checkIfBlogExistsMiddleware, async (req,res) => {

    const blog = req.blog
    const user = req.foundUser
    const userId = req.user.userId
    const {commentId} = req.params
    const {blogId} = req.params

    try {

        const comment = await Comment.findByIdAndDelete(commentId)

        if(!comment){
            return res.status(404).json({
                msg: "Comment not found"
            })
        }

        blog.comments = blog.comments.filter(_id => !_id.equals(commentId))

        await Blog.findByIdAndUpdate({
            _id: blogId
        },{
            $set: {
                comments: blog.comments
            }
        },{
            new: true
        })

        user.comments = user.comments.filter(_id => !_id.equals(commentId))

        await User.findByIdAndUpdate({
            _id: userId
        },{
            $set: {
                comments: blog.comments
            }
        },{
            new: true
        })

        return res.json({
            msg: "Comment removed"
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
})

module.exports = router

