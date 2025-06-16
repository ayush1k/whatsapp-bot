const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory conversation tracking
const sessions = {};

// Simulated chatbot logic
const { chatWithLLM } = require('./chatbot');

// Routes
app.post('/chat', async (req, res) => {
  try {
    const { leadId = 'default', message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    // Create session if not exist
    if (!sessions[leadId]) {
      sessions[leadId] = [];
    }

    // Push user message
    sessions[leadId].push({ role: 'user', content: message });

    // Get LLM response
    const reply = await chatWithLLM(sessions[leadId]);

    // Save assistant message
    sessions[leadId].push({ role: 'assistant', content: reply });

    res.json({ reply });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Failed to generate response from LLM' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
