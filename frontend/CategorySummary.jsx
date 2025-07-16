import React from 'react';

export default function CategorySummary({ history }) {
  const latest = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="bg-dark-panel p-4 rounded">
      <h3 className="text-lg font-semibold text-purple-400">Category Summary</h3>

      {/* Current Categories */}
      <div className="mt-2">
        <h4 className="font-medium text-purple-300">Current Categories</h4>
        {latest ? (
          <ul className="list-disc list-inside text-purple-200">
            {latest.categories.map((cat, i) => (
              <li key={i}>{cat}</li>
            ))}
          </ul>
        ) : (
          <p className="text-purple-200">No data yet</p>
        )}
      </div>

      {/* Historical entries */}
      {history.map((entry, idx) => (
        <div key={idx}>
          <h4 className="mt-4 font-medium text-purple-300">{entry.timestamp}</h4>
          <ul className="list-disc list-inside text-purple-200">
            {entry.categories.map((cat, i) => (
              <li key={i}>{cat}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
