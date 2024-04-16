const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// creating jwt token
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body
    
    // logging in user, try catch block for errors
    try {
        const user = await User.login(email, password)

        // create a token, authenticating user right after signing up
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// signup user
const signupUser = async (req, res) => {
    const {email, password} = req.body

    // signing up user, try catch block for errors
    try {
        const user = await User.signup(email, password)

        // create a token, authenticating user right after signing up
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {signupUser, loginUser}