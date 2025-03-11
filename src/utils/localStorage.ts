import { nanoid } from 'nanoid';
import {
  User,
  FuelStation,
  FuelRequest,
  Notification,
  SystemStats,
  FuelType,
  Vehicle
} from '../types';

const STORAGE_KEYS = {
  USERS: 'fds_users',
  STATIONS: 'fds_stations',
  REQUESTS: 'fds_requests',
  NOTIFICATIONS: 'fds_notifications',
  SESSION: 'fds_session',
  REMEMBER_TOKEN: 'fds_remember_token',
  SYSTEM_METRICS: 'fds_system_metrics'
};

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: nanoid(),
    type: 'Car',
    model: 'Maruti Swift',
    registrationNumber: 'MH-01-AB-1234',
    fuelType: 'Petrol',
    tankCapacity: 37
  },
  {
    id: nanoid(),
    type: 'SUV',
    model: 'Tata Nexon',
    registrationNumber: 'MH-01-CD-5678',
    fuelType: 'Diesel',
    tankCapacity: 44
  }
];

const INITIAL_USERS: User[] = [
  {
    id: nanoid(),
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    profile: {
      fullName: 'Rajesh Kumar',
      email: 'admin@fueldelivery.com',
      phone: '+91 9876543210',
      vehicles: [],
      preferences: {
        notificationsEnabled: true,
        lowFuelWarningThreshold: 20,
        preferredFuelType: 'Petrol',
        preferredPaymentMethod: 'UPI'
      }
    },
    favorites: [],
    createdAt: Date.now(),
    lastLogin: Date.now(),
    isActive: true
  },
  {
    id: nanoid(),
    username: 'user',
    password: 'user123',
    role: 'user',
    profile: {
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 9876543211',
      vehicles: INITIAL_VEHICLES,
      preferences: {
        notificationsEnabled: true,
        lowFuelWarningThreshold: 25,
        preferredFuelType: 'Petrol',
        preferredPaymentMethod: 'UPI'
      }
    },
    favorites: [1],
    createdAt: Date.now(),
    lastLogin: Date.now(),
    isActive: true
  }
];

const INITIAL_STATIONS: FuelStation[] = [
  {
    id: 1,
    name: 'Indian Oil Station - Andheri',
    location: {
      address: '123, SV Road, Andheri West, Mumbai - 400058',
      latitude: 19.1136,
      longitude: 72.8697
    },
    inventory: {
      Petrol: {
        available: 5000,
        capacity: 10000,
        price: 102.5,
        threshold: 1000
      },
      Diesel: {
        available: 3000,
        capacity: 8000,
        price: 89.8,
        threshold: 800
      },
      CNG: {
        available: 2000,
        capacity: 5000,
        price: 76.5,
        threshold: 500
      },
      Premium: {
        available: 1500,
        capacity: 3000,
        price: 112.0,
        threshold: 300
      }
    },
    operatingHours: {
      open: '06:00',
      close: '23:00'
    },
    services: ['Car Wash', 'Air Check', 'Oil Change', 'Battery Service'],
    ratings: 4.5,
    reviews: [
      {
        id: nanoid(),
        userId: INITIAL_USERS[1].id,
        rating: 4.5,
        comment: 'Great service and always available',
        timestamp: Date.now() - 86400000
      }
    ],
    isActive: true,
    managerId: nanoid()
  },
  {
    id: 2,
    name: 'Bharat Petroleum - Bandra',
    location: {
      address: '456, Linking Road, Bandra West, Mumbai - 400050',
      latitude: 19.0596,
      longitude: 72.8295
    },
    inventory: {
      Petrol: {
        available: 4000,
        capacity: 8000,
        price: 102.3,
        threshold: 800
      },
      Diesel: {
        available: 2500,
        capacity: 6000,
        price: 89.6,
        threshold: 600
      },
      CNG: {
        available: 1500,
        capacity: 4000,
        price: 76.2,
        threshold: 400
      },
      Premium: {
        available: 1200,
        capacity: 2500,
        price: 111.5,
        threshold: 250
      }
    },
    operatingHours: {
      open: '05:00',
      close: '00:00'
    },
    services: ['Car Wash', 'Tire Service', 'Mini Mart'],
    ratings: 4.3,
    reviews: [],
    isActive: true,
    managerId: nanoid()
  },
  {
    id: 3,
    name: 'HP Petrol Pump - Juhu',
    location: {
      address: '789, Juhu Beach Road, Mumbai - 400049',
      latitude: 19.0883,
      longitude: 72.8263
    },
    inventory: {
      Petrol: {
        available: 4500,
        capacity: 9000,
        price: 102.4,
        threshold: 900
      },
      Diesel: {
        available: 3200,
        capacity: 7500,
        price: 89.7,
        threshold: 750
      },
      CNG: {
        available: 1800,
        capacity: 4500,
        price: 76.3,
        threshold: 450
      },
      Premium: {
        available: 1300,
        capacity: 2800,
        price: 111.8,
        threshold: 280
      }
    },
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    services: ['Air Check', 'Mini Mart', 'ATM'],
    ratings: 4.2,
    reviews: [],
    isActive: true,
    managerId: nanoid()
  }
];

