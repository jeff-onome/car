import React from 'react';
import { useCars } from '../../hooks/useCars';
import { TrashIcon } from '../../components/IconComponents';

const ManageAllListings: React.FC = () => {
  const { cars, deleteCar } = useCars();

  const handleDelete = (carId: number, carName: string) => {
    if (window.confirm(`Are you sure you want to delete the listing for ${carName}? This action cannot be undone.`)) {
      deleteCar(carId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Manage All Listings</h1>
      </div>

      <div className="bg-secondary rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background">
              <tr>
                <th className="p-4 font-semibold">Vehicle</th>
                <th className="p-4 font-semibold">Dealer Email</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.length > 0 ? (
                cars.map(car => (
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
                     <td className="p-4 text-muted-foreground">{car.dealerId}</td>
                    <td className="p-4 font-semibold text-foreground">₦{car.price.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDelete(car.id, `${car.make} ${car.model}`)} className="p-2 text-muted-foreground hover:text-red-500" title="Delete Listing">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-muted-foreground">
                    There are no vehicle listings on the platform.
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

export default ManageAllListings;