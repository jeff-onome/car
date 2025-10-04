import React from 'react';
import { Link } from 'react-router-dom';
import type { Car } from '../types';
import { FuelIcon, GaugeIcon, TransmissionIcon, HeartIcon, CompareIcon } from './IconComponents';
import { useUserData } from '../hooks/useUserData';

interface CarCardProps {
  car: Car;
}

const tagColors = {
  'Best Deal': 'bg-green-500',
  'New Arrival': 'bg-blue-500',
  'Trending': 'bg-purple-500',
};

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { favorites, compareItems, toggleFavorite, toggleCompare, user } = useUserData();
  const isFavorite = favorites.includes(car.id);
  const isCompared = compareItems.includes(car.id);
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(car.id);
  };
  
  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(car.id);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col group">
      <div className="relative overflow-hidden">
        <Link to={`/car/${car.id}`}>
            <img 
              src={car.images[0]} 
              alt={`${car.make} ${car.model}`} 
              className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
        </Link>
        <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
            {car.condition}
        </div>
         {car.tag && (
          <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded-full ${tagColors[car.tag]}`}>
            {car.tag}
          </div>
        )}
        {user && (
           <div className="absolute bottom-2 right-2 flex space-x-2">
            <button
              onClick={handleToggleCompare}
              title={isCompared ? "Remove from Compare" : "Add to Compare"}
              className={`p-2 rounded-full transition-colors duration-200 ${isCompared ? 'bg-accent text-accent-foreground' : 'bg-black/50 text-white hover:bg-accent'}`}
              aria-pressed={isCompared}
            >
              <CompareIcon className="h-5 w-5" />
            </button>
             <button
              onClick={handleToggleFavorite}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              className={`p-2 rounded-full transition-colors duration-200 ${isFavorite ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-red-500'}`}
              aria-pressed={isFavorite}
            >
              <HeartIcon className={`h-5 w-5 ${isFavorite ? 'fill-current' : 'fill-none'}`} />
            </button>
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