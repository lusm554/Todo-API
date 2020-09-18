const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const PORT = config.get('port'), mongoID = config.get('mongoID')
const { Todo: Todo_model } = require('./models/todo')
const mongoose = require('mongoose')

// Use cors for testing api 
const cors = require('cors'); 
app.use(cors());

// Connect database 
mongoose.connect(mongoID, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.set('useFindAndModify', false)

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/json
app.use(bodyParser.json())

// Get all tasks 
app.get('/todos', (req, res) => {   
    Todo_model.find({}, (err, todos) => {
        if(err) {
            res.status(500).send('INTERNAL SERVER ERROR')
            console.error(err)
            return 
        }

        res.json(todos)
    })
})

// Get filtered tasks by type completed
app.get('/todos/filtered/completed', async (req, res) => {
    Todo_model.find({ done: true }, (err, completedTasks) => {
        if(err) {
            res.status(500).send('INTERNAL SERVER ERROR')
            console.error(err)
            return 
        }

        res.json(completedTasks)
    })
})

// Get filtered tasks by type current
app.get('/todos/filtered/current', (req, res) => {
    Todo_model.find({ done: false }, (err, currentTasks) => {
        if(err) {
            res.status(500).send('INTERNAL SERVER ERROR')
            console.error(err)
            return 
        }

        res.json(currentTasks)
    })
})

// Get task by id 
app.get('/todos/:id', isTodoExist, (req, res) => {
    res.json(req.todo)
})

// Add new task  
app.post('/todos', (req, res) => {
    const { task, done } = req.body

    // Character limit for writing
    const N = 200;

    if(task.length > N) {
        return res.status(400).send('BAD REQUEST')
    }

    const todo = { task, done }
    Todo_model.create(todo, (err, doc) => {
        if(err) {
            res.status(500).send('INTERNAL SERVER ERROR')
            console.error(err)
            return 
        }

        res.json(doc)
    })
})

// Toggle recording status complete / failed
app.put('/todos/:id', isTodoExist, (req, res) => {
    let { done } = req.todo
    let { id } = req.params

    Todo_model.findOneAndUpdate({ _id: id }, { done: !done }, (err, todo) => {
        if(err) {
            res.status(500).send('BAD REQUEST')
            console.error(err)
            return 
        }

        todo.done = !done
        res.json(todo)
    })
})

// Middleware for checking the existence of a task
async function isTodoExist(req, res, next) {
    const { id } = req.params
    let todo = await Todo_model.findById(id)

    if(todo === null) {
        return res.status(400).send('BAD REQUEST')
    }
    req.todo = todo
    next()
}

// Start server
app.listen(PORT, () => {
    console.log('Server run on http://localhost:8080')
}) 