const fetch = require('node-fetch');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { stringify } = require('csv-stringify/sync');

// 👇️ Predefined step-by-step questions
const FLOW_STEPS = [
  { key: 'location', question: "Hi! I’m your GrowEasy real estate assistant. Could you share which city/location you’re looking for?" },
  { key: 'propertyType', question: "Great! Are you looking for a flat, villa, or plot? Also, is this for investment or personal use?" },
  { key: 'budget', question: "Understood! What’s your budget range? (e.g., 50L–80L)" },
  { key: 'timeline', question: "Got it. When do you plan to move in or finalize your purchase?" },
  { key: 'siteVisit', question: "Thanks! Would you like to schedule a site visit this week? We have ready-to-move options matching your criteria." },
];

// In-memory lead tracking
const leadProgress = {};

// 🔍 Classify lead based on heuristics
const classifyLead = (meta) => {
  const values = Object.values(meta).join(' ').toLowerCase();
  if (/^[0-9\s]+$/.test(values) || values.includes('asdf') || values.includes('qwerty')) return 'Invalid';
  if (meta.location && meta.propertyType && meta.budget && meta.timeline && meta.timeline.toLowerCase().includes('month')) return 'Hot';
  if (values.includes('just browsing') || !meta.budget || !meta.timeline) return 'Cold';
  return 'Cold';
};

// 💾 Save lead data to CSV with timestamp in /data folder
const saveLeadToCSV = (metadata, leadId, leadType) => {
  const dataDir = path.join(__dirname, 'data');
  const csvFile = path.join(dataDir, 'leads.csv');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const headers = ['Timestamp', 'Lead ID', 'Location', 'Property Type', 'Budget', 'Timeline', 'Site Visit', 'Lead Type'];
  const timestamp = new Date().toISOString();

  const row = [
    timestamp,
    leadId,
    metadata.location || '',
    metadata.propertyType || '',
    metadata.budget || '',
    metadata.timeline || '',
    metadata.siteVisit || '',
    leadType,
  ];

  const fileExists = fs.existsSync(csvFile);
  const csv = stringify([row], { header: !fileExists, columns: headers });

  fs.appendFileSync(csvFile, csv);
};

const chatWithLLM = async (conversation, leadId) => {
  let leadState = leadProgress[leadId] || { step: 0, metadata: {} };

  const lastStep = FLOW_STEPS[leadState.step - 1];
  const userMessage = conversation[conversation.length - 1]?.content;
  if (lastStep && userMessage) {
    leadState.metadata[lastStep.key] = userMessage;
  }

  const nextStep = FLOW_STEPS[leadState.step];
  if (nextStep) {
    leadState.step++;
    leadProgress[leadId] = leadState;
    return nextStep.question;
  }

  // ✅ All steps completed → classify and save
  const leadType = classifyLead(leadState.metadata);
  saveLeadToCSV(leadState.metadata, leadId, leadType);

  const summaryPrompt = [
    {
      role: "system",
      content: "You are a polite real estate assistant. Summarize the user's preferences naturally and generate a warm closing message without using phrases like 'Here's a summary' or 'To recap'.",
    },
    {
      role: "user",
      content: `Here are the buyer's preferences:
- Location: ${leadState.metadata.location}
- Property Type: ${leadState.metadata.propertyType}
- Budget: ${leadState.metadata.budget}
- Timeline: ${leadState.metadata.timeline}
- Site Visit Preference: ${leadState.metadata.siteVisit}

Please write a friendly and professional closing message, and mention that a property expert will follow up soon.`,
    },
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: summaryPrompt,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      console.error('🛑 Groq API Error:', JSON.stringify(data, null, 2));
      return "Sorry, I'm having trouble generating a final message.";
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error('❌ Final summary error:', err);
    return "Oops! Something went wrong. We'll follow up soon.";
  }
};

module.exports = { chatWithLLM };
