const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const tasksFile = path.join(__dirname, 'tasks.json');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


const readTasks = () => {
    try {
        return JSON.parse(fs.readFileSync(tasksFile, 'utf8')) || [];
    } catch (err) {
        return [];
    }
};


const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2), 'utf8');
};


app.get('/', (req, res) => {
    res.redirect('/tasks');
});


app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.render('tasks', { tasks });
});


app.get('/task', (req, res) => {
    const { id } = req.query;
    const tasks = readTasks();
    const task = tasks.find(t => t.id === Number(id));
    if (task) {
        res.render('task', { task });
    } else {
        res.status(404).send("Task not found");
    }
});


app.get('/add-task', (req, res) => {
    res.render('addTask');
});


app.post('/add-task', (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).send("Title is required");

    let tasks = readTasks();
    const newTask = { id: tasks.length + 1, title };
    tasks.push(newTask);
    writeTasks(tasks);

    res.redirect('/tasks');
});


const PORT = 3000;
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));
