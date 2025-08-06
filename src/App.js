import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import History from './components/History';
import Summary from './components/Summary';
import './App.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [autoNumber, setAutoNumber] = useState(1); // ← 추가

  const handleDelete = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  return (
    <Router>
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
            <Route path="/history" element={<History entries={entries} setEntries={setEntries} handleDelete={handleDelete} />} />
            <Route path="/summary" element={<Summary entries={entries} />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
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