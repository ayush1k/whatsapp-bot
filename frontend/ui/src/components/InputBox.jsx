import React, { useState } from 'react';

const InputBox = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="p-2 w-full border rounded-lg border-gray-300"
      />
      <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
        Send
      </button>
    </form>
  );
};

export default InputBox;
