import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getRequests, getStationById } from '../../utils/localStorage';
import { format } from 'date-fns';
import { Droplet, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const StationDashboard = () => {
  const { user } = useAuth();
  const station = getStationById(parseInt(user?.id || '0'));
  const requests = getRequests().filter((r) => r.stationId === station?.id);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const todayRequests = requests.filter(
    (r) => format(r.createdAt, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(station?.inventory || {}).map(([type, data]) => (
          <div key={type} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{type}</h3>
              <Droplet
                className={`h-6 w-6 ${
                  data.available < data.threshold
                    ? 'text-red-500'
                    : 'text-blue-500'
                }`}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Available</span>
                <span className="font-medium">{data.available}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Capacity</span>
                <span className="font-medium">{data.capacity}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price</span>
                <span className="font-medium">${data.price}/L</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    data.available < data.threshold
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                  style={{
                    width: `${(data.available / data.capacity) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Clock className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="font-medium">
                      {request.quantity}L {request.fuelType}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(request.createdAt, 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                    Accept
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingRequests.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No pending requests
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Today's Activity</h2>
          <div className="space-y-4">
            {todayRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  {request.status === 'fulfilled' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : request.status === 'pending' ? (
                    <Clock className="h-6 w-6 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      {request.quantity}L {request.fuelType}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(request.createdAt, 'HH:mm')}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    request.status === 'fulfilled'
                      ? 'bg-green-100 text-green-800'
                      : request.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {request.status}
                </span>
              </div>
            ))}
            {todayRequests.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No activity today
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};