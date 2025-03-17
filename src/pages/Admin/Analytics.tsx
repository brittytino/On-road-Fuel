import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSystemStats, getRequests, getSystemMetrics } from '@/utils/localStorage';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';

export const Analytics = () => {
  const stats = getSystemStats();
  const requests = getRequests();
  const metrics = getSystemMetrics();

  // Prepare data for charts
  const requestsByDate = requests.reduce((acc, request) => {
    const date = format(request.createdAt, 'MMM dd');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const requestData = Object.entries(requestsByDate).map(([date, count]) => ({
    date,
    requests: count,
  }));

  const statusData = requests.reduce((acc, request) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusData).map(([status, value]) => ({
    name: status,
    value,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requests" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.performanceMetrics.loadTime.map((time, index) => ({
                  name: `Point ${index + 1}`,
                  loadTime: time,
                  responseTime: metrics.performanceMetrics.responseTime[index],
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="loadTime" stroke="#8884d8" name="Load Time" />
                  <Line type="monotone" dataKey="responseTime" stroke="#82ca9d" name="Response Time" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 text-sm font-medium">Active Users</div>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 text-sm font-medium">Fulfilled Requests</div>
                <div className="text-2xl font-bold">{stats.fulfilledRequests}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-yellow-600 text-sm font-medium">Pending Requests</div>
                <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 text-sm font-medium">Active Stations</div>
                <div className="text-2xl font-bold">{stats.totalStations}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};