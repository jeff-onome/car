
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CarForm from '../../components/CarForm';
import { useCars } from '../../hooks/useCars';
import { useAuth } from '../../hooks/useAuth';
import type { Car } from '../../types';

const AddCar: React.FC = () => {
  const navigate = useNavigate();
  const { addCar } = useCars();
  const { user } = useAuth();

  const handleAddCar = (carData: Omit<Car, 'id' | 'dealerId'>) => {
    if (!user) {
        alert("You must be logged in to add a car.");
        return;
    }
    addCar({ ...carData, dealerId: user.email });
    navigate('/dealer/listings');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Add New Vehicle</h1>
      <CarForm onSubmit={handleAddCar} />
    </div>
  );
};

export default AddCar;
