const fetch = require('node-fetch');
require('dotenv').config();

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

  // 🎯 All steps done → classify internally & summarize
  const leadType = classifyLead(leadState.metadata); // 🧠 Used for internal tracking only

  const summaryPrompt = [
    {
      role: "system",
      content: "You are a polite real estate assistant. Summarize the client's inputs and give a warm closing message.",
    },
    {
      role: "user",
      content: `Here are the buyer's preferences:
- Location: ${leadState.metadata.location}
- Property Type: ${leadState.metadata.propertyType}
- Budget: ${leadState.metadata.budget}
- Timeline: ${leadState.metadata.timeline}
- Site Visit Preference: ${leadState.metadata.siteVisit}

Please generate a friendly and polite closing message thanking them and mentioning that a property expert will follow up shortly.`,
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
