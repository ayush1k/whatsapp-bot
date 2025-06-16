import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import InputBox from './components/InputBox';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [leadId, setLeadId] = useState(null);

  const sendMessage = (message) => {
    // Add user message to chat
    const newMessage = { text: message, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Simulate sending the message to backend
    fetchChatResponse(message);
  };

  const fetchChatResponse = async (message) => {
    // Example of interaction with backend (you'll need to create the API)
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, message }),
    });

    const data = await response.json();
    const agentMessage = { text: data.reply, sender: 'agent' };
    setMessages((prevMessages) => [...prevMessages, agentMessage]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-center mb-4">GrowEasy Chatbot</h1>
      <ChatWindow messages={messages} />
      <InputBox onSend={sendMessage} />
    </div>
  );
};

export default App;
