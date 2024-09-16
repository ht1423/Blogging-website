const Blog = require("../models/Blog")

const checkIfBlogExistsMiddleware = async (req,res,next) => {

    const {blogId} = req.params

    try {

        const blog = await Blog.findById(blogId)

        if(!blog){
            return res.status(404).json({
                msg: "Blog not found"
            })
        }

        req.blog = blog
        next()
    }

    catch (err){
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
} 

module.exports = checkIfBlogExistsMiddleware