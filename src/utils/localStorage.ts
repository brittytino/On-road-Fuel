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
  }
];

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
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    notes: 'Need fuel by evening',
    rating: undefined,
    review: undefined,
    paymentMethod: 'UPI'
  }
];

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
    localStorage.setItem(STORAGE_KEYS.SYSTEM_METRICS, JSON.stringify({
      performanceMetrics: {
        loadTime: [],
        responseTime: [],
        errorRate: 0
      },
      userMetrics: {
        activeUsers: 0,
        sessionDuration: [],
        actionCounts: {}
      }
    }));
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

// System Metrics
export const updateSystemMetrics = (metrics: any) => {
  const currentMetrics = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYSTEM_METRICS) || '{}');
  const updatedMetrics = { ...currentMetrics, ...metrics };
  localStorage.setItem(STORAGE_KEYS.SYSTEM_METRICS, JSON.stringify(updatedMetrics));
};

export const getSystemMetrics = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYSTEM_METRICS) || '{}');
};