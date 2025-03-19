import { ReactNode } from 'react';

export type Role = 'admin' | 'user' | 'station';
export type FuelType = 'Petrol' | 'Diesel' | 'CNG';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type PaymentMethod = 'UPI' | 'card' | 'cash' | 'wallet';
export type ServiceType = 'Car Wash' | 'Tire Service' | 'Oil Change' | 'Battery Service' | 'Air Check' | 'Mini Mart';

export interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  profile: UserProfile;
  favorites: number[]; // station IDs
  createdAt: number;
  lastLogin: number;
  isActive: boolean;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  vehicles: Vehicle[];
  preferences: UserPreferences;
}

export interface Vehicle {
  id: string;
  type: string;
  model: string;
  registrationNumber: string;
  fuelType: FuelType;
  tankCapacity: number;
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  lowFuelWarningThreshold: number;
  preferredFuelType: FuelType;
  preferredPaymentMethod: PaymentMethod;
}

export interface FuelStation {
  id: number;
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  inventory: {
    [key in FuelType]: {
      available: number;
      capacity: number;
      price: number;
      threshold: number;
    };
  };
  operatingHours: {
    open: string;
    close: string;
  };
  services: ServiceType[];
  ratings: number;
  reviews: Review[];
  isActive: boolean;
  managerId: string;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp: number;
}

export interface FuelRequest {
  id: string;
  userId: string;
  stationId: number;
  vehicleId: string;
  fuelType: FuelType;
  quantity: number;
  urgencyLevel: UrgencyLevel;
  status: RequestStatus;
  price: number;
  createdAt: number;
  updatedAt: number;
  notes: string;
  rating?: number;
  review?: string;
  paymentMethod: PaymentMethod;
  userLocation?: UserLocation;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  timestamp: number;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface SystemStats {
  activeUsers: number;
  pendingRequests: number;
  fulfilledRequests: number;
  totalStations: number;
  averageRating: number;
}

export interface SystemMetrics {
  performanceMetrics: {
    loadTime: number[];
    responseTime: number[];
    errorRate: number;
  };
  userMetrics: {
    activeUsers: number;
    sessionDuration: number[];
    actionCounts: Record<string, number>;
  };
}