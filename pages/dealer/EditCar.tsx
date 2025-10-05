
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CarForm from '../../components/CarForm';
import { useCars } from '../../hooks/useCars';
import type { Car } from '../../types';

const EditCar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cars, updateCar } = useCars();
  
  const carToEdit = cars.find(c => c.id === parseInt(id || ''));

  const handleUpdateCar = (carData: Omit<Car, 'id' | 'dealerId'>) => {
    if (!carToEdit) return;
    updateCar({ ...carData, id: carToEdit.id, dealerId: carToEdit.dealerId });
    navigate('/dealer/listings');
  };
  
  if (!carToEdit) {
      return (
          <div className="text-center py-10">
              <h2 className="text-2xl font-bold">Car not found</h2>
              <p className="text-muted-foreground">The car you're trying to edit does not exist.</p>
              <Link to="/dealer/listings" className="text-accent mt-4 inline-block">Back to Listings</Link>
          </div>
      )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Edit Vehicle</h1>
      <CarForm onSubmit={handleUpdateCar} initialData={carToEdit} isEdit={true} />
    </div>
  );
};

export default EditCar;
