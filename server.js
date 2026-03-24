const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let comments = [];

app.get('/comments', (req, res) => {
  const sorted = comments.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(sorted);
});

app.post('/comments', (req, res) => {
  const { username, message, date } = req.body;

  const newComment = {
    id: Date.now(),
    username,
    message,
    date
  };

  comments.push(newComment);

  res.status(201).json(newComment);
});

app.delete('/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);

  comments = comments.filter(c => c.id !== id);

  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
