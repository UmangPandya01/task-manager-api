const express = require('express')
const Task = require('../model/task')
const auth = require('../middleware/auth.js')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id,
    })

     try {
        await task.save() 
        res.status(201).send(task)

     } catch (error) {
         res.status(400).send(error)
     }
  
})

router.put('/tasks/:id', auth,  async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed', 'duration'] 
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation) {
        res.status(400).send({ error: 'enter data of relevent field'})
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if(!task) {
            res.status(404).send({'error' : 'unable to find task'})
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(200).send({'done': 'task has been  updated'})

    } catch (error) {
        res.status(500).send({'error': '500 error'})
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

        if(!deletedTask) {
            res.status(404).send({'error': 'task not found!'})
        }
        res.status(200).send({'done' : 'task has benn deleted'})

    } catch (error) {
        res.status(500).send({'error' : 'task has not deleted'})
    }
})

//? GET /tasks?completed=true
//? GET /tasks?limit=10&skip=20
//? GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth , async (req,res) => {

    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        
        await req.user.populate({
            path:'tasks',
            match,
            options: {
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort,
            },
        })
        .execPopulate()
        res.status(200).send(req.user.tasks)
        
    } catch (error) {
        console.log('error');
         res.status(500).send(error)
    }

})

router.get('/tasks/genre', auth , async(req, res) => {
    console.log(req.query.category);
    const match = {}
    try {
         match.category = req.query.category
        await req.user.populate({
            path:'tasks',
            match,
        })
        .execPopulate().catch((er) => {
            res.status(400).send({'error' : 'not match'})
        })
        res.status(200).send(req.user.tasks)
        
    } catch (error) {
        console.log(error);
        console.log('..Errorr....');
        res.status(500).send({'error' : 'can not find'})
    }
})
router.get('/tasks/:id' , auth , async (req, res) => {

    const match = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    try {
        if(!task)
        {
            res.status(400).send('unable to find out task')
        }
        res.status(200).send(task)

    } catch (error) {
         res.status(500).send(error)     
    }

})

module.exports = router 