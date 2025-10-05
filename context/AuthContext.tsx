import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
  updateUser: (updatedData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Ensure user object has all required fields from the User type
        return {
          role: 'customer',
          verificationStatus: 'Unverified',
          address: null,
          kycDocument: null,
          status: 'Active',
          ...parsedUser,
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  const login = (userData: User) => {
    // When logging in, merge stored user data with defaults to prevent missing fields
    const fullUserData = {
      role: 'customer' as const,
      verificationStatus: 'Unverified' as const,
      address: null,
      kycDocument: null,
      status: 'Active' as const,
      ...userData,
    };
    localStorage.setItem('user', JSON.stringify(fullUserData));
    setUser(fullUserData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  
  const register = (userData: User) => {
    // In a real app, this would involve an API call.
    // Here, we'll just log the user in directly after "registering".
    login(userData);
  };
  
  const updateUser = (updatedData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};