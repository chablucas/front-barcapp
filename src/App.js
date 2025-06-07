import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout';

import Videos from './pages/Videos';
import AddVideo from './pages/AddVideo';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoDetail from './pages/VideoDetail';
import Profil from './pages/Profil';
import Recherche from './pages/Recherche';
import GoogleCallback from './pages/GoogleCallback';
import Shorts from './pages/Shorts';
import Home from './pages/Home';
import AdminWidgets from './pages/AdminWidgets';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Routes>
          {/* Pages sans layout (pas de header/sidebar/widgets) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/google-auth" element={<GoogleCallback />} />

          {/* Pages avec layout global */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/videos" element={<MainLayout><Videos /></MainLayout>} />
          <Route path="/ajouter-video" element={<MainLayout><AddVideo /></MainLayout>} />
          <Route path="/video/:id" element={<MainLayout><VideoDetail /></MainLayout>} />
          <Route path="/profil" element={<MainLayout><Profil /></MainLayout>} />
          <Route path="/recherche" element={<MainLayout><Recherche /></MainLayout>} />
          <Route path="/shorts" element={<MainLayout><Shorts /></MainLayout>} />
          <Route path="/admin/widgets" element={<MainLayout><AdminWidgets /></MainLayout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
