const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: 13,
        lowercase: true,
        validator(value){
              
            if(!validator.isEmail(value))
            {
                throw new Error('Please enter valid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validator(value) {

            if(value.length <= 5) {
               throw new Error("Password should cointain min 6 character");
            }
            else if(value.toLowercase().includes('password')) {
                throw new Error('Please set a strong password');
            }
        }
    },
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: 4,
    }, 
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

},{
    timestamp: true,
})

//* Create a connection between user and task
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField : 'owner',
})

//* Hashing password before save to mongodb
userSchema.pre('save', async  function (next) {

    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.methods.toJSON =  function () {

    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.getAuthToken = async function () {

    const user = this

    //* for unique identifier here i provide _id
    const token = jwt.sign({ _id: user._id.toString()} , process.env.JWT_SECRET, {expiresIn: '7 days'})

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token
}


//* Credentials
userSchema.statics.findByCredentials = async ( email , password) => {
    console.log(email);
    console.log(email.toString());
    const user = await User.findOne({ email })

    if(!user) {
        console.log('unable to find email');
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch) {
        console.log('unable to match password');

        throw new Error('Unable to login!')
    }

    // const user2 = await User.find({})
    // const isAvail = user2.find((name) => {
    //     return user.name === name
    // })

    // if(isAvail) {
    //     throw new Error('Username is already taken!')
    // }

    return user
}
const User = mongoose.model('User', userSchema)

module.exports = User