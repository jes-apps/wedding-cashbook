import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import History from './components/History';
import Summary from './components/Summary';
import './App.css';

// 🔽 Google Analytics 삽입
const GA_ID = 'G-KQ5F11BPPZ'; // ← 여기에 측정 ID 입력

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) return;

    window.gtag('config', GA_ID, {
      page_path: location.pathname,
    });
  }, [location]);
}

function App() {
  const [entries, setEntries] = useState([]);
  const [autoNumber, setAutoNumber] = useState(1);

  return (
    <Router>
      {/* 🔽 GA Script 삽입 */}
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
                />
              }
            />
            <Route path="/history" element={<History entries={entries} setEntries={setEntries} />} />
            <Route path="/summary" element={<Summary entries={entries} />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}

// 🔽 GA Script 컴포넌트
function GoogleAnalytics() {
  usePageTracking();

  useEffect(() => {
    // gtag.js 삽입
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

export default App;