// StationsPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// utils/localStorage.ts
export const getStations = () => {
    // This is a placeholder function. Replace with actual data fetching logic.
    return [
        {
            id: 1,
            name: 'Central Fuel Station',
            location: {
                address: '123 Fuel Lane',
                city: 'City',
                state: 'State',
                latitude: 40.7128,
                longitude: -74.0060,
            },
            operatingHours: {
                open: '06:00',
                close: '22:00',
            },
            inventory: {
                Petrol: { quantity: 1000, price: 102.5 },
                Diesel: { quantity: 500, price: 89.7 },
                CNG: { quantity: 200, price: 76.4 },
            },
        },
        {
            id: 2,
            name: 'East Side Fuel Station',
            location: {
                address: '456 East St',
                city: 'City',
                state: 'State',
                latitude: 40.7128,
                longitude: -74.0060,
            },
            operatingHours: {
                open: '07:00',
                close: '23:00',
            },
            inventory: {
                Petrol: { quantity: 800, price: 102.4 },
                Diesel: { quantity: 400, price: 89.6 },
                CNG: { quantity: 150, price: 76.3 },
            },
        },
        // Add more stations as needed
    ];
};

export const StationsPage = () => {
    // Fetch stations data from local storage or API
    const stations = getStations();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Fuel Stations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Operating Hours</TableHead>
                                <TableHead>Inventory</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stations.map((station) => (
                                <TableRow key={station.id}>
                                    <TableCell className="font-medium">{station.id}</TableCell>
                                    <TableCell>{station.name}</TableCell>
                                    <TableCell>
                                        {station.location.address}, {station.location.city}, {station.location.state}
                                    </TableCell>
                                    <TableCell>
                                        {station.operatingHours.open} - {station.operatingHours.close}
                                    </TableCell>
                                    <TableCell>
                                        {Object.entries(station.inventory).map(([fuelType, details]) => (
                                            <div key={fuelType}>
                                                <strong>{fuelType}</strong>: {details.quantity}L @ ₹{details.price}/L
                                            </div>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
