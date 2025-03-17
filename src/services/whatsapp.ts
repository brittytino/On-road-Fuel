export const sendWhatsAppMessage = (fuelRequest: any) => {
  const message = encodeURIComponent(`
🛢️ *New Fuel Request*

Customer: ${fuelRequest.customerName}
Fuel Type: ${fuelRequest.fuelType}
Quantity: ${fuelRequest.quantity}L
Location: ${fuelRequest.location}
Status: Pending

Thank you for using our service! We'll process your request shortly.`);

  const phoneNumber = '919786350537'; // Format: country code (91) + number
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};