// Create more diverse request data
const INITIAL_REQUESTS: FuelRequest[] = [
  {
    id: nanoid(),
    userId: INITIAL_USERS[1].id,
    stationId: 1,
    vehicleId: INITIAL_VEHICLES[0].id,
    fuelType: 'Petrol',
    quantity: 20,
    urgencyLevel: 'medium',
    status: 'pending',
    price: 102.5,
    createdAt: Date.now() - 3600000, // 1 hour ago
    updatedAt: Date.now() - 3600000,
    notes: 'Need fuel by evening',
    rating: undefined,
    review: undefined
  },
  {
    id: nanoid(),
    userId: INITIAL_USERS[1].id,
    stationId: 2,
    vehicleId: INITIAL_VEHICLES[1].id,
    fuelType: 'Diesel',
    quantity: 25,
    urgencyLevel: 'high',
    status: 'fulfilled',
    price: 89.6,
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now() - 80000000,
    notes: 'Vehicle was almost empty',
    rating: 4,
    review: 'Quick service, highly recommended'
  },
  {
    id: nanoid(),
    userId: INITIAL_USERS[1].id,
    stationId: 1,
    vehicleId: INITIAL_VEHICLES[0].id,
    fuelType: 'Petrol',
    quantity: 15,
    urgencyLevel: 'low',
    status: 'fulfilled',
    price: 102.5,
    createdAt: Date.now() - 172800000, // 2 days ago
    updatedAt: Date.now() - 170000000,
    notes: 'Regular refill',
    rating: 5,
    review: 'Amazing service as always'
  },
  {
    id: nanoid(),
    userId: INITIAL_USERS[1].id,
    stationId: 3,
    vehicleId: INITIAL_VEHICLES[0].id,
    fuelType: 'Premium',
    quantity: 12,
    urgencyLevel: 'medium',
    status: 'fulfilled',
    price: 111.8,
    createdAt: Date.now() - 259200000, // 3 days ago
    updatedAt: Date.now() - 250000000,
    notes: 'Trying premium fuel',
    rating: 4.5,
    review: 'Great quality fuel, noticed better mileage'
  },
  {
    id: nanoid(),
    userId: INITIAL_USERS[1].id,
    stationId: 2,
    vehicleId: INITIAL_VEHICLES[1].id,
    fuelType: 'Diesel',
    quantity: 30,
    urgencyLevel: 'medium',
    status: 'pending',
    price: 89.6,
    createdAt: Date.now() - 1800000, // 30 minutes ago
    updatedAt: Date.now() - 1800000,
    notes: 'Planning long trip tomorrow',
    rating: undefined,
    review: undefined
  }
];

// Monthly consumption data for the user
const MONTHLY_CONSUMPTION = [
  { month: 'Jan', petrol: 75, diesel: 40, premium: 10 },
  { month: 'Feb', petrol: 82, diesel: 45, premium: 15 },
  { month: 'Mar', petrol: 68, diesel: 38, premium: 5 },
  { month: 'Apr', petrol: 79, diesel: 42, premium: 12 },
  { month: 'May', petrol: 85, diesel: 50, premium: 18 },
  { month: 'Jun', petrol: 90, diesel: 48, premium: 20 }
];

// Initialize system metrics
const INITIAL_SYSTEM_METRICS = {
  performanceMetrics: {
    loadTime: [0.8, 0.9, 0.7, 0.75, 0.85, 0.95, 1.0, 0.65],
    responseTime: [0.2, 0.3, 0.25, 0.4, 0.3, 0.2, 0.35, 0.3],
    errorRate: 0.02
  },
  userMetrics: {
    activeUsers: 2,
    sessionDuration: [320, 450, 280, 520, 380],
    actionCounts: {
      login: 24,
      fuelRequest: 15,
      profileUpdate: 3
    }
  },
  consumptionData: MONTHLY_CONSUMPTION
};

