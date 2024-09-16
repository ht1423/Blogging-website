const jwt = require('jsonwebtoken')
require('dotenv').config()

const authMiddleware = async (req,res,next) => {

    const token = req.cookies['auth-token']

    if(!token){
        return res.status(400).json({
            msg: "No token, authorization denied"
        })
    }

    try {

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded.user){
            return res.status(404).json({
                msg: "User not found"
            })
        } 

        req.user = decoded.user
        next()
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
}

module.exports = authMiddleware