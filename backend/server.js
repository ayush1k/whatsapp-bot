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

// Import chatbot logic
const { chatWithLLM } = require('./chatbot');

// Routes
app.post('/chat', async (req, res) => {
  try {
    const { leadId = 'default', message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    // Initialize session if needed
    if (!sessions[leadId]) {
      sessions[leadId] = [];
    }

    // Add user message to session
    sessions[leadId].push({ role: 'user', content: message });

    // 🔄 Pass leadId for step tracking
    const reply = await chatWithLLM(sessions[leadId], leadId);

    // Add assistant's reply to session
    sessions[leadId].push({ role: 'assistant', content: reply });

    // Send reply to frontend
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
