# 🏡 GrowEasy Real Estate Assistant Chatbot

This is a full-stack intelligent assistant built for GrowEasy to qualify real estate leads through a guided conversational flow. The frontend is developed using **React + Tailwind CSS**, while the backend uses **Node.js + Express** with integration to the **Groq LLM API (LLaMA 3 model)**.

---

## 📌 Features

- 💬 Step-by-step real estate lead qualification via chat
- 🔥 Classifies leads as **Hot**, **Cold**, or **Invalid**
- 🤖 Generates natural, polite closing messages using LLM
- 💾 In-memory lead tracking (extendable to CSV)
- ⚙️ Modular backend using Express.js
- 📱 Responsive frontend with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend:
- React
- Tailwind CSS

### Backend:
- Node.js
- Express.js
- `dotenv` for environment variable management
- `csv-stringify` for optional CSV output
- `node-fetch` for API calls
- Groq LLM (`llama3-8b-8192`)

---

## 🚀 Project Setup

### Prerequisites:
- Node.js installed
- Internet connection
- Groq API key (you'll need this in your `.env`)

---

### 🔧 Backend Setup

```bash
cd backend
npm install


Create a .env file inside the backend/ directory:

GROQ_API_KEY=your_groq_api_key_here
Start the backend server:

bash
node server.js

|---

🎨 Frontend Setup
bash
Copy
Edit
cd frontend/ui
npm install
npm run dev
This will start the React frontend at:
👉 http://localhost:5173

|-----

🧠 Chat Flow
The chatbot walks the user through 5 guided steps:

📍 Location Preference

🏠 Property Type (flat, villa, plot) + purpose (personal/investment)

💸 Budget Range

📆 Timeline to finalize or move

🗓️ Site Visit preference

After all inputs are collected, a final closing message is generated using Groq LLM.



|--------------

🗃️ Sample Input/Output
Conversation:

vbnet
Copy
Edit
User: I’m looking in Bangalore  
Bot: Great! Are you looking for a flat, villa, or plot? Also, is this for investment or personal use?  
User: 2BHK flat for personal use  
Bot: Understood! What’s your budget range?  
User: Around ₹70–80L  
Bot: Got it. When do you plan to move in or finalize your purchase?  
User: In 2-3 months  
Bot: Thanks! Would you like to schedule a site visit this week?  
User: Yes  
Bot: [LLM-generated response]
Final Message:

Thank you for sharing ysour preferences! We’ll have a property expert follow up with options tailored to your needs.

|------------------

📁 File Structure

project-root/
├── backend/
│   ├── chatbot.js
│   ├── server.js
│   ├── .env
│   └── requirements.txt
├── frontend/
│   └── ui/
│       ├── App.jsx
│       └── ...
└── README.md


|------------------
