const fetch = require('node-fetch');
require('dotenv').config();

const chatWithLLM = async (messages) => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages,
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  // 🧪 Log full response if something goes wrong
  if (!data.choices || !data.choices.length) {
    console.error('🛑 Groq API Error:', JSON.stringify(data, null, 2));
    return "Sorry, I'm having trouble understanding that. Can you please try again?";
  }

  return data.choices[0].message.content;
};

module.exports = { chatWithLLM };
