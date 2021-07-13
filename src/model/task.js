const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    category: {
        type: String,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 10,
        maxLength: 100,
        validator(value) {
            if(value.length < 10) {
                throw new Error('Enter atleast 10 characters');
            }
        }
    },
    duration: {
        type: Number,
        // required: true,
        min: 10,
        max: 300,
        validator(value) {
            if(value < 10) {
                throw new Error('Enter logical duration time :)');
            }
        }
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
},{
    timestamp: true,
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
