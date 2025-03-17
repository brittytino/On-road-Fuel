// UsersPage.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const UsersPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User cards go here */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User 1</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">John Doe</div>
                <p className="text-xs text-muted-foreground">
                  john.doe@example.com
                </p>
              </CardContent>
            </Card>
            {/* Add more user cards as needed */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};