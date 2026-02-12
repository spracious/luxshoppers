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

function App() {

  // Load current user on app mount (fix Paystack redirect issue)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${BASEURL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("storage")); // optional: triggers components listening for updates
      })
      .catch(err => console.error("Failed to fetch user after redirect", err));
    }
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/errands" element={<TrackErrandsSection/>} />
        <Route path="/AdminDashboard" element={<AdminDashboard/>} />

      </Routes>
    </Router>
  );
}

export default App;
