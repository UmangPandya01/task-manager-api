const jwt = require('jsonwebtoken')
const User = require('../model/user.js')

const auth = async (req, res, next) => {


    try {
        
    const token = req.header('Authorization').replace('Bearer ' , '')
    console.log('auth token  :  ' + token);
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    // console.log('decoded   :  ' + decoded._id);
    // console.log('decoded   :  ' + decoded);
    const user = await User.findOne({ _id: decoded._id , 'tokens.token': token}).catch((error) => console.log('User cannton found' + error))
    if(!user) {
        res.status(500).send('Unable to find user')
        // throw new Error('Unable to find user')
        console.log('can no ...........t');
        res.status(500).send({'error' : 'Unable to find user'})
        return;
    }

    req.token = token
    req.user = user

    next()
    } catch (error) {
        console.log('Error ' + error);
        res.status(400).send('please authenticate')
    }
    
}

module.exports = auth