import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CARS } from '../constants';
import { FuelIcon, GaugeIcon, TransmissionIcon, ArrowLeftIcon } from '../components/IconComponents';

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const car = CARS.find(c => c.id === parseInt(id || ''));
  const [mainImage, setMainImage] = useState(car?.images[0]);
  const navigate = useNavigate();

  if (!car) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl text-foreground">Car not found</h1>
        <Link to="/inventory" className="text-accent mt-4 inline-block">Back to Inventory</Link>
      </div>
    );
  }

  return (
    <div className="bg-background pt-12 pb-24 sm:pt-16 sm:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to results</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Image Gallery */}
          <div className="lg:col-span-3">
            <img src={mainImage} alt="Main car view" className="w-full h-auto rounded-lg shadow-2xl object-cover mb-4" />
            <div className="grid grid-cols-3 gap-4">
              {car.images.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`Car view ${index + 1}`} 
                  className={`w-full h-24 object-cover rounded-md cursor-pointer transition-opacity duration-200 ${mainImage === img ? 'opacity-100 border-2 border-accent' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Car Info */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-foreground">{car.make} {car.model}</h1>
            <p className="text-xl text-muted-foreground mb-4">{car.year} - {car.condition}</p>
            <p className="text-4xl font-bold text-accent mb-6">₦{car.price.toLocaleString()}</p>
            
            <div className="grid grid-cols-3 gap-4 text-center my-6 border-y border-border py-4">
              <div className="flex flex-col items-center"><FuelIcon className="h-7 w-7 text-muted-foreground mb-1" /><span className="text-md text-foreground">{car.fuelType}</span></div>
              <div className="flex flex-col items-center"><GaugeIcon className="h-7 w-7 text-muted-foreground mb-1" /><span className="text-md text-foreground">{car.mileage.toLocaleString()} mi</span></div>
              <div className="flex flex-col items-center"><TransmissionIcon className="h-7 w-7 text-muted-foreground mb-1" /><span className="text-md text-foreground">{car.transmission}</span></div>
            </div>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">Description</h3>
            <p className="text-muted-foreground mb-6">{car.description}</p>
            
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Key Features</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8">
              {car.features.map((feature, index) => <li key={index}>{feature}</li>)}
            </ul>

            <button
                onClick={() => alert(`Ordering ${car.make} ${car.model}...`)}
                className="w-full bg-primary text-primary-foreground font-bold py-4 px-6 rounded-lg hover:bg-primary/90 transition-colors duration-300 text-lg"
              >
                Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;