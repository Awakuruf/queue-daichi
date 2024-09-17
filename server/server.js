const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

// Enable CORS for all requests
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.log(uri);
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.log("Error connecting to the database: ", error);
  }
}

connect();

// Define the schema for the question
const questionSchema = new mongoose.Schema({
  name: String,
  questionTopic: String,
}, { collection: 'Cogs300' });

// Create the model
const Question = mongoose.model('Question', questionSchema);

// Route to get the current queue (all questions)
app.get('/queue', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to add a student and question topic to the queue
app.post('/join', async (req, res) => {
  const { name, questionTopic } = req.body;

  if (name && questionTopic) {
    try {
      const question = new Question({ name, questionTopic });
      await question.save();
      res.status(200).send({ message: `${name} has joined the queue with the question topic: ${questionTopic}` });
    } catch (error) {
      res.status(500).send({ message: 'Error saving question', error });
    }
  } else {
    res.status(400).send({ message: 'Both name and question topic are required' });
  }
});

// Route to remove the next student from the queue
app.post('/next', async (req, res) => {
  try {
    const nextQuestion = await Question.findOneAndDelete(); // Remove the first in the queue
    if (nextQuestion) {
      res.status(200).send({ message: `${nextQuestion.name} has been removed from the queue` });
    } else {
      res.status(400).send({ message: 'Queue is empty' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
