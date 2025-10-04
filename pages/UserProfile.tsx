import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';
import { CARS } from '../constants';
import CarCard from '../components/CarCard';
import Modal from '../components/Modal';
import type { Car, TestDrive, Purchase } from '../types';
import { 
    CalendarIcon, CheckCircleIcon, ClockIcon, XCircleIcon, CompareIcon, HeartIcon,
    SettingsIcon, KeyIcon, ShieldCheckIcon, BellIcon, LogOutIcon, GoogleIcon, FacebookIcon, ReceiptIcon,
    MenuIcon, XIcon
} from '../components/IconComponents';

type Tab = 'garage' | 'compare' | 'drives' | 'purchases' | 'settings';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
      favorites, recentlyViewed, compareItems, testDrives, purchases, 
      clearCompare, cancelTestDrive, rescheduleTestDrive 
  } = useUserData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('garage');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [driveToReschedule, setDriveToReschedule] = useState<TestDrive | null>(null);


  if (!user) {
    navigate('/login');
    return null;
  }
  
  const tabs = [
    { id: 'garage', label: 'My Garage', icon: <HeartIcon className="h-5 w-5"/> },
    { id: 'compare', label: 'Vehicle Comparison', icon: <CompareIcon className="h-5 w-5"/> },
    { id: 'drives', label: 'My Test Drives', icon: <CalendarIcon className="h-5 w-5"/> },
    { id: 'purchases', label: 'Purchase History', icon: <ReceiptIcon className="h-5 w-5"/> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5"/> }
  ];

  const activeTabData = useMemo(() => tabs.find(t => t.id === activeTab), [activeTab, tabs]);
  
  const favoriteCars = useMemo(() => CARS.filter(car => favorites.includes(car.id)), [favorites]);
  const recentlyViewedCars = useMemo(() => {
    const carMap = new Map(CARS.map(car => [car.id, car]));
    return recentlyViewed.map(id => carMap.get(id)).filter((car): car is Car => car !== undefined);
  }, [recentlyViewed]);
  const compareCars = useMemo(() => CARS.filter(car => compareItems.includes(car.id)), [compareItems]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRescheduleConfirm = (driveId: number, newDate: string) => {
    rescheduleTestDrive(driveId, newDate);
    setDriveToReschedule(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'garage':
        return <GarageContent favoriteCars={favoriteCars} recentlyViewedCars={recentlyViewedCars} />;
      case 'compare':
        return <CompareContent compareCars={compareCars} clearCompare={clearCompare} />;
      case 'drives':
        return <TestDrivesContent testDrives={testDrives} cancelTestDrive={cancelTestDrive} onReschedule={setDriveToReschedule} />;
      case 'purchases':
        return <PurchaseHistoryContent purchases={purchases} onSelectPurchase={setSelectedPurchase} />;
      case 'settings':
        return <SettingsContent logout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Welcome back, {user.fname}!</h1>
            <p className="mt-2 text-lg text-muted-foreground">Manage your vehicles and appointments here.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:hidden col-span-1">
              <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-full flex items-center justify-between p-4 bg-secondary rounded-lg border border-border"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-profile-menu"
              >
                  <div className="flex items-center gap-3">
                      {activeTabData?.icon}
                      <span className="font-semibold text-foreground">{activeTabData?.label}</span>
                  </div>
                  {isMobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
              {isMobileMenuOpen && (
                  <nav id="mobile-profile-menu" className="mt-2 bg-secondary p-3 rounded-lg border border-border space-y-2">
                      {tabs.map(tab => (
                          <button
                              key={tab.id}
                              onClick={() => {
                                  setActiveTab(tab.id as Tab);
                                  setIsMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-start gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                  activeTab === tab.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                              }`}
                          >
                              {tab.icon}
                              <span>{tab.label}</span>
                          </button>
                      ))}
                  </nav>
              )}
          </div>
          
          <aside className="hidden md:block md:col-span-1">
             <div className="bg-secondary p-3 rounded-lg border border-border space-y-2">
                {tabs.map(tab => (
                   <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`w-full flex items-center justify-center sm:justify-start gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
             </div>
          </aside>
          
          <main className="md:col-span-3">
              {renderContent()}
          </main>
        </div>
      </div>
      {selectedPurchase && <InvoiceModal purchase={selectedPurchase} onClose={() => setSelectedPurchase(null)} />}
       {driveToReschedule && (
        <RescheduleModal
          drive={driveToReschedule}
          onClose={() => setDriveToReschedule(null)}
          onConfirm={handleRescheduleConfirm}
        />
      )}
    </div>
  );
};

const GarageContent: React.FC<{ favoriteCars: Car[], recentlyViewedCars: Car[] }> = ({ favoriteCars, recentlyViewedCars }) => (
    <div>
        <Section title="Favorite Vehicles">
            {favoriteCars.length > 0 ? (
                <CarGrid cars={favoriteCars} />
            ) : (
                <EmptyState message="You haven't favorited any cars yet." />
            )}
        </Section>
        <Section title="Recently Viewed">
            {recentlyViewedCars.length > 0 ? (
                <CarGrid cars={recentlyViewedCars} />
            ) : (
                <EmptyState message="Your viewing history is empty." />
            )}
        </Section>
    </div>
);

const CompareContent: React.FC<{ compareCars: Car[], clearCompare: () => void }> = ({ compareCars, clearCompare }) => (
    <Section title="Vehicle Comparison">
        {compareCars.length > 0 ? (
            <div>
                <button onClick={clearCompare} className="mb-4 text-sm text-accent hover:underline">Clear All</button>
                <div className="overflow-x-auto bg-secondary p-4 rounded-lg border border-border">
                    <table className="w-full min-w-[600px] text-left">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="p-3 font-semibold text-foreground w-1/5">Feature</th>
                                {compareCars.map(car => (
                                    <th key={car.id} className="p-3 font-semibold text-foreground w-1/5">{car.make} {car.model}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <CompareRow label="Image" items={compareCars.map(c => <img src={c.images[0]} alt={c.make} className="w-full h-24 object-cover rounded"/>)} />
                            <CompareRow label="Price" items={compareCars.map(c => `₦${c.price.toLocaleString()}`)} isBold />
                            <CompareRow label="Year" items={compareCars.map(c => c.year)} />
                            <CompareRow label="Mileage" items={compareCars.map(c => `${c.mileage.toLocaleString()} mi`)} />
                            <CompareRow label="Horsepower" items={compareCars.map(c => `${c.horsepower} hp`)} />
                            <CompareRow label="Fuel Type" items={compareCars.map(c => c.fuelType)} />
                            <CompareRow label="Transmission" items={compareCars.map(c => c.transmission)} />
                             <CompareRow label="Features" items={compareCars.map(c => <ul className="text-xs list-disc list-inside">{c.features.slice(0, 3).map(f => <li key={f}>{f}</li>)}</ul>)} />
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            <EmptyState message="Add up to 4 cars from the inventory to compare them side-by-side." />
        )}
    </Section>
);

const TestDrivesContent: React.FC<{testDrives: TestDrive[], cancelTestDrive: (id: number) => void, onReschedule: (drive: TestDrive) => void}> = ({ testDrives, cancelTestDrive, onReschedule }) => (
    <Section title="My Test Drives">
        {testDrives.length > 0 ? (
            <div className="space-y-4">
                {testDrives.sort((a,b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()).map(drive => {
                    const car = CARS.find(c => c.id === drive.carId);
                    if (!car) return null;
                    const isUpcoming = new Date(drive.bookingDate) > new Date();
                    return (
                        <div key={drive.id} className="bg-secondary p-4 rounded-lg border border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <img src={car.images[0]} alt={car.make} className="w-full sm:w-32 h-24 object-cover rounded-md"/>
                            <div className="flex-grow">
                                <h3 className="font-bold text-foreground">{car.make} {car.model}</h3>
                                <p className="text-sm text-muted-foreground">{drive.location}</p>
                                <p className="text-sm text-muted-foreground">{new Date(drive.bookingDate).toLocaleString()}</p>
                                <StatusBadge status={drive.status} />
                            </div>
                            {(isUpcoming && (drive.status === 'Approved' || drive.status === 'Pending')) && (
                                <div className="flex space-x-2 self-start sm:self-center">
                                    <button onClick={() => onReschedule(drive)} className="text-xs px-3 py-1 rounded-md bg-background hover:bg-border transition-colors">Reschedule</button>
                                    <button onClick={() => cancelTestDrive(drive.id)} className="text-xs px-3 py-1 rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">Cancel</button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        ) : (
            <EmptyState message="You have no upcoming or past test drives." />
        )}
    </Section>
);

const PurchaseHistoryContent: React.FC<{ purchases: Purchase[], onSelectPurchase: (p: Purchase) => void }> = ({ purchases, onSelectPurchase }) => (
    <Section title="Purchase History">
        {purchases.length > 0 ? (
            <div className="space-y-4">
                {purchases.sort((a,b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()).map(purchase => {
                    const car = CARS.find(c => c.id === purchase.carId);
                    if (!car) return null;
                    return (
                        <div key={purchase.id} className="bg-secondary p-4 rounded-lg border border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <img src={car.images[0]} alt={car.make} className="w-full sm:w-32 h-24 object-cover rounded-md"/>
                            <div className="flex-grow">
                                <h3 className="font-bold text-foreground">{car.make} {car.model}</h3>
                                <p className="text-sm text-muted-foreground">Purchased on: {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                                <p className="text-sm text-muted-foreground">From: {purchase.dealership}</p>
                                <p className="text-md font-semibold text-foreground mt-1">Price: ₦{purchase.pricePaid.toLocaleString()}</p>
                            </div>
                            <button onClick={() => onSelectPurchase(purchase)} className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 self-start sm:self-center">
                                View Invoice
                            </button>
                        </div>
                    )
                })}
            </div>
        ) : (
            <EmptyState message="You have not purchased any vehicles yet." />
        )}
    </Section>
);

const InvoiceModal: React.FC<{ purchase: Purchase; onClose: () => void }> = ({ purchase, onClose }) => {
    const car = CARS.find(c => c.id === purchase.carId);

    if (!car) return null;

    const subtotal = purchase.pricePaid;
    const taxRate = 0.075; // 7.5% VAT mock
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <Modal isOpen={true} onClose={onClose} title={`Invoice #${purchase.id.toString().padStart(6, '0')}`}>
            <div className="text-sm">
                <div className="flex justify-between mb-4">
                    <div>
                        <h4 className="font-bold text-lg text-foreground">AutoSphere</h4>
                        <p className="text-muted-foreground">123 Auto Drive, Velocity City</p>
                    </div>
                    <div>
                        <p><span className="font-semibold text-foreground">Date:</span> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                        <p><span className="font-semibold text-foreground">Dealership:</span> {purchase.dealership}</p>
                    </div>
                </div>

                <div className="border-t border-b border-border my-4 py-4">
                    <h5 className="font-bold mb-2 text-foreground">Vehicle Details</h5>
                    <div className="flex items-center gap-4">
                        <img src={car.images[0]} alt={car.make} className="w-24 h-16 object-cover rounded"/>
                        <div>
                            <p className="font-semibold">{car.make} {car.model} ({car.year})</p>
                            <p className="text-muted-foreground">{car.condition}</p>
                        </div>
                    </div>
                </div>
                
                <h5 className="font-bold mt-4 mb-2 text-foreground">Price Breakdown</h5>
                <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span> <span>₦{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">VAT (7.5%)</span> <span>₦{tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                    <div className="flex justify-between font-bold text-lg border-t border-border pt-2 mt-2 text-foreground"><span>Total</span> <span>₦{total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                </div>

                <div className="mt-6 text-center">
                    <button onClick={() => alert('Printing invoice...')} className="w-full sm:w-auto bg-primary text-primary-foreground font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors duration-300">
                        Print Invoice
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const RescheduleModal: React.FC<{ drive: TestDrive; onClose: () => void; onConfirm: (driveId: number, newDate: string) => void }> = ({ drive, onClose, onConfirm }) => {
    const car = CARS.find(c => c.id === drive.carId);
    const initialDate = new Date(drive.bookingDate);
    const [newDate, setNewDate] = useState(initialDate.toISOString().split('T')[0]);
    const [newTime, setNewTime] = useState(initialDate.toTimeString().substring(0, 5));
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = () => {
        if (!newDate || !newTime) {
            alert("Please select a valid date and time.");
            return;
        }
        const newBookingDate = new Date(`${newDate}T${newTime}:00`).toISOString();
        onConfirm(drive.id, newBookingDate);
    };

    if (!car) return null;

    const inputClasses = "appearance-none block w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-ring focus:border-ring sm:text-sm";

    return (
        <Modal isOpen={true} onClose={onClose} title={`Reschedule: ${car.make} ${car.model}`}>
            <div className="space-y-4">
                <p className="text-muted-foreground">Current Booking: <span className="font-semibold text-foreground">{initialDate.toLocaleString()}</span></p>
                
                <div className="space-y-2">
                    <label htmlFor="new-date" className="block text-sm font-medium text-foreground">Select New Date</label>
                    <input 
                        type="date" 
                        id="new-date"
                        value={newDate} 
                        onChange={e => setNewDate(e.target.value)}
                        min={today}
                        className={inputClasses}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="new-time" className="block text-sm font-medium text-foreground">Select New Time</label>
                    <input 
                        type="time" 
                        id="new-time"
                        value={newTime} 
                        onChange={e => setNewTime(e.target.value)} 
                        className={inputClasses}
                    />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <button onClick={onClose} className="bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded-lg hover:bg-border transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                        Confirm Reschedule
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const SettingsContent: React.FC<{ logout: () => void }> = ({ logout }) => {
    const [notifications, setNotifications] = useState({
        newVehicles: true,
        promotions: true,
        testDrives: false,
    });

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotifications({
            ...notifications,
            [e.target.name]: e.target.checked
        });
        alert('Notification preferences updated (mock).');
    };

    return (
        <div className="space-y-12">
            <Section title="Account Security">
                <div className="space-y-4">
                    <SettingsRow
                        icon={<KeyIcon className="h-6 w-6 text-muted-foreground" />}
                        title="Change Password"
                        description="Update your password regularly to keep your account secure."
                        action={<Link to="/profile/change-password" className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">Change</Link>}
                    />
                    <SettingsRow
                        icon={<ShieldCheckIcon className="h-6 w-6 text-muted-foreground" />}
                        title="Two-Factor Authentication"
                        description="Add an extra layer of security to your account."
                        action={<button onClick={() => alert('Opening 2FA setup...')} className="text-sm font-semibold bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-md hover:bg-border">Enable</button>}
                    />
                </div>
            </Section>

            <Section title="Notification Preferences">
                 <div className="space-y-4">
                    <SettingsRow
                        icon={<BellIcon className="h-6 w-6 text-muted-foreground" />}
                        title="New Vehicle Alerts"
                        description="Get notified when new cars matching your interests arrive."
                        action={<Switch checked={notifications.newVehicles} name="newVehicles" onChange={handleNotificationChange} />}
                    />
                     <SettingsRow
                        icon={<BellIcon className="h-6 w-6 text-muted-foreground" />}
                        title="Promotional Offers"
                        description="Receive special deals and exclusive offers."
                        action={<Switch checked={notifications.promotions} name="promotions" onChange={handleNotificationChange} />}
                    />
                     <SettingsRow
                        icon={<BellIcon className="h-6 w-6 text-muted-foreground" />}
                        title="Test Drive Reminders"
                        description="Get reminders for your scheduled appointments."
                        action={<Switch checked={notifications.testDrives} name="testDrives" onChange={handleNotificationChange} />}
                    />
                </div>
            </Section>
            
            <Section title="Linked Social Accounts">
                <div className="space-y-4">
                    <SettingsRow
                        icon={<GoogleIcon className="h-6 w-6" />}
                        title="Google"
                        description="Connect your Google account for faster sign-in."
                        action={<button onClick={() => alert('Connecting to Google...')} className="text-sm font-semibold bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-md hover:bg-border">Connect</button>}
                    />
                     <SettingsRow
                        icon={<FacebookIcon className="h-6 w-6 text-blue-600" />}
                        title="Facebook"
                        description="Link your account to your Facebook profile."
                        action={<span className="text-sm font-semibold text-green-500">Connected</span>}
                    />
                </div>
            </Section>

            <button
                onClick={logout}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-500/10 text-red-500 font-bold py-3 px-6 rounded-lg hover:bg-red-500/20 transition-colors duration-300"
            >
                <LogOutIcon className="h-5 w-5" />
                <span>Logout</span>
            </button>
        </div>
    );
};

const SettingsRow: React.FC<{
    icon: React.ReactNode,
    title: string,
    description: string,
    action: React.ReactNode
}> = ({ icon, title, description, action }) => (
    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border">
        <div className="flex items-center gap-4">
            {icon}
            <div>
                <h4 className="font-semibold text-foreground">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
        <div>
            {action}
        </div>
    </div>
);

const Switch: React.FC<{ checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, name: string }> = ({ checked, onChange, name }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
    </label>
);

const StatusBadge: React.FC<{status: TestDrive['status']}> = ({ status }) => {
    const statusStyles = {
        Approved: { icon: <CheckCircleIcon/>, text: 'text-green-500', bg: 'bg-green-500/10' },
        Pending: { icon: <ClockIcon/>, text: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        Completed: { icon: <CheckCircleIcon/>, text: 'text-blue-500', bg: 'bg-blue-500/10' },
        Cancelled: { icon: <XCircleIcon/>, text: 'text-red-500', bg: 'bg-red-500/10' },
    };
    const style = statusStyles[status];
    return <div className={`mt-2 inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>{React.cloneElement(style.icon, {className: "h-4 w-4"})} {status}</div>
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="mb-12 last:mb-0">
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-6">{title}</h2>
        {children}
    </div>
);

const CarGrid: React.FC<{ cars: Car[] }> = ({ cars }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cars.map(car => <CarCard key={car.id} car={car} />)}
    </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-12 bg-secondary rounded-lg border border-border">
        <p className="text-muted-foreground">{message}</p>
    </div>
);

const CompareRow: React.FC<{ label: string, items: React.ReactNode[], isBold?: boolean }> = ({ label, items, isBold = false }) => (
    <tr className="border-b border-border last:border-b-0">
        <td className="p-3 font-medium text-foreground">{label}</td>
        {items.map((item, index) => <td key={index} className={`p-3 text-muted-foreground ${isBold ? 'font-bold text-foreground' : ''}`}>{item}</td>)}
    </tr>
);

export default UserProfile;