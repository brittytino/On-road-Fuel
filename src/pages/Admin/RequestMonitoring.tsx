import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequests, getUsers, getStations, saveRequest } from '@/utils/localStorage';
import { format } from 'date-fns';
import { Fuel, Clock, CheckCircle, XCircle, MapPin, Navigation } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const RequestMonitoring = () => {
  const requests = getRequests();
  const users = getUsers();
  const stations = getStations();

  const handleStatusUpdate = (requestId: string, newStatus: 'approved' | 'rejected') => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const updatedRequest = {
      ...request,
      status: newStatus,
      updatedAt: Date.now()
    };

    saveRequest(updatedRequest);
    toast.success(`Request ${newStatus} successfully`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Fuel className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fuel Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map(request => {
              const user = users.find(u => u.id === request.userId);
              const station = stations.find(s => s.id === request.stationId);
              const vehicle = user?.profile.vehicles.find(v => v.id === request.vehicleId);

              return (
                <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-50 rounded-full">
                        <Fuel className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {request.quantity}L {request.fuelType}
                        </h3>
                        <p className="text-gray-500">{user?.profile.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{station?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Navigation className="h-4 w-4" />
                      <span className="text-sm truncate" title={request.userLocation?.address}>
                        {request.userLocation?.address?.substring(0, 30)}...
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{format(request.createdAt, 'MMM dd, HH:mm')}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Vehicle</p>
                        <p className="font-medium">{vehicle?.model}</p>
                        <p className="text-sm text-gray-500">{vehicle?.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{user?.profile.phone}</p>
                        <p className="text-sm text-gray-500">{user?.profile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="font-medium">{request.paymentMethod}</p>
                        <p className="text-sm text-gray-500">₹{request.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Station Status</p>
                        <p className="font-medium">{station?.isActive ? 'Active' : 'Inactive'}</p>
                        <p className="text-sm text-gray-500">
                          {station?.inventory[request.fuelType]?.available}L available
                        </p>
                      </div>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {requests.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Fuel className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No requests yet</h3>
                <p className="text-gray-500 mt-1">New fuel requests will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};