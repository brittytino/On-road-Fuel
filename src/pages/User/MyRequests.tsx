import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getRequests, getStations } from '@/utils/localStorage';
import { format } from 'date-fns';
import { Fuel, MapPin, Clock, CreditCard, Car, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const MyRequests = () => {
  const { user } = useAuth();
  const requests = user ? getRequests().filter(r => r.userId === user.id) : [];
  const stations = getStations();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Fuel Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map(request => {
              const station = stations.find(s => s.id === request.stationId);
              const vehicle = user?.profile.vehicles.find(v => v.id === request.vehicleId);

              return (
                <div key={request.id} className="bg-white rounded-lg shadow p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-50 rounded-full">
                        <Fuel className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {request.quantity}L {request.fuelType}
                        </h3>
                        <p className="text-gray-500">{station?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{station?.location.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Car className="h-4 w-4" />
                      <span className="text-sm">{vehicle?.model}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm">{request.paymentMethod}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{format(request.createdAt, 'MMM dd, HH:mm')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-lg font-semibold">
                      Total: ₹{request.price.toFixed(2)}
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                          Cancel Request
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {requests.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Fuel className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No requests yet</h3>
                <p className="text-gray-500 mt-1">Your fuel requests will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};