export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STATIONS)) {
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(INITIAL_STATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SYSTEM_METRICS)) {
    localStorage.setItem(STORAGE_KEYS.SYSTEM_METRICS, JSON.stringify(INITIAL_SYSTEM_METRICS));
  }
};

// User Management
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
};

export const getUserById = (id: string): User | null => {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
};

export const saveUser = (user: User) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// Station Management
export const getStations = (): FuelStation[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.STATIONS) || '[]');
};

export const getStationById = (id: number): FuelStation | null => {
  const stations = getStations();
  return stations.find(station => station.id === id) || null;
};

export const saveStation = (station: FuelStation) => {
  const stations = getStations();
  const index = stations.findIndex(s => s.id === station.id);
  if (index >= 0) {
    stations[index] = station;
  } else {
    stations.push(station);
  }
  localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(stations));
};

// Request Management
export const getRequests = (): FuelRequest[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
};

export const getRequestsByUserId = (userId: string): FuelRequest[] => {
  const requests = getRequests();
  return requests.filter(request => request.userId === userId);
};

export const saveRequest = (request: FuelRequest) => {
  const requests = getRequests();
  const index = requests.findIndex(r => r.id === request.id);
  if (index >= 0) {
    requests[index] = request;
  } else {
    requests.push(request);
  }
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
};

// Notification Management
export const getNotifications = (userId: string): Notification[] => {
  const notifications: Notification[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'
  );
  return notifications.filter(n => n.userId === userId);
};

export const saveNotification = (notification: Notification) => {
  const notifications = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'
  );
  notifications.push(notification);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

// Session Management
export const setSession = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
};

export const getSession = (): User | null => {
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  return session ? JSON.parse(session) : null;
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_TOKEN);
};

// Remember Me Token Management
export const setRememberToken = (token: string) => {
  localStorage.setItem(STORAGE_KEYS.REMEMBER_TOKEN, token);
};

export const getRememberToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REMEMBER_TOKEN);
};

// System Statistics
export const getSystemStats = (): SystemStats => {
  const users = getUsers();
  const requests = getRequests();
  const stations = getStations();

  return {
    activeUsers: users.filter(u => u.isActive).length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    fulfilledRequests: requests.filter(r => r.status === 'fulfilled').length,
    totalStations: stations.length,
    averageRating: stations.reduce((acc, s) => acc + s.ratings, 0) / stations.length
  };
};

// Get Monthly Consumption Data
export const getMonthlyConsumption = () => {
  const metrics = getSystemMetrics();
  return metrics.consumptionData || MONTHLY_CONSUMPTION;
};

// Calculate user fuel consumption statistics
export const getUserConsumptionStats = (userId: string) => {
  const requests = getRequestsByUserId(userId).filter(r => r.status === 'fulfilled');
  
  // Calculate total spent amount
  const totalSpent = requests.reduce((total, req) => total + (req.quantity * req.price), 0);
  
  // Calculate monthly average (last 6 months)
  const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);
  const recentRequests = requests.filter(r => r.createdAt >= sixMonthsAgo);
  const totalLiters = recentRequests.reduce((total, req) => total + req.quantity, 0);
  const averageMonthly = recentRequests.length > 0 ? (totalLiters / 6) : 0;
  
  // Calculate YTD total
  const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
  const ytdRequests = requests.filter(r => r.createdAt >= startOfYear);
  const ytdTotal = ytdRequests.reduce((total, req) => total + req.quantity, 0);
  
  // Calculate projected annual
  const projectedAnnual = averageMonthly * 12;
  
  return {
    totalSpent,
    averageMonthly: Math.round(averageMonthly * 10) / 10, // Round to 1 decimal place
    ytdTotal: Math.round(ytdTotal),
    projectedAnnual: Math.round(projectedAnnual)
  };
};

// System Metrics
export const updateSystemMetrics = (metrics: any) => {
  const currentMetrics = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYSTEM_METRICS) || '{}');
  const updatedMetrics = { ...currentMetrics, ...metrics };
  localStorage.setItem(STORAGE_KEYS.SYSTEM_METRICS, JSON.stringify(updatedMetrics));
};

export const getSystemMetrics = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYSTEM_METRICS) || '{}');
};