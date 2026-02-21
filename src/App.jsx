import { useState, useEffect } from 'react';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from 'axios';

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ServicesPage from "./pages/ServicesPage"; 
import AboutPage from "./pages/AboutPage";       
import ContactPage from "./pages/ContactPage";  
import SignUpPage from './pages/SignUpPage'; 
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import TrackErrandsSection from './pages/TrackErrandsSection';
import { BASEURL } from "./constant";
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';

function App() {
  // ✅ Define state for current user
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Load user from localStorage on app mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <Navbar currentUser={currentUser} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
        <Route path="/signup" element={<SignUpPage setCurrentUser={setCurrentUser} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/errands" element={<TrackErrandsSection />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
