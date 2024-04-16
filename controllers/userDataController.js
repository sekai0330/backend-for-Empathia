const UserData = require('../models/userDataModel')
const mongoose = require('mongoose')

// OPENAI and IBM api endpoints

// const receiveTranscript


// MONGODB api endpoints

// get all user data
const getAllUserData = async (req, res) => {
    const user_id = req.user._id

    const all_user_data = await UserData.find({ user_id }).sort({createdAt: -1})
    console.log(all_user_data)
    res.status(200).json(all_user_data)
}

// get single user data
const getUserData = async (req, res) => {
    // getting requested id using parameter
    const { id } = req.params

    // check if req complies with mongoose 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user data'})
    }

    const user_data = await UserData.findById(id)

    // if requested user data does not exist
    if (!user_data) {
        return res.status(404).json({error: 'No such user data'})
    }

    res.status(200).json(user_data)
}

// const { Configuration, OpenAIApi } = require("openai");
// // create new user data
// const createUserData = async (req, res) => {
//     const {id, scores, transcript} = req.body
//     const user_id = req.user._id

//     const configuration = new Configuration({
//         apiKey: process.env.OPENAI_API_KEY,
//     });
//     const openai = new OpenAIApi(configuration);

//     // feedback
//     const response = await openai.createCompletion({
//         model: "text-davinci-002",
//         prompt: "Provide personal feedback for me and give me tips: " + transcript,
//         temperature: 1,
//         max_tokens: 200,
//         top_p: 1,
//         frequency_penalty: 0,
//         presence_penalty: 0,
//     });

//     // score
//     const response2 = await openai.createCompletion({
//         model: "text-davinci-002",
//         prompt: "Give this text a number from 1-100 in terms of positivity: " + transcript,
//         temperature: 1,
//         max_tokens: 100,
//         top_p: 1,
//         frequency_penalty: 0,
//         presence_penalty: 0,
//     });

//     // console.log(response.data.choices[0].text)
//     // console.log(response2.data.choices)

//     const newUserData = new UserData({
//         id: 'user',
//         scores: response2.data.choices[0].text,
//         transcript: transcript,
//         user_id: user_id,
//         feedback: response.data.choices[0].text
//     })

//     console.log(newUserData)
//     // add doc to db
//     try {
//         await newUserData.save()
//     } catch (error) {
//         res.status(400).json({error: error.message})
//     }

//     console.log('POST:', newUserData)
//     return res.status(201).json({user_data: newUserData, feedback: response.data.choices[0].text, score: response2.data.choices[0].text})
// }
const { Configuration, OpenAIApi } = require("openai");
// create new user data
const createUserData = async (req, res) => {
    try {
        const { id, scores, transcript } = req.body
        const user_id = req.user._id

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        // feedback
        const response = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: "Give me feedback and tips on how to improve if I am being negative, if I am positive then give me words of encouragement to keep doing good and to check in daily with this application: " + transcript,
            temperature: 1,
            max_tokens: 200,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        // score
        const response2 = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: "Only give me a number, no other words, from 1-100 in terms of how positive the text is: " + transcript,
            temperature: 1,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        // console.log(response.data.choices[0].text)
        // console.log(response2.data.choices)

        const newUserData = new UserData({
            id: 'user',
            scores: response2.data.choices[0].text,
            transcript: transcript,
            user_id: user_id,
            feedback: response.data.choices[0].text
        })

        console.log(newUserData)
        // add doc to db
        await newUserData.save();
        console.log('POST:', newUserData)
        res.status(201).json({ user_data: newUserData, feedback: response.data.choices[0].text, score: response2.data.choices[0].text })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message })
    }
}


// delete user data
const deleteUserData = async (req, res) => {
    const { id } = req.params

    // check if req complies with mongoose 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user data'})
    }

    const user_data = await UserData.findOneAndDelete({_id: id})

    if (!user_data) {
        return res.status(404).json({error: 'No such user data'})
    }

    res.status(200).json(user_data)
}

// update user data
const updateUserData = async (req, res) => {
    const { id } = req.params

    // check if req complies with mongoose 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user data'})
    }

    // updating user data by updating requested properties by body
    const user_data = await UserData.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!user_data) {
        return res.status(404).json({error: 'No such user data'})
    }

    res.status(200).json(user_data)
}


module.exports = {
    getAllUserData,
    getUserData,
    createUserData,
    deleteUserData,
    updateUserData
}