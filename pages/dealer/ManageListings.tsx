import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCars } from '../../hooks/useCars';
import { PencilIcon, TrashIcon, PlusCircleIcon } from '../../components/IconComponents';

const ManageListings: React.FC = () => {
  const { user } = useAuth();
  const { cars, deleteCar } = useCars();
  const navigate = useNavigate();

  const dealerCars = cars.filter(car => car.dealerId === user?.email);

  const handleDelete = (carId: number, carName: string) => {
    if (window.confirm(`Are you sure you want to delete the listing for ${carName}?`)) {
      deleteCar(carId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Listings</h1>
        <Link to="/dealer/listings/add" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            <PlusCircleIcon className="w-5 h-5"/>
            <span>Add Vehicle</span>
        </Link>
      </div>

      <div className="bg-secondary rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background">
              <tr>
                <th className="p-4 font-semibold">Vehicle</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Condition</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dealerCars.length > 0 ? (
                dealerCars.map(car => (
                  <tr key={car.id} className="border-t border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={car.images[0]} alt={car.make} className="w-20 h-14 object-cover rounded-md" />
                        <div>
                          <p className="font-bold text-foreground">{car.make} {car.model}</p>
                          <p className="text-xs text-muted-foreground">{car.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-foreground">₦{car.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${car.condition === 'New' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                        {car.condition}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/dealer/listings/edit/${car.id}`)} className="p-2 text-muted-foreground hover:text-accent" title="Edit">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(car.id, `${car.make} ${car.model}`)} className="p-2 text-muted-foreground hover:text-red-500" title="Delete">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-muted-foreground">
                    You haven't listed any vehicles yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageListings;
