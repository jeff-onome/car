import React from 'react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { CARS, TESTIMONIALS } from '../constants';
import { StarIcon, QuoteIcon } from '../components/IconComponents';
import type { Car, Testimonial } from '../types';
import PromoCar from '../components/PromoCar';

const Hero: React.FC = () => (
  <div className="relative bg-secondary text-foreground py-20 lg:py-32">
     <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20" 
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1725&auto=format&fit=crop')"}}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
    <div className="container mx-auto px-6 text-center relative z-10">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">Find Your Next Dream Car</h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Explore our curated selection of high-quality new and pre-owned vehicles.
      </p>
      <Link 
        to="/inventory" 
        className="bg-accent text-accent-foreground font-bold py-3 px-8 rounded-full hover:bg-accent/90 transition-transform duration-300 transform hover:scale-105 text-lg"
      >
        Browse Inventory
      </Link>
    </div>
  </div>
);

interface CarHighlightSectionProps {
  title: string;
  cars: Car[];
}

const CarHighlightSection: React.FC<CarHighlightSectionProps> = ({ title, cars }) => {
  if (cars.length === 0) return null;
  return (
     <div className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  )
}

const TestimonialCard: React.FC<{testimonial: Testimonial}> = ({ testimonial }) => (
    <div className="bg-secondary p-8 rounded-lg shadow-lg flex flex-col h-full border border-border">
        <QuoteIcon className="w-10 h-10 text-accent mb-4"/>
        <p className="text-muted-foreground flex-grow mb-6">"{testimonial.quote}"</p>
        <div className="flex items-center mt-auto">
            <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4"/>
            <div>
                <p className="font-bold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                 <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-500'}`} />
                    ))}
                </div>
            </div>
        </div>
    </div>
);


const Testimonials: React.FC = () => (
    <div className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground">What Our Customers Say</h2>
                <p className="mt-4 text-lg text-muted-foreground">Real stories from satisfied drivers.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {TESTIMONIALS.map((testimonial, index) => (
                    <TestimonialCard key={index} testimonial={testimonial} />
                ))}
            </div>
        </div>
    </div>
);


const WhyChooseUs: React.FC = () => (
    <div className="py-16 sm:py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground">Why Choose AutoSphere?</h2>
                <p className="mt-4 text-lg text-muted-foreground">The premier destination for luxury and performance vehicles.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6 bg-background rounded-lg border border-border">
                    <h3 className="text-xl font-semibold text-accent">Quality Inspected</h3>
                    <p className="mt-2 text-muted-foreground">Every vehicle undergoes a rigorous multi-point inspection to ensure it meets our highest standards.</p>
                </div>
                 <div className="p-6 bg-background rounded-lg border border-border">
                    <h3 className="text-xl font-semibold text-accent">Transparent Pricing</h3>
                    <p className="mt-2 text-muted-foreground">No hidden fees. We believe in honest, straightforward pricing for a stress-free buying experience.</p>
                </div>
                 <div className="p-6 bg-background rounded-lg border border-border">
                    <h3 className="text-xl font-semibold text-accent">Expert Service</h3>
                    <p className="mt-2 text-muted-foreground">Our knowledgeable team is here to guide you every step of the way, from test drive to financing.</p>
                </div>
            </div>
        </div>
    </div>
);


const Home: React.FC = () => {
  const newArrivals = CARS.filter(car => car.tag === 'New Arrival').slice(0, 3);
  const bestDeals = CARS.filter(car => car.tag === 'Best Deal').slice(0, 3);
  const trendingCars = CARS.filter(car => car.tag === 'Trending').slice(0, 3);
  const usedCars = CARS.filter(car => car.condition === 'Used').slice(0, 3);
  const promoCar = CARS.find(car => car.id === 5); // BMW M3 Competition

  return (
    <div>
      <Hero />
      <CarHighlightSection title="New Arrivals" cars={newArrivals} />
      <CarHighlightSection title="Best Deals" cars={bestDeals} />
      <CarHighlightSection title="Trending Cars" cars={trendingCars} />
      <CarHighlightSection title="Quality Pre-Owned" cars={usedCars} />
      {promoCar && <PromoCar car={promoCar} />}
      <Testimonials />
      <WhyChooseUs />
    </div>
  );
};

export default Home;