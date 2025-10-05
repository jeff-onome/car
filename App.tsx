
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
import { CarProvider } from './context/CarContext';
import ChangePassword from './pages/ChangePassword';
import DealerProtectedRoute from './components/DealerProtectedRoute';
import DealerLayout from './pages/dealer/DealerLayout';
import Dashboard from './pages/dealer/Dashboard';
import ManageListings from './pages/dealer/ManageListings';
import AddCar from './pages/dealer/AddCar';
import EditCar from './pages/dealer/EditCar';
import { UserManagementProvider } from './context/UserManagementContext';
import SuperAdminProtectedRoute from './components/SuperAdminProtectedRoute';
import SuperAdminLayout from './pages/superadmin/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import ManageUsers from './pages/superadmin/ManageUsers';
import AddUser from './pages/superadmin/AddUser';
import EditUser from './pages/superadmin/EditUser';
import ManageAllListings from './pages/superadmin/ManageAllListings';
import { SiteContentProvider } from './context/SiteContentContext';
import SiteContent from './pages/superadmin/SiteContent';
import SuperAdminAddCar from './pages/superadmin/AddCar';


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CarProvider>
          <UserManagementProvider>
            <UserDataProvider>
              <SiteContentProvider>
                <HashRouter>
                  <ScrollToTop />
                  <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
                    <Header />
                    <main className="flex-grow">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/car/:id" element={<CarDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/faq" element={<Faq />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* User Routes */}
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/profile/change-password" element={<ChangePassword />} />

                        {/* Dealer Routes */}
                        <Route path="/dealer" element={<DealerProtectedRoute><DealerLayout /></DealerProtectedRoute>}>
                          <Route index path="dashboard" element={<Dashboard />} />
                          <Route path="listings" element={<ManageListings />} />
                          <Route path="listings/add" element={<AddCar />} />
                          <Route path="listings/edit/:id" element={<EditCar />} />
                        </Route>

                        {/* Super Admin Routes */}
                        <Route path="/superadmin" element={<SuperAdminProtectedRoute><SuperAdminLayout /></SuperAdminProtectedRoute>}>
                          <Route index path="dashboard" element={<SuperAdminDashboard />} />
                          <Route path="users" element={<ManageUsers />} />
                          <Route path="users/add" element={<AddUser />} />
                          <Route path="users/edit/:email" element={<EditUser />} />
                          <Route path="listings" element={<ManageAllListings />} />
                          <Route path="listings/add" element={<SuperAdminAddCar />} />
                          <Route path="content" element={<SiteContent />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </HashRouter>
              </SiteContentProvider>
            </UserDataProvider>
          </UserManagementProvider>
        </CarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
