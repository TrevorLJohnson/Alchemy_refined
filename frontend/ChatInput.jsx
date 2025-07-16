import React, { useState } from 'react';

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState('');

  function submit(e) {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  }

  return (
    <form onSubmit={submit} className="flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask a question…"
        className="w-full p-2 rounded bg-gray-800 text-white"
      />
    </form>
  );
}
