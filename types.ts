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
  dealerId: string; // email of the dealer
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
  role: 'customer' | 'dealer' | 'superadmin';
  status: 'Active' | 'Blocked';
  address: {
    street: string;
    city: string;
    zip: string;
  } | null;
  verificationStatus: 'Unverified' | 'Pending' | 'Verified' | 'Rejected';
  kycDocument: {
    type: 'NIN' | 'DriversLicense' | 'Passport';
    front: string; // base64 string
    back?: string; // base64 string
  } | null;
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

export interface SiteContent {
  siteName: string;
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  newArrivalsCarIds: number[];
  bestDealsCarIds: number[];
  trendingCarsCarIds: number[];
  usedCarsCarIds: number[];
  dealOfTheWeekCarId: number | null;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    hours: {
      week: string;
      saturday: string;
      sunday: string;
    };
  };
  socialHandles: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  inventorySettings: {
    sortOptions: string[];
    conditionFilters: string[];
  };
}