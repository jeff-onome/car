import React from 'react';
import { Link } from 'react-router-dom';
import type { Car } from '../types';
import { FuelIcon, GaugeIcon, TransmissionIcon } from './IconComponents';

interface CarCardProps {
  car: Car;
}

const tagColors = {
  'Best Deal': 'bg-green-500',
  'New Arrival': 'bg-blue-500',
  'Trending': 'bg-purple-500',
};

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col group">
      <div className="relative overflow-hidden">
        <img 
          src={car.images[0]} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
            {car.condition}
        </div>
         {car.tag && (
          <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded-full ${tagColors[car.tag]}`}>
            {car.tag}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-card-foreground">{car.make} {car.model}</h3>
        <p className="text-sm text-muted-foreground mb-4">{car.year}</p>
        <p className="text-2xl font-bold text-accent mb-4">₦{car.price.toLocaleString()}</p>
        
        <div className="grid grid-cols-3 gap-4 text-center my-4 border-t border-b border-border py-4">
          <div className="flex flex-col items-center">
            <FuelIcon className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-sm text-foreground">{car.fuelType}</span>
          </div>
          <div className="flex flex-col items-center">
            <GaugeIcon className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-sm text-foreground">{car.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex flex-col items-center">
            <TransmissionIcon className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-sm text-foreground">{car.transmission}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Link to={`/car/${car.id}`} className="block w-full text-center bg-accent text-accent-foreground font-bold py-3 px-4 rounded-lg hover:bg-accent/90 transition-colors duration-300">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;