const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const PORT = config.get('port'), mongoID = config.get('mongoID')
const { Todo: Todo_model } = require('./models/todo')
const mongoose = require('mongoose')

// use cors for testing api 
const cors = require('cors'); 
app.use(cors());

mongoose.connect(mongoID, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.set('useFindAndModify', false)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


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

app.get('/todos/:id', isTodoExist, (req, res) => {
    res.json(req.todo)
})

app.post('/todos', (req, res) => {
    const { task, done } = req.body
    // ограничение символов для записи 
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

async function isTodoExist(req, res, next) {
    const { id } = req.params
    let todo = await Todo_model.findById(id)

    if(todo === null) {
        return res.status(400).send('BAD REQUEST')
    }
    req.todo = todo
    next()
}

app.listen(PORT, () => {
    console.log('Server run on http://localhost:8080')
}) 