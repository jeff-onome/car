import type { Car, FaqItem, Testimonial } from './types';

export const CARS: Car[] = [
  {
    id: 1,
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2023,
    price: 142500000,
    mileage: 1500,
    fuelType: 'Electric',
    transmission: 'Automatic',
    engine: 'Tri-Motor',
    horsepower: 1020,
    features: ['Autopilot', '17" Cinematic Display', 'Yoke Steering', 'Premium Audio'],
    images: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=60',
      'https://plus.unsplash.com/premium_photo-1683134240084-ba074973f75e?w=600&auto=format&fit=crop&q=60'
    ],
    description: 'The Tesla Model S Plaid is the quickest accelerating car in production today. It combines cutting-edge technology with breathtaking performance and a spacious, luxurious interior.',
    condition: 'Used',
    tag: 'Trending',
  },
  {
    id: 2,
    make: 'Ford',
    model: 'Mustang GT',
    year: 2024,
    price: 67500000,
    mileage: 50,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    engine: '5.0L V8',
    horsepower: 480,
    features: ['Digital Instrument Cluster', 'Brembo Brakes', 'Active Valve Exhaust', 'Track Apps'],
    images: [
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop&q=60'
    ],
    description: 'Experience the raw power and iconic style of the 2024 Ford Mustang GT. With a roaring V8 engine and a driver-focused cockpit, it delivers pure exhilaration on every drive.',
    condition: 'New',
    tag: 'New Arrival',
  },
  {
    id: 3,
    make: 'Porsche',
    model: '911 Carrera S',
    year: 2023,
    price: 202500000,
    mileage: 5000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    engine: '3.0L Twin-Turbo Boxer 6',
    horsepower: 443,
    features: ['Porsche Active Suspension Management', 'Sport Chrono Package', 'Leather Interior', 'Bose Surround Sound'],
    images: [
      'https://plus.unsplash.com/premium_photo-1686730540277-c7e3a5571553?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1506610654-064fbba4780c?w=600&auto=format&fit=crop&q=60'
    ],
    description: 'The Porsche 911 is the quintessential sports car. The Carrera S offers a perfect blend of high performance, everyday usability, and timeless design that turns heads everywhere.',
    condition: 'Used',
    tag: 'Trending',
  },
  {
    id: 4,
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    year: 2024,
    price: 51000000,
    mileage: 100,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    engine: '2.5L 4-Cylinder Hybrid',
    horsepower: 219,
    features: ['Toyota Safety Sense 2.5', 'Apple CarPlay/Android Auto', 'All-Wheel Drive', 'Moonroof'],
    images: [
      'https://images.unsplash.com/photo-1592853625511-ad0edcc69c07?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1524102724373-bcf6ed410592?w=600&auto=format&fit=crop&q=60'
    ],
    description: 'Dependable, efficient, and versatile. The Toyota RAV4 Hybrid is the ideal SUV for families and adventurers alike, offering excellent fuel economy and Toyota\'s legendary reliability.',
    condition: 'New',
    tag: 'Best Deal',
  },
  {
    id: 5,
    make: 'BMW',
    model: 'M3 Competition',
    year: 2023,
    price: 127500000,
    mileage: 8000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    engine: '3.0L Twin-Turbo I6',
    horsepower: 503,
    features: ['M Sport Differential', 'Carbon Fiber Roof', 'Harman Kardon Audio', 'M Sport Seats'],
    images: [
      'https://images.unsplash.com/photo-1592853625601-bb9d23da12fc?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1592853625511-ad0edcc69c07?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=60'
    ],
    description: 'The BMW M3 Competition is the ultimate driving machine. It offers staggering performance, track-ready handling, and a luxurious cabin, making it a formidable high-performance sedan.',
    condition: 'Used',
  },
  {
    id: 6,
    make: 'Rivian',
    model: 'R1T',
    year: 2023,
    price: 117000000,
    mileage: 3000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    engine: 'Quad-Motor',
    horsepower: 835,
    features: ['Gear Tunnel', 'Driver+ Assistance', 'Meridian Sound System', 'Panoramic Roof'],
    images: [
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&auto=format&fit=crop&q=60',
      'https://plus.unsplash.com/premium_photo-1683134240084-ba074973f75e?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop&q=60'
    ],
    description: 'The Rivian R1T is an all-electric adventure vehicle. With its incredible off-road capability, blistering on-road acceleration, and innovative features, it redefines what a pickup truck can be.',
    condition: 'Used',
    tag: 'Trending',
  },
  {
    id: 7,
    make: 'Honda',
    model: 'Civic Type R',
    year: 2024,
    price: 66000000,
    mileage: 20,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    engine: '2.0L Turbocharged I4',
    horsepower: 315,
    features: ['LogR Datalogger', 'Brembo Brakes', 'Rev-Match System', 'Iconic Red Seats'],
    images: [
      'https://images.unsplash.com/photo-1506610654-064fbba4780c?w=600&auto=format&fit=crop&q=60',
      'https://plus.unsplash.com/premium_photo-1686730540277-c7e3a5571553?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=600&auto=format&fit=crop&q=60'
    ],
    description: 'The Honda Civic Type R is a masterpiece of front-wheel-drive performance. It delivers an engaging driving experience with sharp handling, a powerful engine, and an aggressive design.',
    condition: 'New',
    tag: 'New Arrival',
  },
  {
    id: 8,
    make: 'Mercedes-Benz',
    model: 'G-Class G 63',
    year: 2023,
    price: 277500000,
    mileage: 4000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    engine: '4.0L Twin-Turbo V8',
    horsepower: 577,
    features: ['Three Locking Differentials', 'Burmester Surround Sound', 'Nappa Leather', 'AMG Ride Control'],
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1524102724373-bcf6ed410592?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1592853625511-ad0edcc69c07?w=600&auto=format&fit=crop&q=60'
    ],
    description: 'An icon of off-road capability and ultimate luxury. The Mercedes-AMG G 63 combines military-grade toughness with handcrafted comfort and an earth-shattering V8 engine.',
    condition: 'Used',
  }
];

