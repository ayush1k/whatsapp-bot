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

const leadProgress = {}; // Per-lead state tracking

const chatWithLLM = async (conversation, leadId) => {
  let leadState = leadProgress[leadId] || { step: 0, metadata: {} };

  // Save user's previous response (if any)
  const lastStep = FLOW_STEPS[leadState.step - 1];
  const userMessage = conversation[conversation.length - 1].content;
  if (lastStep) {
    leadState.metadata[lastStep.key] = userMessage;
  }

  // Move to next step
  const nextStep = FLOW_STEPS[leadState.step];
  if (nextStep) {
    leadState.step++;
    leadProgress[leadId] = leadState;
    return nextStep.question;
  }

  // If all steps are done, summarize + call LLM for natural closing
  const summaryPrompt = [
    {
      role: "system",
      content: "You are a helpful real estate assistant summarizing a buyer's needs.",
    },
    {
      role: "user",
      content: `Here are the buyer details:
- Location: ${leadState.metadata.location}
- Property: ${leadState.metadata.propertyType}
- Budget: ${leadState.metadata.budget}
- Timeline: ${leadState.metadata.timeline}
- Site Visit: ${leadState.metadata.siteVisit}

Summarize and give a polite closing message.`,
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
