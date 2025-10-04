

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, TestDrive, Purchase } from '../types';
import { useAuth } from '../hooks/useAuth';
import { MOCK_TEST_DRIVES, MOCK_PURCHASES } from '../constants';

interface UserDataContextType {
  user: User | null;
  favorites: number[];
  recentlyViewed: number[];
  compareItems: number[];
  testDrives: TestDrive[];
  purchases: Purchase[];
  toggleFavorite: (carId: number) => void;
  addRecentlyViewed: (carId: number) => void;
  toggleCompare: (carId: number) => void;
  clearCompare: () => void;
  cancelTestDrive: (testDriveId: number) => void;
  rescheduleTestDrive: (testDriveId: number, newBookingDate: string) => void;
}

export const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// FIX: Correctly type the return value of the useLocalStorage hook to support functional updates for state setters.
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};


export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const userKey = user?.email || 'guest';

    const [favorites, setFavorites] = useLocalStorage<number[]>(`favorites_${userKey}`, []);
    const [recentlyViewed, setRecentlyViewed] = useLocalStorage<number[]>(`recentlyViewed_${userKey}`, []);
    const [compareItems, setCompareItems] = useLocalStorage<number[]>(`compareItems_${userKey}`, []);
    // For this demo, test drives and purchases are the same for all users, but in a real app this would be user-specific.
    const [testDrives, setTestDrives] = useState<TestDrive[]>(MOCK_TEST_DRIVES);
    const [purchases, setPurchases] = useState<Purchase[]>(MOCK_PURCHASES);
    
    // Reset state on user change
    useEffect(() => {
       const favs = JSON.parse(localStorage.getItem(`favorites_${userKey}`) || '[]');
       const recent = JSON.parse(localStorage.getItem(`recentlyViewed_${userKey}`) || '[]');
       const compare = JSON.parse(localStorage.getItem(`compareItems_${userKey}`) || '[]');
       setFavorites(favs);
       setRecentlyViewed(recent);
       setCompareItems(compare);
    }, [user, userKey]);


    const toggleFavorite = useCallback((carId: number) => {
        if (!user) return alert("Please log in to save favorites.");
        setFavorites(prev => 
            prev.includes(carId) ? prev.filter(id => id !== carId) : [...prev, carId]
        );
    }, [user, setFavorites]);

    const addRecentlyViewed = useCallback((carId: number) => {
        if (!user) return;
        setRecentlyViewed(prev => {
            const newHistory = [carId, ...prev.filter(id => id !== carId)];
            return newHistory.slice(0, 5); // Keep only the last 5 viewed
        });
    }, [user, setRecentlyViewed]);

    const toggleCompare = useCallback((carId: number) => {
        if (!user) return alert("Please log in to compare cars.");
        setCompareItems(prev => {
            if (prev.includes(carId)) {
                return prev.filter(id => id !== carId);
            }
            if (prev.length >= 4) {
                alert("You can only compare up to 4 cars at a time.");
                return prev;
            }
            return [...prev, carId];
        });
    }, [user, setCompareItems]);

    const clearCompare = useCallback(() => {
        setCompareItems([]);
    }, [setCompareItems]);
    
    const cancelTestDrive = (testDriveId: number) => {
        setTestDrives(prev => prev.map(td => td.id === testDriveId ? {...td, status: 'Cancelled'} : td));
        alert("Your test drive has been cancelled.");
    };

    const rescheduleTestDrive = (testDriveId: number, newBookingDate: string) => {
        setTestDrives(prev => prev.map(td => 
            td.id === testDriveId 
                ? { ...td, bookingDate: newBookingDate, status: 'Approved' } 
                : td
        ));
        alert(`Test drive #${testDriveId} has been rescheduled successfully.`);
    };

    const value = {
        user,
        favorites,
        recentlyViewed,
        compareItems,
        testDrives,
        purchases,
        toggleFavorite,
        addRecentlyViewed,
        toggleCompare,
        clearCompare,
        cancelTestDrive,
        rescheduleTestDrive,
    };

    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    );
};