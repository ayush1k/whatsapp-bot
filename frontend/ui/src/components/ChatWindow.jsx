import React from 'react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
      {messages.map((msg, index) => (
        <MessageBubble key={index} text={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
};

export default ChatWindow;
