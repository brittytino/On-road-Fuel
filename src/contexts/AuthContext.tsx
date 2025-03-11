import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import {
  getUsers,
  setSession,
  getSession,
  clearSession,
  setRememberToken,
  getRememberToken
} from '../utils/localStorage';
import { toast } from 'react-hot-toast';
import { nanoid } from 'nanoid';

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const sessionUser = getSession();
      const rememberToken = getRememberToken();

      if (sessionUser) {
        setUser(sessionUser);
      } else if (rememberToken) {
        // Implement token-based authentication here
        const users = getUsers();
        const rememberedUser = users.find(u => u.id === rememberToken);
        if (rememberedUser) {
          setUser(rememberedUser);
          setSession(rememberedUser);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string, remember = false) => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      if (!user.isActive) {
        toast.error('Account is disabled. Please contact administrator.');
        throw new Error('Account disabled');
      }

      // Update last login
      user.lastLogin = Date.now();
      setUser(user);
      setSession(user);

      if (remember) {
        const token = nanoid();
        setRememberToken(token);
      }

      toast.success('Login successful!');
    } else {
      toast.error('Invalid credentials');
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    clearSession();
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};