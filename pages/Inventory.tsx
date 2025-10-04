import React, { useState, useMemo } from 'react';
import CarCard from '../components/CarCard';
import { CARS } from '../constants';
import type { Car } from '../types';

const Inventory: React.FC = () => {
  const [cars, setCars] = useState<Car[]>(CARS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMake, setFilterMake] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [sortOrder, setSortOrder] = useState('price-asc');

  const makes = useMemo(() => ['all', ...Array.from(new Set(CARS.map(car => car.make)))], []);
  const conditions = ['all', 'New', 'Used'];

  const filteredAndSortedCars = useMemo(() => {
    let filteredCars = cars.filter(car => 
        (car.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
         car.model.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterMake === 'all' || car.make === filterMake) &&
        (filterCondition === 'all' || car.condition === filterCondition)
    );

    switch (sortOrder) {
      case 'price-asc':
        filteredCars.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredCars.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        filteredCars.sort((a, b) => b.year - a.year);
        break;
      case 'mileage-asc':
        filteredCars.sort((a, b) => a.mileage - b.mileage);
        break;
    }
    
    return filteredCars;

  }, [cars, searchTerm, filterMake, filterCondition, sortOrder]);


  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">Our Inventory</h1>
          <p className="mt-2 text-lg text-muted-foreground">Find the car that's right for you.</p>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-secondary p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <input
            type="text"
            placeholder="Search by make or model..."
            className="w-full bg-background text-foreground border border-input rounded-md p-2 focus:ring-ring focus:border-ring"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="w-full bg-background text-foreground border border-input rounded-md p-2 focus:ring-ring focus:border-ring"
            onChange={(e) => setFilterMake(e.target.value)}
            value={filterMake}
          >
            {makes.map(make => (
              <option key={make} value={make}>{make === 'all' ? 'All Makes' : make}</option>
            ))}
          </select>
          <select 
            className="w-full bg-background text-foreground border border-input rounded-md p-2 focus:ring-ring focus:border-ring"
            onChange={(e) => setFilterCondition(e.target.value)}
            value={filterCondition}
          >
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition === 'all' ? 'All Conditions' : condition}</option>
            ))}
          </select>
          <select 
            className="w-full bg-background text-foreground border border-input rounded-md p-2 focus:ring-ring focus:border-ring"
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-desc">Year: Newest First</option>
            <option value="mileage-asc">Mileage: Lowest First</option>
          </select>
        </div>

        {/* Car Grid */}
        {filteredAndSortedCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl text-foreground">No cars found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;