import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllTreks from './pages/AllTreks';
import TrekDetail from './pages/TrekDetail';
import Expeditions from './pages/Expeditions';
import Departures from './pages/Departures';
import Destinations from './pages/Destinations';
import Categories from './pages/Categories';
import About from './pages/About';
import Safety from './pages/Safety';
import Blog from './pages/Blog';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="App tv-app min-h-screen bg-[#020617]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/treks" element={<AllTreks />} />
            <Route path="/trek/:id" element={<TrekDetail />} />
            <Route path="/expeditions" element={<Expeditions />} />
            <Route path="/departures" element={<Departures />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<Destinations />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
