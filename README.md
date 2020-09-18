<h1>API for Todo list</h1>
# REST API application

This is an api example for a todo list.

## Documentation

* [Installation](#Installation)
* [Getting Started](#Run-the-app)
* [Rest API](#REST-API)
	- [Get list of todos](#Get-list-of-todos)
	- [Create a new todo](#Create-a-new-todo)
	- [Get todo by id](#Get-todo-by-id)
    - [Get a non-existent todo](#Get-a-non-existent-todo)
    - [Change a toggle todo](#Change-a-toggle-todo-status-complete-/-failed)
    - [Get completed todos](#Get-filtered-tasks-by-type-completed)
    - [Get current todos](#Get-filtered-tasks-by-type-current)
    - [Delete todo by id ](#Delete-todo-by-id)

## Installation

    git clone https://github.com/loveyousomuch554/Todo-API.git & npm i

## Run the app

    npm run server

## Run the tests

    npm run test

# REST API

The REST API to the todo list is described below.

## Get list of todos

### Request

`GET /todos`

    curl http://localhost:8080/todos/

### Response
    [
        {
            "_id":"5f64a14770c2231b1ea731be",
            "task":"some task",    
            "done":false,
            "created_at":"2020-09-18T12:00:07.712Z",   
            "updatedAt":"2020-09-18T12:11:42.900Z",
            "__v":0    
        }
    ]

## Create a new todo

### Request

`POST /todos`

    curl -H 'Content-type: application/json' -d '{ "task": "some task", "done": false }' -X POST http://localhost:8080/todos

### Response

    {
        "_id":"5f64a14770c2231b1ea731be",
        "task":"some task",    
        "done":false,
        "created_at":"2020-09-18T12:00:07.712Z",   
        "updatedAt":"2020-09-18T12:11:42.900Z",
        "__v":0    
    }

## Get todo by id

### Request

`GET /todos/:id`

    curl http://localhost:8080/todos/5f64a14770c2231b1ea731be

### Response

    {
        "_id":"5f64a14770c2231b1ea731be",
        "task":"some task",    
        "done":false,
        "created_at":"2020-09-18T12:00:07.712Z",   
        "updatedAt":"2020-09-18T12:11:42.900Z",
        "__v":0    
    }

## Get a non-existent todo

### Request

`GET /todos/:id`

    curl http://localhost:8080/todos/123

### Response
    NOT FOUND

## Change a toggle todo status complete / failed 

### Request

`PUT /todos/:id`

    curl -H 'Content-type: application/json' -X PUT http://localhost:8080/todos/5f64a14770c2231b1ea731be

### Response

    {
        "_id":"5f64a14770c2231b1ea731be",
        "task":"some task",    
        "done":true,
        "created_at":"2020-09-18T12:00:07.712Z",   
        "updatedAt":"2020-09-18T12:11:42.900Z",
        "__v":0    
    }

## Get filtered tasks by type completed

### Request

`GET /todos/filtered/completed`

    curl http://localhost:8080/todos/filtered/completed

### Response

    [
        {
            "_id":"5f64a14770c2231b1ea731be",
            "task":"some task",
            "done":true,
            "created_at":"2020-09-18T12:00:07.712Z",
            "updatedAt":"2020-09-18T13:50:06.983Z",
            "__v":0
        }
    ]

## Get filtered tasks by type current

### Request

`GET /todos/filtered/current`

    curl http://localhost:8080/todos/filtered/current

### Response

    [
        {
            "_id":"5f64b525b3e9f81ed7fd0f5e",
            "task":"some cool task that has not yet been done",
            "done":false,
            "created_at":"2020-09-18T13:24:53.082Z",
            "updatedAt":"2020-09-18T13:24:53.082Z",
            "__v":0
        }
    ]

## Delete todo by id 

### Request

`DELETE /todos/:id`

    curl -X DELETE http://localhost:8080/todos/5f64b525b3e9f81ed7fd0f5e

### Response

    {
        "_id":"5f64b525b3e9f81ed7fd0f5e",
        "task":"some task",
        "done":true,
        "created_at":"2020-09-18T15:24:30.977Z",
        "updatedAt":"2020-09-18T15:24:30.977Z",
        "__v":0
    }