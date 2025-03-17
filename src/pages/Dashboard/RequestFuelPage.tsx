// RequestFuelPage.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';

export const RequestFuelPage = () => {
  const [fuelType, setFuelType] = useState('Petrol');
  const [quantity, setQuantity] = useState(20);
  const [urgencyLevel, setUrgencyLevel] = useState('medium');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    console.log('Request submitted:', { fuelType, quantity, urgencyLevel, notes });
  };

  return (
    <div>
      <h2>Request Fuel</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select value={fuelType} onValueChange={setFuelType}>
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Petrol">Petrol</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="CNG">CNG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Label htmlFor="quantity">Quantity (Liters)</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="urgencyLevel">Urgency Level</Label>
          <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select urgency level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - Within 24 hours</SelectItem>
              <SelectItem value="medium">Medium - Within 12 hours</SelectItem>
              <SelectItem value="high">High - Within 6 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Label htmlFor="notes">Additional Notes</Label>
          <Input
            id="notes"
            placeholder="Any special instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <Button type="submit">Submit Request</Button>
      </form>
    </div>
  );
};