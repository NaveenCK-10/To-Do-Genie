const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const validator = require('validator');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/todoAppDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Invalid email'],
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const Todo = mongoose.model('Todo', todoSchema);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/todo-genie', (req, res) => {
  res.sendFile(__dirname + '/public/todo.html');
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;


  if (!/@(gmail|yahoo)\.com$/.test(email)) {
    return res.status(400).send('Invalid email domain (only @gmail or @yahoo allowed)');
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send('User not found');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).send('Incorrect password');
  }

  res.redirect('/todo-genie');
});


app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  
  if (!/@(gmail|yahoo)\.com$/.test(email)) {
    return res.status(400).send('Invalid email domain (only @gmail or @yahoo allowed)');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashedPassword });
  await user.save();
  res.redirect('/');
});


app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});


app.post('/api/todos', async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  await todo.save();
  res.json(todo);
});


app.listen(4058, () => {
  console.log('Server started at http://localhost:4058');
});
