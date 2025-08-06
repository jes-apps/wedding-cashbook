import React from 'react';
import './History.css';

function History({ entries, setEntries, handleDelete }) {
  const handleChange = (index, key, value) => {
    const updated = [...entries];
    if (key === 'amount' || key === 'ticketCount') {
      updated[index][key] = parseInt(value) || 0;
    } else {
      updated[index][key] = value;
    }
    setEntries(updated);
  };

  return (
    <div className="history-container">
      <h2>내역</h2>
      <div className="history-list">
        {entries.map((entry, index) => (
          <div key={entry.id} className="history-row">
            <input
              className="history-input"
              value={entry.number}
              onChange={(e) => handleChange(index, 'number', e.target.value)}
            />
            <input
              className="history-input"
              value={entry.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
            />
            <input
              className="history-input"
              value={entry.amount}
              onChange={(e) => handleChange(index, 'amount', e.target.value)}
            />
            <input
              className="history-input"
              value={entry.ticketCount}
              onChange={(e) => handleChange(index, 'ticketCount', e.target.value)}
            />
            <button className="delete-button" onClick={() => handleDelete(entry.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;