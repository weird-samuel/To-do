const express = require('express');
const { writeFileSync, readFileSync } = require('fs');
const { resolve } = require('path');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.static('assets'))

app.get('/', (req, res) => res.sendFile(resolve("assets", 'pages', 'home.html')))

app.get('/add-task', (req, res) => {
    let { title } = req.query
    let task = { title, id: Date.now(), completed: false }
    let allTasks = readFileSync(resolve('tasks.json'), 'utf-8') || '[]'
    allTasks = JSON.parse(allTasks)
    if (Array.isArray(allTasks)) {
        allTasks.push(task)
    }

    writeFileSync(resolve('tasks.json'), JSON.stringify(allTasks))
    res.json(task)
})

app.get('/all-tasks', (req, res) => {
    let allTasks = readFileSync(resolve('tasks.json'), 'utf-8') || '[]'
    allTasks = JSON.parse(allTasks)
    res.json(allTasks);
})
app.get('/task/:id/change-status', (req, res) => {
    let { id } = req.params
    let allTasks = readFileSync(resolve('tasks.json'), 'utf-8') || '[]'
    allTasks = JSON.parse(allTasks)
    allTasks = allTasks.map((v) => {
        if (v.id == id) {
            v.completed = !v.completed;
        }
        return v
    })
    try {
        writeFileSync(resolve('tasks.json'), JSON.stringify(allTasks))
        res.json(1)
    } catch (error) {
        res.json(0)
    }
})
app.get('/task/:id/delete', (req, res) => {
    let { id } = req.params
    let allTasks = readFileSync(resolve('tasks.json'), 'utf-8') || '[]'
    allTasks = JSON.parse(allTasks)
    allTasks = allTasks.filter((v) => v.id != id)
    try {
        writeFileSync(resolve('tasks.json'), JSON.stringify(allTasks))
        res.json(1)
    } catch (error) {
        res.json(0)
    }
})
app.get('/task/delete-all', (req, res) => {
    writeFileSync(resolve('tasks.json'), '')
    res.send(1)
 })
app.listen(port, () => console.log("Server is listening on port 4000\n Visit: http://localhost:4000"))