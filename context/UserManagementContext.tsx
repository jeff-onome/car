
import React, { createContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/initialData';

// The full user object stored in 'registered_users' can include a password
export type StoredUser = User & { password?: string };

interface UserManagementContextType {
  users: StoredUser[];
  addUser: (userData: StoredUser) => void;
  updateUser: (email: string, updatedData: Partial<User>) => void;
  deleteUser: (email: string) => void;
}

export const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            // If the key doesn't exist, initialize it with the initial value.
            if (item === null) {
                window.localStorage.setItem(key, JSON.stringify(initialValue));
                return initialValue;
            }
            return JSON.parse(item);
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
        } catch (error)
        {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export const UserManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useLocalStorage<StoredUser[]>('registered_users', INITIAL_USERS);

    const addUser = (userData: StoredUser) => {
        setUsers(prev => [...prev, userData]);
    };

    const updateUser = (email: string, updatedData: Partial<User>) => {
        setUsers(prev => prev.map(u => {
            if (u.email === email) {
                return { ...u, ...updatedData };
            }
            return u;
        }));
    };

    const deleteUser = (email: string) => {
        setUsers(prev => prev.filter(u => u.email !== email));
    };

    return (
        <UserManagementContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
            {children}
        </UserManagementContext.Provider>
    );
};
