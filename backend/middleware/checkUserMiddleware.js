const User = require("../models/User")

const checkIfUserExistsMiddleware = async (req,res,next) => {

    const userId = req.user.userId

    try {

        const user = await User.findById(userId).select('-password')

        if(!user){
            return res.status(404).json({
                msg: "User not found"
            })
        }

        req.foundUser = user
        next()
    }

    catch (err) {
        console.error(err)

        return res.status(500).json({
            msg: "An internal server error occurred. Please try again later"
        })
    }
}

module.exports = checkIfUserExistsMiddleware