import React, { useState } from 'react';
import CategorySummary from './CategorySummary';
import RealTimeInsight from './RealTimeInsight';
import ChatInput from './ChatInput';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [currentTimestamp, setCurrentTimestamp] = useState(null);

  async function handleSend(text) {
    console.log('⚡️ handleSend fired with:', text);

    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();
      console.log('↪ chat response JSON:', json);

      if (json.error) {
        console.error('Backend error:', json.error);
        return;
      }

      // 1) update pie-chart data
      setCurrentCategories(json.categories || []);
      setCurrentTimestamp(json.timestamp || null);

      // 2) update history list
      setHistory((h) => [
        ...h,
        {
          timestamp:  json.timestamp,
          categories: (json.categories || []).map((c) => c.name),
        },
      ]);

      // 3) (Optional) render chat bubbles:
      // addChatBubble('user', text);
      // addChatBubble('assistant', json.reply);

    } catch (err) {
      console.error('Chat error:', err);
    }
  }

  return (
    <div className="flex gap-6">
      <CategorySummary history={history} />
      <RealTimeInsight
        timestamp={currentTimestamp}
        currentCategories={currentCategories}
      />
      <ChatInput onSend={handleSend} />
    </div>
  );
}
