const nodeFetch = require('node-fetch');
require('dotenv').config();

const chatWithLLM = async (messages) => {
  const response = await nodeFetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

module.exports = { chatWithLLM };
