import React, { createContext, useState, ReactNode } from 'react';
import type { Car } from '../types';
import { CARS as INITIAL_CARS } from '../constants';

interface CarContextType {
  cars: Car[];
  addCar: (car: Omit<Car, 'id'>) => void;
  updateCar: (updatedCar: Car) => void;
  deleteCar: (carId: number) => void;
  deleteCarsByDealer: (dealerId: string) => void;
}

export const CarContext = createContext<CarContextType | undefined>(undefined);

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

export const CarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cars, setCars] = useLocalStorage<Car[]>('cars_inventory', INITIAL_CARS);

    const addCar = (carData: Omit<Car, 'id'>) => {
        setCars(prevCars => {
            const newCar: Car = {
                id: Date.now(), // Simple unique ID generation
                ...carData
            };
            return [...prevCars, newCar];
        });
    };

    const updateCar = (updatedCar: Car) => {
        setCars(prevCars => 
            prevCars.map(car => car.id === updatedCar.id ? updatedCar : car)
        );
    };

    const deleteCar = (carId: number) => {
        setCars(prevCars => prevCars.filter(car => car.id !== carId));
    };
    
    const deleteCarsByDealer = (dealerId: string) => {
        setCars(prevCars => prevCars.filter(car => car.dealerId !== dealerId));
    };

    return (
        <CarContext.Provider value={{ cars, addCar, updateCar, deleteCar, deleteCarsByDealer }}>
            {children}
        </CarContext.Provider>
    );
};