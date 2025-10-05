import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { COUNTRIES_WITH_STATES } from '../data/locationData';
import { ArrowLeftIcon } from '../components/IconComponents';
import { User } from '../types';

const Register: React.FC = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [statesForCountry, setStatesForCountry] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const countries = Object.keys(COUNTRIES_WITH_STATES).sort();

  useEffect(() => {
    if (country) {
      setStatesForCountry(COUNTRIES_WITH_STATES[country] || []);
      setState(''); // Reset state when country changes
    } else {
      setStatesForCountry([]);
    }
  }, [country]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fname || !lname || !phone || !country || !state) {
        setError("All fields are required.");
        return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    
    try {
        const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const userExists = storedUsers.find((u: any) => u.email === email);
        if (userExists) {
            setError('An account with this email already exists.');
            return;
        }

        const role = email === 'superadmin@autosphere.com' ? 'superadmin' 
                   : email === 'dealer@autosphere.com' ? 'dealer' 
                   : 'customer';

        const newUserForStorage = { fname, lname, email, phone, country, state, password, role, status: 'Active' as const };
        const newUsers = [...storedUsers, newUserForStorage];
        localStorage.setItem('registered_users', JSON.stringify(newUsers));
        
        const userToRegister: User = {
          fname, lname, email, phone, country, state, role,
          status: 'Active',
          address: null,
          verificationStatus: 'Unverified',
          kycDocument: null,
        };
        register(userToRegister);
        navigate('/');

    } catch (e) {
        setError('An error occurred during registration.');
    }
  };
  
  const inputClasses = "appearance-none rounded-md relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-black bg-white focus:outline-none focus:ring-ring focus:border-ring sm:text-sm";
  // Apply a specific style to select elements to ensure readability in both light and dark modes.
  const selectClasses = "appearance-none rounded-md relative block w-full px-3 py-2 border border-input bg-white text-black focus:outline-none focus:ring-ring focus:border-ring sm:text-sm";

  return (
    <div className="relative flex flex-grow items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0 opacity-20"
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1640&auto=format&fit=crop')"}}
      />
      <div className="absolute inset-0 w-full h-full bg-background/80 backdrop-blur-sm z-0"/>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute -top-4 -left-4 sm:-left-12 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link to="/login" className="font-medium text-accent hover:text-accent/90">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-secondary/80 p-8 rounded-lg border border-border" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input id="fname" name="fname" type="text" required className={inputClasses} placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} />
              <input id="lname" name="lname" type="text" required className={inputClasses} placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} />
            </div>
            <input id="email-address-reg" name="email" type="email" autoComplete="email" required className={inputClasses} placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input id="phone" name="phone" type="tel" autoComplete="tel" required className={inputClasses} placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <select id="country" name="country" required className={selectClasses} value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="" disabled>Select Country</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select id="state" name="state" required className={selectClasses} value={state} onChange={(e) => setState(e.target.value)} disabled={!country}>
                <option value="" disabled>Select State/Province</option>
                {statesForCountry.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input id="password-reg" name="password" type="password" autoComplete="new-password" required className={inputClasses} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input id="confirm-password-reg" name="confirm-password" type="password" autoComplete="new-password" required className={inputClasses} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;