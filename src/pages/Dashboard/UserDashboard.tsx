import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { Fuel, MapPin, Clock, Car, CreditCard } from 'lucide-react';
import { getStations, saveRequest, getRequests } from '../../utils/localStorage';
import { sendWhatsAppMessage } from '../../services/whatsapp';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { FuelType, FuelRequest } from '@/types';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [selectedStation, setSelectedStation] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [quantity, setQuantity] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(user?.profile.vehicles[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  const stations = getStations();
  const userRequests = user ? getRequests().filter(r => r.userId === user.id) : [];

  const handleFuelRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const station = stations.find(s => s.id.toString() === selectedStation);
      if (!station || !user) return;

      const vehicle = user.profile.vehicles.find(v => v.id === selectedVehicle);
      if (!vehicle) return;

      const newRequest: FuelRequest = {
        id: uuidv4(),
        userId: user.id,
        stationId: station.id,
        vehicleId: vehicle.id,
        fuelType: fuelType as FuelType,
        quantity: parseFloat(quantity),
        urgencyLevel: 'medium',
        status: 'pending',
        price: station.inventory[fuelType as FuelType].price * parseFloat(quantity),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        notes: '',
        paymentMethod,
      };

      saveRequest(newRequest);

      // Send WhatsApp message
      sendWhatsAppMessage({
        customerName: user.profile.fullName,
        fuelType,
        quantity,
        location: station.location.address,
        vehicle: `${vehicle.model} (${vehicle.registrationNumber})`,
        paymentMethod,
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Fuel Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFuelRequest} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Vehicle</label>
                <Select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  required
                >
                  {user?.profile.vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} ({vehicle.registrationNumber})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Station</label>
                <Select
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                  required
                >
                  <option value="">Select a station</option>
                  {stations.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.name}
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
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="UPI">UPI</option>
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userRequests.map(request => {
                const station = stations.find(s => s.id === request.stationId);
                const vehicle = user?.profile.vehicles.find(v => v.id === request.vehicleId);
                return (
                  <div
                    key={request.id}
                    className="p-4 bg-gray-50 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Fuel className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{request.quantity}L {request.fuelType}</p>
                          <p className="text-sm text-gray-500">{station?.name}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'fulfilled'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4" />
                        <span>{vehicle?.model}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>{request.paymentMethod}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      {format(request.createdAt, 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                );
              })}
              {userRequests.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No recent requests
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nearby Stations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map(station => (
              <div
                key={station.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{station.name}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{station.ratings}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {station.location.address}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {station.operatingHours.open} - {station.operatingHours.close}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {Object.entries(station.inventory).map(([type, data]) => (
                      <div key={type} className="text-center p-2 bg-gray-50 rounded">
                        <p className="font-medium">{type}</p>
                        <p className="text-sm">₹{data.price}/L</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};