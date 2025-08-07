import React, { useState } from 'react';
import './Home.css';

function Home({ entries, setEntries, autoNumber, setAutoNumber }) {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);

  const handleAmountClick = (label) => {
    const value = parseInt(label.replace('만원', '')) * 10000;
    setAmount(prev => prev + value);
  };

  const handleTicketClick = (count) => {
    setTicketCount(prev => prev + count);
  };

  const handleRegister = () => {
    const usedNumber = number || autoNumber.toString();

    const newEntry = {
      id: Date.now(),
      number: usedNumber,
      name,
      amount,
      ticketCount,
    };

    setEntries([newEntry, ...entries]);
    setName('');
    setAmount(0);
    setTicketCount(0);
    setNumber('');

    const usedNumberInt = parseInt(usedNumber);
    setAutoNumber(isNaN(usedNumberInt) ? autoNumber + 1 : usedNumberInt + 1);
  };

  const handleDelete = (id) => {
    const index = entries.findIndex(entry => entry.id === id);
    if (index === -1) return;

    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    const targetEntry = entries[index];
    const currentNumber = parseInt(targetEntry.number);
    const isLast = index === 0;

    const updated = [...entries];
    updated.splice(index, 1); // 삭제

    if (isLast) {
      setEntries(updated);
      if (!isNaN(currentNumber) && currentNumber === autoNumber - 1) {
        setAutoNumber(prev => Math.max(1, prev - 1));
      }
    } else {
      const confirmReorder = window.confirm('번호를 재정렬할까요?');
      if (confirmReorder) {
        const reordered = updated.map(entry => {
          const entryNum = parseInt(entry.number);
          if (!isNaN(entryNum) && entryNum > currentNumber) {
            return { ...entry, number: (entryNum - 1).toString() };
          }
          return entry;
        });
        setEntries(reordered);

        if (!isNaN(currentNumber) && currentNumber === autoNumber - 1) {
          setAutoNumber(prev => Math.max(1, prev - 1));
        }
      } else {
        setEntries(updated);
        // autoNumber는 유지 (재정렬 안 했으므로)
      }
    }
  };

  return (
    <div className="home-container">
      <h2>축의금장부</h2>

      <div className="section dual-input">
        <div className="input-group number-group">
          <label>번호</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder={` ${autoNumber}`}
          />
        </div>
        <div className="input-group name-group">
          <label>이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <div className="current-value">
        현재 금액: {amount.toLocaleString()}원
        <button className="inline-x" onClick={() => setAmount(0)}>X</button>
      </div>

      <div className="section">
        <div className="money-buttons">
          {['1만원', '5만원', '10만원', '30만원', '50만원', '100만원'].map(btn => (
            <button key={btn} onClick={() => handleAmountClick(btn)}>{btn}</button>
          ))}
        </div>
      </div>

      <div className="current-value">
        식권: {ticketCount}장
        <button className="inline-x" onClick={() => setTicketCount(0)}>X</button>
      </div>

      <div className="section">
        <div className="ticket-buttons">
          {[1, 2, 3].map(num => (
            <button key={num} onClick={() => handleTicketClick(num)}>{num}</button>
          ))}
        </div>
      </div>

      <button className="register-button" onClick={handleRegister}>등록</button>

      <h3>최근 등록</h3>
      <div className="entry-list">
        {entries.map((entry, index) => (
          <div key={entry.id} className="entry-row">
            <input
              className="entry-input"
              value={entry.number}
              onChange={(e) => {
                const updated = [...entries];
                updated[index].number = e.target.value;
                setEntries(updated);
              }}
            />
            <input
              className="entry-input"
              value={entry.name}
              onChange={(e) => {
                const updated = [...entries];
                updated[index].name = e.target.value;
                setEntries(updated);
              }}
            />
            <input
              className="entry-input"
              value={entry.amount}
              onChange={(e) => {
                const updated = [...entries];
                updated[index].amount = parseInt(e.target.value) || 0;
                setEntries(updated);
              }}
            />
            <input
              className="entry-input"
              value={entry.ticketCount}
              onChange={(e) => {
                const updated = [...entries];
                updated[index].ticketCount = parseInt(e.target.value) || 0;
                setEntries(updated);
              }}
            />
            <button
              className="inline-x"
              onClick={() => handleDelete(entry.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;