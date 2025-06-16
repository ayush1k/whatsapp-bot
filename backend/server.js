const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory conversation tracking (could use a DB later)
const sessions = {};

// Simulated chatbot logic
const { chatWithLLM } = require('./chatbot');

// Routes
app.post('/chat', async (req, res) => {
  const { leadId = 'default', message } = req.body;

  if (!sessions[leadId]) {
    sessions[leadId] = [];
  }

  sessions[leadId].push({ role: 'user', content: message });

  try {
    const reply = await chatWithLLM(sessions[leadId]);
    sessions[leadId].push({ role: 'assistant', content: reply });

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
