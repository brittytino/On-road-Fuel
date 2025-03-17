import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequests, getUsers, getStations } from '@/utils/localStorage';
import { format } from 'date-fns';
import { Fuel, Clock, CheckCircle, XCircle } from 'lucide-react';

export const RequestMonitoring = () => {
  const requests = getRequests();
  const users = getUsers();
  const stations = getStations();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled':
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
      case 'fulfilled':
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Request ID</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Station</th>
                  <th className="text-left p-4">Fuel Type</th>
                  <th className="text-left p-4">Quantity</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Created At</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => {
                  const user = users.find(u => u.id === request.userId);
                  const station = stations.find(s => s.id === request.stationId);
                  return (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{request.id.slice(0, 8)}</td>
                      <td className="p-4">{user?.profile.fullName}</td>
                      <td className="p-4">{station?.name}</td>
                      <td className="p-4">{request.fuelType}</td>
                      <td className="p-4">{request.quantity}L</td>
                      <td className="p-4">
                        <span className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </td>
                      <td className="p-4">{format(request.createdAt, 'MMM dd, HH:mm')}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                            Approve
                          </button>
                          <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};