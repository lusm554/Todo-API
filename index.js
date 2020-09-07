const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { nanoid } = require('nanoid')

// use cors for testing api 
const cors = require('cors'); 
app.use(cors());

const Todos = new Map()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

/**
 * Получить все записи. 
 * 
 * @example fetch('http://localhost:8080/todos/') 
 */
app.get('/todos', (req, res) => {   
    const AllTodos = getAllTodos()
    
    res.json(AllTodos)
})

/**
 * Получить выполненные записи.
 * 
 * @example fetch('http://localhost:8080/todos/filtered/completed')
 */
app.get('/todos/filtered/completed', (req, res) => {
    const AllTodos = getAllTodos()
    const completed = AllTodos.filter(todo => {
        return todo.done
    })
    
    res.json({ completed })
})

/**
 * Получить текущие записи.
 *  
 * @example fetch('http://localhost:8080/todos/filtered/current')
 */
app.get('/todos/filtered/current', (req, res) => {
    const AllTodos = getAllTodos()
    const current = AllTodos.filter(todo => {
        return !todo.done
    })
    
    res.json({ current })
})

/**
 * Получить запись по id.
 * 
 * @example fetch('http://localhost:8080/todos/<id_here>')
 */
app.get('/todos/:id', isTodoExist, (req, res) => {
    let todo = req.todo

    res.json(todo)
})


/**
 * Добавление новой записи. 
 * 
 * @example fetch('http://localhost:8080/todos' {
 *  method: 'POST',
 *  headers: {
 *    'Content-Type': 'application/json'
 *  },
 *  body: "{\"task\":\"do something\",\"done\":false}"
 * })
 */
app.post('/todos', (req, res) => {
    const { task, done } = req.body
    // ограничение символов для записи 
    const N = 200;

    if(task.length > N) {
        return res.status(400).send('BAD REQUEST')
    }

    let id = nanoid()
    let todo = { id, task, done }

    Todos.set(id, todo)
    res.json(todo)
})

/**
 * Переключение статуса записи Выполнено/Не выполнено 
 * 
 * @example fetch('http://localhost:8080/todos/<id_here>', {
 *  method: 'PUT',
 *  headers: {
 *    'Content-Type': 'application/json'
 *  }
 * })
 */
app.put('/todos/:id', isTodoExist, (req, res) => {
    let { id, task, done } = req.todo
    let todo = { id, task, done: !done }

    Todos.set(id, todo)
    res.json(todo)
})

function getAllTodos() {
    return Array.from( Todos.values() )
}

function isTodoExist(req, res, next) {
    const { id } = req.params
    let todo = Todos.get(id)

    if(todo === undefined) {
        return res.status(400).send('BAD REQUEST')
    }
    req.todo = todo
    next()
}

app.listen(8080) 