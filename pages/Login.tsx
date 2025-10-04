import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeftIcon } from '../components/IconComponents';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // This is a mock authentication.
    // In a real app, you'd fetch user data and verify the password.
    try {
        const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const userExists = storedUsers.find((u: any) => u.email === email && u.password === password);

        if (userExists) {
            const { password, ...userToLogin } = userExists;
            login(userToLogin);
            navigate('/');
        } else {
            setError('Invalid email or password.');
        }
    } catch (e) {
        setError('An error occurred during login.');
    }
  };

  return (
    <div className="relative flex flex-grow items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0 opacity-20"
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1740&auto=format&fit=crop')"}}
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link to="/register" className="font-medium text-accent hover:text-accent/90">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-secondary/80 p-8 rounded-lg border border-border" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-foreground mb-1">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-input placeholder-muted-foreground bg-white text-black rounded-md focus:outline-none focus:ring-ring focus:border-ring sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-login" className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                id="password-login"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-input placeholder-muted-foreground bg-white text-black rounded-md focus:outline-none focus:ring-ring focus:border-ring sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;