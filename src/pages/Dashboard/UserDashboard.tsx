import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FuelType, FuelRequest } from '../../types';
import { Button } from '@/components/ui/button';
import { 
  getRequests, 
  getStations, 
  getRequestsByUserId, 
  getUserConsumptionStats,
  getMonthlyConsumption,
  getSystemMetrics,
  saveRequest
} from '../../utils/localStorage';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import {
  Fuel,
  ReceiptText,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCcw,
  Map,
  Filter,
  ChevronDown,
  X
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { nanoid } from 'nanoid';

type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Premium';

interface FuelRequest {
  id: string;
  userId: string;
  stationId: number;
  vehicleId: string;
  fuelType: FuelType;
  quantity: number;
  urgencyLevel: string;
  status: string;
  price: number;
  createdAt: number;
  updatedAt: number;
  notes: string;
  rating?: number;
  review?: string;
}

export const UserDashboard = () => {
  const { user } = useAuth();
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType>('Petrol');
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(20);
  const [urgencyLevel, setUrgencyLevel] = useState('medium');
  const [notes, setNotes] = useState('');
  const [refresh, setRefresh] = useState(0);

  // Get user requests
  const requests = user?.id ? getRequestsByUserId(user.id) : [];
  
  // Get stations with proper inventory
  const stations = getStations();

  // Get monthly consumption data
  const monthlyConsumption = getMonthlyConsumption();
  const consumptionData = monthlyConsumption.map((data: { month: string; petrol: number; diesel: number; premium: number }) => ({
    month: data.month,
    amount: data.petrol + data.diesel + data.premium
  }));

  // Get consumption stats for the user
  const consumptionStats = user?.id ? getUserConsumptionStats(user.id) : {
    averageMonthly: 0,
    ytdTotal: 0,
    projectedAnnual: 0
  };

  // Create price history from system metrics
  const systemMetrics = getSystemMetrics();
  const priceData = stations.slice(0, 3).map(station => {
    const inventory = station.inventory || {};
    return {
      id: station.id,
      name: station.name,
      distance: calculateDistance(station.location.latitude, station.location.longitude),
      petrol: inventory.Petrol?.price || 0,
      diesel: inventory.Diesel?.price || 0,
      premium: 0,
      cng: inventory.CNG?.price || 0
    };
  });

  // Get price trends (simplified for demo)
  const priceHistory = [
    { date: 'Jan', petrol: 102.3, diesel: 89.5, cng: 76.2 },
    { date: 'Feb', petrol: 102.5, diesel: 89.7, cng: 76.4 },
    { date: 'Mar', petrol: 102.4, diesel: 89.6, cng: 76.3 },
    { date: 'Apr', petrol: 102.6, diesel: 89.8, cng: 76.5 },
    { date: 'May', petrol: 102.5, diesel: 89.7, cng: 76.4 },
    { date: 'Jun', petrol: 102.4, diesel: 89.6, cng: 76.3 },
  ];

  // Get request stats
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const fulfilledCount = requests.filter(r => r.status === 'fulfilled').length;
  const totalSpent = calculateTotalSpent(requests);
  
  // Format recent requests
  const recentRequests = [...requests].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  // Handle fuel request submission
  const handleFuelRequest = () => {
    if (!user?.id || !selectedStation) return;
    
    // Find the vehicle for the user
    const userVehicle = user.profile?.vehicles?.[0]?.id || '';
    
    // Get fuel price from selected station
    const fuelPrice = selectedStation.inventory[selectedFuelType]?.price || 0;
    
    const newRequest: FuelRequest = {
      id: nanoid(),
      userId: user.id,
      stationId: selectedStation.id.toString(),
      vehicleId: userVehicle,
      fuelType: selectedFuelType,
      quantity: parseInt(quantity.toString()),
      urgencyLevel,
      status: 'pending',
      price: fuelPrice,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      notes: notes,
      rating: undefined,
      review: undefined
    };
    
    saveRequest(newRequest);
    setShowFuelModal(false);
    setRefresh(prev => prev + 1);
    
    // Reset form
    setSelectedFuelType('Petrol');
    setQuantity(20);
    setUrgencyLevel('medium');
    setNotes('');
    setSelectedStation(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button 
          className="bg-blue-500 hover:bg-blue-600" 
          onClick={() => setShowFuelModal(true)}
        >
          <Fuel className="mr-2 h-4 w-4" />
          Request Fuel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting fulfillment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfilled Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fulfilledCount}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ReceiptText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All-time fuel expenses
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="prices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prices">Fuel Prices</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="stations">Nearby Stations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Price Trends</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Price']} />
                    <Legend />
                    <Line type="monotone" dataKey="petrol" stroke="#3B82F6" name="Petrol" />
                    <Line type="monotone" dataKey="diesel" stroke="#10B981" name="Diesel" />
                    <Line type="monotone" dataKey="cng" stroke="#6366F1" name="CNG" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {priceData.map(station => (
              <Card key={station.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{station.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{station.distance} km away</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Petrol</span>
                      <span className="font-medium">₹{station.petrol.toFixed(2)}/L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Diesel</span>
                      <span className="font-medium">₹{station.diesel.toFixed(2)}/L</span>
                    </div>
                    {station.cng > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">CNG</span>
                        <span className="font-medium">₹{station.cng.toFixed(2)}/L</span>
                      </div>
                    )}
                    {station.premium > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Premium</span>
                        <span className="font-medium">₹{station.premium.toFixed(2)}/L</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600" 
                    size="sm"
                    onClick={() => {
                      const stationObj = stations.find(s => s.id === station.id);
                      if (stationObj) {
                        setSelectedStation(stationObj);
                        setShowFuelModal(true);
                      }
                    }}
                  >
                    Request Fuel
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Fuel Orders</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setRefresh(prev => prev + 1)}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRequests.length > 0 ? (
                  recentRequests.map(request => {
                    // Find station
                    const station = stations.find(s => s.id === request.stationId) || { name: "Unknown Station" };
                    // Calculate cost
                    const cost = request.quantity * request.price;
                    
                    return (
                      <div key={request.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        {request.status === 'fulfilled' ? (
                          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        ) : request.status === 'pending' ? (
                          <Clock className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{request.quantity}L {request.fuelType || "Fuel"}</p>
                            <p className="text-gray-500">{format(new Date(request.createdAt), 'MMM dd, yyyy')}</p>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-gray-500">
                              Station: {station.name}
                            </p>
                            <p className="text-sm font-medium">₹{cost.toFixed(2)}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            request.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {request.status || "unknown"}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 py-8">No order history found</p>
                )}
              </div>
              {recentRequests.length > 0 && (
                <Button variant="outline" className="w-full mt-4">
                  View All Orders
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consumption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Fuel Consumption</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consumptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}L`, 'Consumption']} />
                    <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Average Monthly</p>
                  <p className="text-xl font-bold">{consumptionStats.averageMonthly}L</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">YTD Total</p>
                  <p className="text-xl font-bold">{consumptionStats.ytdTotal}L</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Projected Annual</p>
                  <p className="text-xl font-bold">{consumptionStats.projectedAnnual}L</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nearby Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
                <Map className="h-12 w-12 text-gray-400" />
                <p className="ml-4 text-gray-500">Map view would be displayed here</p>
              </div>
              <div className="space-y-4">
                {stations.map(station => (
                  <div key={station.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{station.name}</h3>
                        <p className="text-sm text-gray-500">
                          {calculateDistance(station.location.latitude, station.location.longitude)} km away • 
                          Open {station.operatingHours.open} to {station.operatingHours.close}
                        </p>
                      </div>
                      <Button 
                        className="bg-blue-500 hover:bg-blue-600" 
                        size="sm"
                        onClick={() => {
                          setSelectedStation(station);
                          setShowFuelModal(true);
                        }}
                      >
                        Request
                      </Button>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {Object.entries(station.inventory || {}).map(([type, data]: [string, any]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm">{type}</span>
                          <span className="text-sm font-medium">₹{data.price.toFixed(2)}/L</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fuel Request Modal */}
      <Dialog open={showFuelModal} onOpenChange={setShowFuelModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Fuel Delivery</DialogTitle>
            <Button 
              className="absolute right-4 top-4" 
              variant="ghost" 
              size="icon"
              onClick={() => setShowFuelModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="station">Fuel Station</Label>
              <Select 
                value={selectedStation?.id?.toString() || ''} 
                onValueChange={(value) => {
                  const station = stations.find(s => s.id.toString() === value);
                  setSelectedStation(station || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map(station => (
                    <SelectItem key={station.id} value={station.id.toString()}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select 
                value={selectedFuelType} 
                onValueChange={(value) => setSelectedFuelType(value as FuelType)}
                disabled={!selectedStation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {selectedStation && Object.keys(selectedStation.inventory).map(type => (
                    <SelectItem key={type} value={type}>
                      {type} (₹{selectedStation.inventory[type].price.toFixed(2)}/L)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Liters)</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="1" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Within 24 hours</SelectItem>
                  <SelectItem value="medium">Medium - Within 12 hours</SelectItem>
                  <SelectItem value="high">High - Within 6 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Input 
                id="notes" 
                placeholder="Any special instructions..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            {selectedStation && selectedFuelType && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Order Summary</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Fuel:</span>
                    <span className="text-sm font-medium">{selectedFuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Price per liter:</span>
                    <span className="text-sm font-medium">₹{selectedStation.inventory[selectedFuelType]?.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Quantity:</span>
                    <span className="text-sm font-medium">{quantity} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="text-sm font-medium">₹{(quantity * selectedStation.inventory[selectedFuelType]?.price).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleFuelRequest}
              disabled={!selectedStation || !selectedFuelType || quantity <= 0}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper functions
function calculateTotalSpent(requests: FuelRequest[]) {
  return requests
    .filter(r => r.status === 'fulfilled')
    .reduce((total, request) => {
      const price = request.price || 0;
      const quantity = request.quantity || 0;
      return total + (quantity * price);
    }, 0);
}

function calculateDistance(lat1: number, lon1: number) {
  // This is a placeholder that would normally calculate distance from user's location
  // For demo purposes, we'll return a random distance between 1 and 10 km
  return Math.floor(Math.random() * 10) + 1;
}

export default UserDashboard;