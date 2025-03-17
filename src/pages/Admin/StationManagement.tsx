import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStations } from '@/utils/localStorage';
import { MapPin, Clock, Fuel } from 'lucide-react';

export const StationManagement = () => {
  const stations = getStations();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Station Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map(station => (
              <div key={station.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">{station.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    station.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {station.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {station.location.address}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {station.operatingHours.open} - {station.operatingHours.close}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {Object.entries(station.inventory).map(([type, data]) => (
                    <div key={type} className="bg-gray-50 p-2 rounded text-center">
                      <div className="font-medium text-sm">{type}</div>
                      <div className="text-xs text-gray-600">₹{data.price}/L</div>
                      <div className="text-xs text-gray-600">{data.available}L</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};