const express = require('express')
const User = require('../models/User')
const router = express.Router()
require('dotenv').config()
const authMiddleware = require('../middleware/authMiddleware')
const checkIfUserExistsMiddleware = require('../middleware/checkUserMiddleware')
const { zodBlogCreateSchema, zodCommentSchema, zodBlogUpdateSchema } = require('../zod')
const Blog = require('../models/Blog')
const Comment = require('../models/Comment')
const checkIfBlogExistsMiddleware = require('../middleware/checkIfBlogMiddleware')

router.post('/create', authMiddleware,checkIfUserExistsMiddleware, async (req,res) => {

    const userId = req.user.userId
    const {name, description} = req.body

    try {

        const checkBlog = zodBlogCreateSchema.safeParse(req.body)

        if(!checkBlog.success){
            return res.status(400).json({
                errors: checkBlog.error.format()
            })
        }

        const blog = await Blog.create({
            name,
            description,
            createdBy: userId
        })

        await User.findByIdAndUpdate({
            _id: userId
        },{
            $addToSet: {
                blogs: blog._id
            } 
        },{
            new: true
        })

        return res.json({
            msg: "Blog created successfully",
            blog
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
})

router.put('/update/:blogId', authMiddleware, checkIfBlogExistsMiddleware, checkIfBlogExistsMiddleware, async (req,res) => {

    const {blogId} = req.params
    const userId = req.user.userId
    const blog = req.blog
    
    try {

        const checkReq = zodBlogUpdateSchema.safeParse(req.body)

        if(!checkReq.success){
            return res.status(400).json({
                errors: checkReq.error.format()
            })
        }

        if(userId !== blog.createdBy.toString()){
            return res.status(400).json({
                msg: "Only owner can update a blog"
            })
        }

        const updatedBlog = await Blog.findByIdAndUpdate({
            _id: blogId
        },{
            $set: req.body
        },{
            new: true
        })

        return res.json({
            msg: "Blog updated successfully",
            updatedBlog
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
})

router.delete('/delete/:blogId', authMiddleware, checkIfUserExistsMiddleware, checkIfBlogExistsMiddleware, async (req,res) => {

    const {blogId} = req.params
    const userId = req.user.userId
    const blog = req.blog

    try {

        if(userId !== blog.createdBy.toString()){
            return res.status(400).json({
                msg: "Only owner can delete a blog"
            })
        }

        await Blog.findByIdAndDelete(blogId)

        return res.json({
            msg: "Blog deleted successfully"
        })
    }

    catch (err){
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
})

router.get('/blog/:blogId', checkIfBlogExistsMiddleware, async(req,res) => {

    try {
        return res.json({
            blog: req.blog
        })
    }

    catch (err){
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
})

router.get('/allBlogs',  async (req,res) => {

    try {

        const allBlogs = await Blog.find()

        return res.json({
            allBlogs
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later."
        })
    }
})

router.put('/like/:blogId', authMiddleware, checkIfUserExistsMiddleware, checkIfBlogExistsMiddleware, async (req,res) => {

    const {blogId} = req.params
    const userId = req.user.userId

    try {

        const likedBlog = await Blog.findByIdAndUpdate({
            _id: blogId
        },{
            $addToSet: {
                likes: userId
            }
        },{
            new: true
        })

        await User.findByIdAndUpdate({
            _id: userId
        },{
            $addToSet: {
                likedBlogs: likedBlog._id
            }
        },{
            new: true
        })

        return res.json({
            msg: "Liked"
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
})

router.put('/removeLike/:blogId', authMiddleware, checkIfUserExistsMiddleware, checkIfBlogExistsMiddleware, async (req,res) => {

    const blog = req.blog
    const user = req.foundUser
    const userId = req.user.userId
    const {blogId} = req.params

    try {

        const blogsLength = blog.likes.length

        blog.likes = blog.likes.filter(_id => !_id.equals(userId))

        const updatedBlogsLength = blog.likes.length

        if(blogsLength === updatedBlogsLength){
            return res.status(400).json({
                msg: "You cannot ask for a request to remove a like from a blog you never liked"
            })
        }

        await Blog.findByIdAndUpdate({
            _id: blogId
        },{
            $set: {
                likes: blog.likes
            }
        },{
            new: true
        })

        user.likedBlogs = user.likedBlogs.filter(_id => !_id.equals(blogId))

        await User.findByIdAndUpdate({
            _id: userId
        },{
            $set: {
                likedBlogs: user.likedBlogs
            }
        },{
            new: true
        })

        return res.json({
            msg: "Like removed"
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
})

router.put('/bookmark/:blogId', authMiddleware, checkIfUserExistsMiddleware, checkIfBlogExistsMiddleware, async (req,res) => {

    const {blogId} = req.params
    const userId = req.user.userId

    try {

        const bookmarkedBlog = await Blog.findByIdAndUpdate({
            _id: blogId
        },{
            $set: {
                bookmarked: userId
            }
        },{
            new: true
        })

        await User.findByIdAndUpdate({
            _id: userId
        },{
            $set: {
                bookmarkedBlogs: bookmarkedBlog._id
            }
        },{
            new: true
        })

        return res.json({
            msg: "Added to Bookmark"
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
})


router.put('/removeBookmark/:blogId', authMiddleware, checkIfUserExistsMiddleware, checkIfBlogExistsMiddleware, async (req,res) => {

    const blog = req.blog
    const user = req.foundUser
    const userId = req.user.userId
    const {blogId} = req.params

    try {

        const blogBookmarkLength = blog.bookmarked.length

        blog.bookmarked = blog.bookmarked.filter(_id => !_id.equals(userId))

        const blogUpdatedBookmarkLength = blog.bookmarked.length

        if(blogBookmarkLength === blogUpdatedBookmarkLength){
            return res.status(400).json({
                msg: "You cannot ask for a request to remove a bookmark from a blog you never added to your bookmark list"
            })
        }

        await Blog.findByIdAndUpdate({
            _id: blogId
        },{
            $set: {
                bookmarked: blog.bookmarked
            }
        },{
            new: true
        })

        user.bookmarkedBlogs = user.bookmarkedBlogs.filter(_id => !_id.equals(blogId))

        await User.findByIdAndUpdate({
            _id: userId
        },{
            $set: {
                bookmarkedBlogs: user.bookmarkedBlogs
            }
        },{
            new: true
        })

        return res.json({
            msg: "Bookmark removed"
        })
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
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






