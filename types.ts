export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Automatic' | 'Manual';
  engine: string;
  horsepower: number;
  features: string[];
  images: string[];
  description: string;
  condition: 'New' | 'Used';
  tag?: 'Best Deal' | 'New Arrival' | 'Trending';
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  location: string;
  avatar: string;
  rating: number;
}

export interface User {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  country: string;
  state: string;
}

export interface TestDrive {
  id: number;
  carId: number;
  bookingDate: string;
  location: string;
  status: 'Approved' | 'Pending' | 'Completed' | 'Cancelled';
}

export interface Purchase {
  id: number;
  carId: number;
  purchaseDate: string;
  pricePaid: number;
  dealership: string;
}