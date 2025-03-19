import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { getStations, saveRequest } from '@/utils/localStorage';
import { sendWhatsAppMessage } from '@/services/whatsapp';
import { v4 as uuidv4 } from 'uuid';
import { FuelType } from '@/types';
import { MapPin, Clock, CreditCard, Car, Navigation } from 'lucide-react';

export const RequestFuel = () => {
  const { user } = useAuth();
  const [selectedStation, setSelectedStation] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [quantity, setQuantity] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(user?.profile.vehicles[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: ''
  });

  const stations = getStations();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation(prev => ({ ...prev, latitude, longitude }));
        
        // Get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          setUserLocation(prev => ({ ...prev, address: data.display_name }));
        } catch (error) {
          console.error('Error getting address:', error);
        }
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const station = stations.find(s => s.id.toString() === selectedStation);
      if (!station || !user) return;

      const vehicle = user.profile.vehicles.find(v => v.id === selectedVehicle);
      if (!vehicle) return;

      const newRequest = {
        id: uuidv4(),
        userId: user.id,
        stationId: station.id,
        vehicleId: vehicle.id,
        fuelType,
        quantity: parseFloat(quantity),
        urgencyLevel: 'medium',
        status: 'pending',
        price: station.inventory[fuelType as FuelType].price * parseFloat(quantity),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        notes: '',
        paymentMethod,
        userLocation: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          address: userLocation.address
        }
      };

      saveRequest(newRequest);

      // Send WhatsApp notification
      sendWhatsAppMessage({
        customerName: user.profile.fullName,
        fuelType,
        quantity,
        location: userLocation.address || 'Location pending',
        vehicle: `${vehicle.model} (${vehicle.registrationNumber})`,
        paymentMethod,
        stationName: station.name
      });

      toast.success('Fuel request submitted successfully!');
      setSelectedStation('');
      setQuantity('');
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Request Fuel Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          {userLocation.address && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
              <Navigation className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-700">Your Current Location</p>
                <p className="text-sm text-blue-600">{userLocation.address}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Select Vehicle
                </label>
                <Select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  required
                  className="w-full"
                >
                  {user?.profile.vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} ({vehicle.registrationNumber})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Select Nearest Station
                </label>
                <Select
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                  required
                  className="w-full"
                >
                  <option value="">Select a station</option>
                  {stations.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.name} ({station.location.address})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fuel Type</label>
                <Select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  required
                  className="w-full"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity (Liters)</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Method
                </label>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                  className="w-full"
                >
                  <option value="UPI">UPI</option>
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {selectedStation && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Station Details</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const station = stations.find(s => s.id.toString() === selectedStation);
              if (!station) return null;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{station.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      station.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {station.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {station.location.address}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {station.operatingHours.open} - {station.operatingHours.close}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(station.inventory).map(([type, data]) => (
                      <div key={type} className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="font-medium">{type}</div>
                        <div className="text-sm text-gray-600">₹{data.price}/L</div>
                        <div className="text-sm text-gray-600">{data.available}L available</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};