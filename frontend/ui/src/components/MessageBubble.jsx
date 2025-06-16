import React from 'react';

const MessageBubble = ({ text, sender }) => {
  const isUser = sender === 'user';
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;
