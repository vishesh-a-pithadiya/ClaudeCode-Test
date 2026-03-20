import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './auth';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import E2E from './pages/E2E';
import Search from './pages/Search';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Products from './pages/Products';
import CrossRef from './pages/CrossRef';
import KnowledgeBank from './pages/KnowledgeBank';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="App">
      {!isLanding && <Navbar />}
      <main className={isLanding ? '' : 'main-content'}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/e2e" element={<E2E />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/callback" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/products" element={<Products />} />
          <Route path="/crossref" element={<CrossRef />} />
          <Route path="/knowledge-bank" element={<KnowledgeBank />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
