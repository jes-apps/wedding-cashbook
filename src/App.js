import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import History from './components/History';
import Summary from './components/Summary';
import './App.css';

const GA_ID = 'G-KQ5F11BPPZ';

function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    if (!window.gtag) return;
    window.gtag('config', GA_ID, { page_path: location.pathname });
  }, [location]);
}

function GoogleAnalytics() {
  usePageTracking();
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', '${GA_ID}', { page_path: window.location.pathname });
    `;
    document.head.appendChild(script2);
  }, []);
  return null;
}

function BottomNav() {
  const location = useLocation();
  return (
    <nav className="bottom-nav">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>홈</Link>
      <Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>내역</Link>
      <Link to="/summary" className={location.pathname === '/summary' ? 'active' : ''}>정산</Link>
    </nav>
  );
}

function App() {
  const [entries, setEntries] = useState([]);
  const [autoNumber, setAutoNumber] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('entries');
    if (saved) {
      const parsed = JSON.parse(saved);
      setEntries(parsed);
      const maxNumber = Math.max(0, ...parsed.map(e => Number(e.number) || 0));
      setAutoNumber(maxNumber + 1);
    }
  }, []);

  const handleDelete = (id) => {
    const index = entries.findIndex(entry => entry.id === id);
    if (index === -1) return;

    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    const targetEntry = entries[index];
    const currentNumber = parseInt(targetEntry.number);
    const isLast = index === entries.length - 1;

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
      }
    }
  };

  return (
    <Router>
      <GoogleAnalytics />
      <div className="app-container">
        <div className="page-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  entries={entries}
                  setEntries={setEntries}
                  autoNumber={autoNumber}
                  setAutoNumber={setAutoNumber}
                  handleDelete={handleDelete}
                />
              }
            />
            <Route
              path="/history"
              element={
                <History
                  entries={entries}
                  setEntries={setEntries}
                  handleDelete={handleDelete}
                />
              }
            />
            <Route path="/summary" element={<Summary entries={entries} />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;