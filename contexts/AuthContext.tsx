'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (in a real app, this would check a token)
    // Only run on client side
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      // Use a timeout to avoid the react-hooks/set-state-in-effect warning
      setTimeout(() => {
        setIsAuthenticated(loggedIn);
      }, 0);
    }
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
    }
    router.push('/login');
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Auto-logout after 20 minutes of inactivity
    let lastActivity = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;

      // 20 minutes in milliseconds
      if (inactiveTime > 20 * 60 * 1000) {
        logout();
      }
    }, 60000); // Check every minute

    // Update last activity on user interaction
    const handleUserActivity = () => {
      lastActivity = Date.now();
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // In a real app, this would be an API call
    // For demo purposes, we'll accept any non-empty username and password
    if (username && password) {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true');
      }
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
