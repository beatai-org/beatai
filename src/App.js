import React from 'react';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import Hero from './components/Hero';
import FeaturedIn from './components/FeaturedIn';
import Features from './components/Features';
import Demo from './components/Demo';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Hero />
        <FeaturedIn />
        <Features />
        <Demo />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
