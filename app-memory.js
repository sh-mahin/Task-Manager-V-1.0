const express = require('express');
const app = express();
app.use(express.json());

let tasks = [];
let nextId = 1;

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);

  if (!task) return res.status(404).json({ msg: 'Task not found' });

  res.json(task);
});

app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ msg: 'Title is required and cannot be empty' });
  }

  const validStatuses = ['To Do', 'In Progress', 'Completed'];
  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Invalid status. Must be: To Do, In Progress, or Completed' });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : '',
    status: status || 'To Do',
  };

  tasks.push(task);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ msg: 'Task not found' });

  const { title, description, status } = req.body;

  if (title !== undefined && title.trim() === '') {
    return res.status(400).json({ msg: 'Title cannot be empty' });
  }

  const validStatuses = ['To Do', 'In Progress', 'Completed'];
  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Invalid status. Must be: To Do, In Progress, or Completed' });
  }

  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description ? description.trim() : '';
  if (status !== undefined) task.status = status;

  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ msg: 'Task not found' });

  tasks.splice(idx, 1);
  res.json({ msg: 'Deleted' });
});

const port = 3000;
app.listen(port, () => console.log(`Simple Task Manager running on ${port}`));
