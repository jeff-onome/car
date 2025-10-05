
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CarForm from '../../components/CarForm';
import { useCars } from '../../hooks/useCars';
import { useUserManagement } from '../../hooks/useUserManagement';
import type { Car } from '../../types';

const SuperAdminAddCar: React.FC = () => {
  const navigate = useNavigate();
  const { addCar } = useCars();
  const { users } = useUserManagement();

  const dealers = useMemo(() => users.filter(u => u.role === 'dealer'), [users]);
  const [selectedDealerId, setSelectedDealerId] = useState<string>(dealers[0]?.email || '');

  const handleAddCar = (carData: Omit<Car, 'id' | 'dealerId'>) => {
    if (!selectedDealerId) {
        alert("Please select a dealer to assign this vehicle to.");
        return;
    }
    addCar({ ...carData, dealerId: selectedDealerId });
    alert("Vehicle added successfully!");
    navigate('/superadmin/listings');
  };

  const inputClass = "w-full bg-background border border-input rounded-md p-2 focus:ring-ring focus:border-ring text-foreground";

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Add New Vehicle (Admin)</h1>
      <CarForm onSubmit={handleAddCar}>
         {/* This children prop allows adding fields to the CarForm */}
         <div>
            <label className="block text-sm font-medium mb-1">Assign to Dealer</label>
            <select 
                value={selectedDealerId}
                onChange={(e) => setSelectedDealerId(e.target.value)}
                className={inputClass}
                required
            >
                {dealers.length === 0 ? (
                    <option disabled>No dealers found</option>
                ) : (
                    dealers.map(dealer => (
                        <option key={dealer.email} value={dealer.email}>
                            {dealer.fname} {dealer.lname} ({dealer.email})
                        </option>
                    ))
                )}
            </select>
        </div>
      </CarForm>
    </div>
  );
};

export default SuperAdminAddCar;
