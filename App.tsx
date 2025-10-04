import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import Inventory from './pages/Inventory';
import CarDetail from './pages/CarDetail';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import UserProfile from './pages/UserProfile';
import { UserDataProvider } from './context/UserDataContext';
import ChangePassword from './pages/ChangePassword';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserDataProvider>
          <HashRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/car/:id" element={<CarDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/profile/change-password" element={<ChangePassword />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </HashRouter>
        </UserDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;