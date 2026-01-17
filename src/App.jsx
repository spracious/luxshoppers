import { useState } from 'react'
import './App.css'
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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


function App() {
  
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
      </Routes>
    </Router>
    
  );
}

export default App;