import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { CARS, TESTIMONIALS } from '../constants';
import { StarIcon, QuoteIcon } from '../components/IconComponents';
import type { Car, Testimonial } from '../types';
import PromoCar from '../components/PromoCar';

// Three.js Car Animation Component
const CarAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  // Import type only for type checking
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let THREE: typeof import('three');

  useEffect(() => {
    if (!canvasRef.current) return;

    // Assign THREE for type usage
    import('three').then((three) => {
      THREE = three;
    });

    let scene: import('three').Scene, camera: import('three').PerspectiveCamera, renderer: import('three').WebGLRenderer;
    let car: import('three').Group, mixer: import('three').AnimationMixer;
    let directionalLight: import('three').DirectionalLight, ambientLight: import('three').AmbientLight;

    const init = async () => {
      // Import Three.js dynamically to avoid SSR issues
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

      // Scene setup
      scene = new THREE.Scene();
      scene.background = null; // Transparent background

      // Camera setup
      camera = new THREE.PerspectiveCamera(
        45,
        canvasRef.current!.clientWidth / canvasRef.current!.clientHeight,
        0.1,
        1000
      );
      camera.position.set(4, 2, 6);

      // Renderer setup
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true
      });
      renderer.setSize(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Lighting
      ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 3);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Add some point lights for better illumination
      const pointLight1 = new THREE.PointLight(0x4a90e2, 0.8, 10);
      pointLight1.position.set(2, 3, 1);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xff6b6b, 0.6, 10);
      pointLight2.position.set(-2, 2, -1);
      scene.add(pointLight2);

      // Load car model
      const loader = new GLTFLoader();
      try {
        loader.load(
          '../cars/cars.glb', // Make sure this path is correct
          (gltf) => {
            car = gltf.scene;
            
            // Scale and position the car
            car.scale.set(1.2, 1.2, 1.2);
            car.position.set(0, -0.5, 0);
            
            // Enable shadows for all children
            car.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Enhance material appearance
                if (child.material) {
                  child.material.metalness = 0.8;
                  child.material.roughness = 0.2;
                  child.material.envMapIntensity = 1;
                }
              }
            });

            scene.add(car);

            // Set up animation mixer if there are animations
            if (gltf.animations.length > 0) {
              mixer = new THREE.AnimationMixer(car);
              gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
              });
            }
          },
          (progress) => {
            // Progress callback
            const percent = (progress.loaded / progress.total) * 100;
            console.log(`Loading car model: ${percent.toFixed(2)}%`);
          },
          (error) => {
            console.error('Error loading car model:', error);
            // Fallback: create a simple car-like shape
            createFallbackCar();
          }
        );
      } catch (error) {
        console.error('Error initializing 3D model:', error);
        createFallbackCar();
      }

      // Add a simple ground plane
      const groundGeometry = new THREE.PlaneGeometry(20, 20);
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.1
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.5;
      ground.receiveShadow = true;
      scene.add(ground);

      // Add orbit controls for interactivity
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.0;
      controls.enableZoom = true;
      controls.minDistance = 3;
      controls.maxDistance = 10;
      controls.enablePan = false;

      // Handle window resize
      const handleResize = () => {
        if (!canvasRef.current) return;
        
        camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      // Animation loop
      const clock = new THREE.Clock();
      
      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        
        if (mixer) {
          mixer.update(delta);
        }
        
        if (car && !mixer) {
          // Gentle rotation if no animations
          car.rotation.y += 0.005;
        }
        
        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        controls.dispose();
        renderer.dispose();
      };
    };

    const createFallbackCar = () => {
      const THREE = require('three');
      
      // Create a simple car-like shape as fallback
      const carGroup = new THREE.Group();
      
      // Car body
      const bodyGeometry = new THREE.BoxGeometry(3, 1, 1.5);
      const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2e86de,
        metalness: 0.8,
        roughness: 0.2
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.castShadow = true;
      carGroup.add(body);
      
      // Car top
      const topGeometry = new THREE.BoxGeometry(2, 0.8, 1.2);
      const topMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2e86de,
        metalness: 0.8,
        roughness: 0.2
      });
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.y = 0.9;
      top.castShadow = true;
      carGroup.add(top);
      
      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8);
      const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
      
      for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        
        const xPos = i < 2 ? -1 : 1;
        const zPos = i % 2 === 0 ? -0.6 : 0.6;
        
        wheel.position.set(xPos, -0.5, zPos);
        wheel.castShadow = true;
        carGroup.add(wheel);
      }
      
      car = carGroup;
      scene.add(car);
    };

    const cleanup = init();

    return () => {
      if (cleanup) {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0"
      style={{ 
        background: 'transparent',
        minHeight: '500px'
      }}
    />
  );
};

const Hero: React.FC = () => (
  <div className="topdog relative bg-secondary text-foreground py-20 lg:py-32 overflow-hidden">
    {/* 3D Car Animation Background */}
    <div className="absolute inset-0 z-0">
      <CarAnimation />
    </div>
    
    {/* Enhanced Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent z-10"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-background/30 z-10"></div>
    
    {/* Animated Floating Elements */}
    <div className="absolute inset-0 overflow-hidden z-5">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div className="container mx-auto px-6 text-center relative z-20">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Find Your Next
          <span className="block text-accent mt-2">Dream Car</span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Experience the future of car shopping with our immersive 3D previews and curated selection of premium vehicles.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/inventory" 
            className="bg-accent text-accent-foreground font-bold py-4 px-10 rounded-full hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 text-lg shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>Browse Inventory</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          {/* <button className="border-2 border-foreground/20 text-foreground font-bold py-4 px-10 rounded-full hover:border-accent hover:text-accent transition-all duration-300 transform hover:scale-105 text-lg">
            Book Test Drive
          </button> */}
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-accent">500+</div>
            <div className="text-sm text-muted-foreground">Premium Vehicles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-accent">98%</div>
            <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
          </div>
          <div className="text-center col-span-2 md:col-span-1">
            <div className="text-2xl md:text-3xl font-bold text-accent">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
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
    <div className="bg-secondary p-8 rounded-lg shadow-lg flex flex-col h-full border border-border hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
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
                <div className="p-6 bg-background rounded-lg border border-border hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-accent">Quality Inspected</h3>
                    <p className="mt-2 text-muted-foreground">Every vehicle undergoes a rigorous multi-point inspection to ensure it meets our highest standards.</p>
                </div>
                 <div className="p-6 bg-background rounded-lg border border-border hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-accent">Transparent Pricing</h3>
                    <p className="mt-2 text-muted-foreground">No hidden fees. We believe in honest, straightforward pricing for a stress-free buying experience.</p>
                </div>
                 <div className="p-6 bg-background rounded-lg border border-border hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
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
    <div className="overflow-hidden">
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