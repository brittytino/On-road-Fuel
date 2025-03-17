// ReportsPage.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const ReportsPage = () => {
  // Sample data for the reports
  const reportsData = [
    {
      id: 1,
      title: 'Monthly Report - January',
      date: '2025-01-31',
      totalRequests: 120,
      totalFulfilled: 100,
      totalPending: 20,
      totalSpent: 5000,
    },
    {
      id: 2,
      title: 'Monthly Report - February',
      date: '2025-02-28',
      totalRequests: 130,
      totalFulfilled: 110,
      totalPending: 20,
      totalSpent: 5500,
    },
    // Add more reports as needed
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Requests</TableHead>
                <TableHead>Total Fulfilled</TableHead>
                <TableHead>Total Pending</TableHead>
                <TableHead>Total Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsData.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                  <TableCell>{report.totalRequests}</TableCell>
                  <TableCell>{report.totalFulfilled}</TableCell>
                  <TableCell>{report.totalPending}</TableCell>
                  <TableCell>₹{report.totalSpent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};