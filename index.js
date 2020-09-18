const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const PORT = config.get('port'), mongoID = config.get('mongoID')
const { Todo: Todo_model } = require('./models/todo')
const mongoose = require('mongoose')

// Access to cors
const cors = require('cors'); 
app.use(cors());

// Connect database 
mongoose.connect(mongoID, { useNewUrlParser: true , useUnifiedTopology: true });
mongoose.set('useFindAndModify', false)

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/json
app.use(bodyParser.json())

// Get all tasks 
app.get('/todos', (req, res) => {   
    Todo_model.find({}, (err, tasks) => {
        if(err) {
            res.status(500).send('INTERNAL SERVER ERROR')
            console.error(err)
            return 
        }

        res.json(tasks)
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
    res.json(req.task)
})

// Add new task  
app.post('/todos', (req, res) => {
    const { task, done } = req.body

    // Character limit for writing
    const N = 200;

    if(task.length > N) {
        return res.status(400).send('BAD REQUEST')
    }

    const newTodo = { task, done }
    Todo_model.create(newTodo, (err, todo) => {
        if(err) {
            res.status(500).send('INTERNAL SERVER ERROR')
            console.error(err)
            return 
        }

        res.json(todo)
    })
})

// Toggle task status complete / failed
app.put('/todos/:id', isTodoExist, (req, res) => {
    let { done } = req.task
    let { id } = req.params

    Todo_model.findOneAndUpdate({ _id: id }, { done: !done }, (err, todo) => {
        if(err) {
            res.status(400).send('BAD REQUEST')
            console.error(err)
            return 
        }

        todo.done = !done
        res.json(todo)
    })
})

// Delete task 
app.delete('/todos/:id', isTodoExist, (req, res) => {
    let { _id } = req.task

    Todo_model.findByIdAndDelete(_id, (err, deletedTodo) => {
        if(err) {
            res.status(500).send('INTERNAL SERVER ERROR')
            console.log(err)
            return
        }
        res.json(deletedTodo)
    })
})

// Middleware for checking the existence of a task
async function isTodoExist(req, res, next) {
    const { id } = req.params

    Todo_model.findById(id, (err, task) => {
        if(err) {
            res.status(500).send('INTERNAL SERVER ERROR')
            return
        }
        else if (task === null) {
            res.sendStatus(404)
            return
        }

        // Add a task to the request for further use
        req.task = task
        next()
    }) 
}

// Start server
app.listen(PORT, () => {
    console.log('Server run on http://localhost:8080')
}) 