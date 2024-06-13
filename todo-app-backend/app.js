const express = require('express') // caching the modules on the first require call. returns a package
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const cors = require('cors');

const app = express(); // creating object for express function
const port = 3000;

//Middleware
app.use(bodyParser.json());
app.use(cors());

//DB : MySql Connection
const db = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password: 'Anu$ha1897',
    database: 'todo_app'
});

db.connect(err => {
    if(err){
        console.log('Error connection to MySqL : ', err )
        process.exit(1)
    }
    console.log('Connected to DB')
});

//Start the server
app.listen(port,()=>{
    console.log(`Server started running on ${port}`)
})
//Routes

//Create a new task
app.post('/tasks',(req,res)=>{
    const { title, completed } = req.body;
    db.query('INSERT INTO tasks (title, completed) VALUES (?, ?)', [title, completed || false],(err,result)=>{
        //console.log(query)
        if(err){
            return res.status(500).send('Error creating task')
        }
        res.status(201).send({ id: result.insertId, title, completed: completed || false });
    });
})

//Get All tasks
app.get('/tasks',(req,res)=>{
    db.query('SELECT * FROM tasks',(err,results) => {
        if(err){
            return res.status(500).send('Error fetching tasks')
        }
        res.send(results)
    })
});

//Get a single task by id
app.get('/tasks/:id',(req,res)=>{
    const {id} = req.params;
    db.query('SELECT * from tasks where id = ?',[id],(err,results)=>{
        if(err){
           return res.status(500).send('Error fetching status')
        }
        if(results.length === 0){
            return res.status(404).send('Task not found')
        }
        res.send(results[0])
    })
})

//Update a task
app.patch('/tasks/:id',(req,res)=>{
    const {id} = req.params;
    const updates = req.body;
    db.query('UPDATE tasks SET ? where id = ?',[updates,id],(err,result)=>{
        if(err){
           return res.status(500).send('Error updateing status')
        }
        if(result.affectedRows === 0){
           return res.status(404).send('Task not found')
        }
        res.send('Task Updated')
    })
});

//Delete a task by id
app.delete('/tasks/:id',(req,res)=>{
    const {id} = req.params
    db.query('DELETE FROM tasks where id = ?' , [id] , (err,result)=>{
        if(err){
            return res.status(500).send('Error deleting the task')
        }
        if(result.affectedRows === 0){
            return res.status(404).send('Task not found')
        }
        res.send('Task deleted')
    })
})
