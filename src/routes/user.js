const express = require('express')
const User = require('../model/user.js')
const auth = require('../middleware/auth.js')
const jwt = require('jsonwebtoken')

const router = new express.Router()


//?         CREATE_USER
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {

        await user.save()
        const token = await user.getAuthToken()
        res.status(201).send({
            user,
            token
        })

    } catch (error) {
        res.status(400).send({'error': error})
    }
 
})

//?        USER - LOGIN
router.post('/user/login', async (req, res) => {
    try {
        console.log(req.body.email);
        console.log(req.body.password);
        const user = await User.findByCredentials( req.body.email , req.body.password)
        const token = await user.getAuthToken()
        res.send({ 
            user, 
            token
        })

    } catch (error) {
        res.status(400).send({'error': 'unable to login'})
    }
})

//?        USER - UPDATE
router.patch('/users/me',auth, async (req, res) => {

    const requestedField = Object.keys(req.body)
    const userDocFields = ['name', 'email', 'password'] 
    const validInputField = requestedField.every((update) => {
        return userDocFields.includes(update)
    })

    if(!validInputField) {
        res.status(400).send('enter data of relevent field')
    }

    try {
        //* This is dynamic value so we can not use implicit '.email or .name' so to say
        //* that's why we need to use explicit operator '[]'
        //* basically this will overwrite the existing value and then update it
        requestedField.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        res.status(200).send(req.user)
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body , { new: true, runValidators: true })
    } catch (error) {
        res.status(500).send(error)
    }
})

//?        USER - DELETE
router.delete('/user/me', auth, async (req, res) => {

    try {
        const deletedUser = await User.findByIdAndDelete(req.user._id)
        res.status(200).send(deletedUser)

    } catch (error) {
        res.status(500).send(error)
    }
})

//?        USER - PROFILE
router.get('/users/me',auth,async (req,res) => {

        console.log(req.user);
        res.status(200).send(req.user)
    // try {
    //     const users = await User.find({})
    //     res.status(200).send(users)
    //     console.log(users);

    // } catch (error) {

    //     res.status(400).send(error)    
    // }

})

//?        USER - LOGOUTALL (delete all tokens basically)
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

//?        USER - LOGOUT (delete last tokens basically)
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send({'done' : 'log out success'})
        console.log('.......................................');
    } catch (e) {
        console.log('errror..............................');
        res.status(500).send({'error' : 'Can not  log out'})
    }
})

module.exports = router

/*


router.get('/user/:id', async (req, res) => {

    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if(!user) {
            res.status(400).send('User not found!')
        }
        console.log(user); 
        res.status(200).send(user)

    } catch (error) {
        res.status(500).send(error)    
    }
})
*/