export const FAQ_DATA: FaqItem[] = [
  {
    question: "What financing options do you offer?",
    answer: "We partner with a variety of trusted lenders to offer flexible financing options for all credit levels. You can apply online through our secure portal or speak with one of our finance specialists to find the best plan for you."
  },
  {
    question: "Can I trade in my current vehicle?",
    answer: "Absolutely! We offer competitive trade-in values for all types of vehicles. You can get an instant estimate on our website, and we'll perform a final appraisal when you visit our dealership. The trade-in value can be applied directly to your new purchase."
  },
  {
    question: "Do your used cars come with a warranty?",
    answer: "Yes, many of our certified pre-owned vehicles come with a comprehensive limited warranty for your peace of mind. We also offer extended warranty plans for additional coverage. Please ask a sales associate for details on a specific vehicle."
  },
  {
    question: "How do you ensure the quality of your used cars?",
    answer: "Every used vehicle at AutoSphere undergoes a rigorous multi-point inspection by our certified technicians. We check everything from the engine and transmission to the brakes and electronics to ensure it meets our high standards of quality and safety."
  },
  {
    question: "Can I test drive a car before buying?",
    answer: "Of course! We encourage test drives to ensure the vehicle is the perfect fit for you. You can schedule a test drive online or simply stop by our dealership. Please bring a valid driver's license."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "The team at AutoSphere made my car buying experience incredibly smooth and hassle-free. They were transparent, knowledgeable, and found the perfect car for me. Highly recommended!",
    author: "Tunde Adebayo",
    location: "Lagos, Nigeria",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=100&q=80",
    rating: 5,
  },
  {
    quote: "I was impressed with the quality of their inventory and the professionalism of the staff. No pressure, just great service. I'm thrilled with my new BMW!",
    author: "Fatima Aliyu",
    location: "Abuja, Nigeria",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    rating: 5,
  },
  {
    quote: "Finding a reliable used car was my top priority, and AutoSphere delivered. Their multi-point inspection gave me peace of mind, and the price was fair. A truly trustworthy dealership.",
    author: "Chinedu Okoro",
    location: "Port Harcourt, Nigeria",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80",
    rating: 4,
  }
];
