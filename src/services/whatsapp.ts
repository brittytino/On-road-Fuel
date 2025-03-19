interface FuelRequestMessage {
  customerName: string;
  fuelType: string;
  quantity: string;
  location: string;
  vehicle: string;
  paymentMethod: string;
  stationName: string;
}

export const sendWhatsAppMessage = (fuelRequest: FuelRequestMessage) => {
  const message = encodeURIComponent(`
🛢️ *New Fuel Request*

Customer: ${fuelRequest.customerName}
Fuel Type: ${fuelRequest.fuelType}
Quantity: ${fuelRequest.quantity}L
Delivery Location: ${fuelRequest.location}
Vehicle: ${fuelRequest.vehicle}
Payment Method: ${fuelRequest.paymentMethod}
Selected Station: ${fuelRequest.stationName}
Status: Pending

Thank you for using our service! We'll process your request shortly.`);

  const phoneNumber = '919786350537'; // Format: country code (91) + number
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};