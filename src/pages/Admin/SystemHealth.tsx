import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSystemMetrics } from '@/utils/localStorage';
import { Activity, Server, Database, AlertTriangle } from 'lucide-react';

export const SystemHealth = () => {
  const metrics = getSystemMetrics();
  const errorRate = metrics.performanceMetrics.errorRate;
  const avgLoadTime = metrics.performanceMetrics.loadTime.reduce((a, b) => a + b, 0) / metrics.performanceMetrics.loadTime.length;
  const avgResponseTime = metrics.performanceMetrics.responseTime.reduce((a, b) => a + b, 0) / metrics.performanceMetrics.responseTime.length;

  const getHealthStatus = (value: number, threshold: number) => {
    if (value <= threshold * 0.5) return 'Excellent';
    if (value <= threshold * 0.8) return 'Good';
    if (value <= threshold) return 'Fair';
    return 'Poor';
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'Excellent':
        return 'text-green-500';
      case 'Good':
        return 'text-blue-500';
      case 'Fair':
        return 'text-yellow-500';
      case 'Poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Load</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgLoadTime.toFixed(2)}ms</div>
            <p className={`text-xs ${getHealthColor(getHealthStatus(avgLoadTime, 300))}`}>
              {getHealthStatus(avgLoadTime, 300)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime.toFixed(2)}ms</div>
            <p className={`text-xs ${getHealthColor(getHealthStatus(avgResponseTime, 200))}`}>
              {getHealthStatus(avgResponseTime, 200)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorRate}%</div>
            <p className={`text-xs ${getHealthColor(getHealthStatus(errorRate, 5))}`}>
              {getHealthStatus(errorRate, 5)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Health</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Healthy</div>
            <p className="text-xs text-green-500">Operational</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm h-[400px] overflow-y-auto">
            <div className="space-y-2">
              <div className="text-green-400">[INFO] System started successfully</div>
              <div className="text-blue-400">[DEBUG] Cache initialized</div>
              <div className="text-yellow-400">[WARN] High memory usage detected</div>
              <div className="text-green-400">[INFO] Database connection pool optimized</div>
              <div className="text-blue-400">[DEBUG] Session cleanup completed</div>
              <div className="text-green-400">[INFO] Background jobs scheduled</div>
              <div className="text-red-400">[ERROR] Failed to process request: timeout</div>
              <div className="text-green-400">[INFO] Auto-scaling triggered</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};