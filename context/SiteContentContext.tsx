import React, { createContext, useState, ReactNode } from 'react';
import { SiteContent } from '../types';

interface SiteContentContextType {
  siteContent: SiteContent;
  updateSiteContent: (newContent: Partial<SiteContent>) => void;
}

export const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

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

const INITIAL_SITE_CONTENT: SiteContent = {
    siteName: "AutoSphere",
    hero: {
        title: "Find Your Next Dream Car",
        subtitle: "Explore our curated selection of high-quality new and pre-owned vehicles.",
        image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1725&auto=format&fit=crop",
    },
    newArrivalsCarIds: [2, 7],
    bestDealsCarIds: [4],
    trendingCarsCarIds: [1, 3, 6],
    usedCarsCarIds: [1, 3, 5],
    dealOfTheWeekCarId: 5,
    contactInfo: {
        address: "123 Auto Drive, Velocity City, 45678",
        phone: "(555) 123-4567",
        email: "contact@autosphere.com",
        hours: {
            week: "9:00 AM - 7:00 PM",
            saturday: "10:00 AM - 6:00 PM",
            sunday: "Closed",
        },
    },
    socialHandles: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
    },
    inventorySettings: {
        sortOptions: ['price-asc', 'price-desc', 'year-desc', 'mileage-asc'],
        conditionFilters: ['New', 'Used'],
    },
};

export const SiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [siteContent, setSiteContent] = useLocalStorage<SiteContent>('site_content', INITIAL_SITE_CONTENT);

    const updateSiteContent = (newContent: Partial<SiteContent>) => {
        setSiteContent(prev => ({...prev, ...newContent}));
    };
    
    return (
        <SiteContentContext.Provider value={{ siteContent, updateSiteContent }}>
            {children}
        </SiteContentContext.Provider>
    );
};