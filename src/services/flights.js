const basePrices = {
  'BSB-MAD': 3300, 'BSB-BCN': 3500,
  'PMW-MAD': 3800, 'PMW-BCN': 4000,
  'BSB-VLC': 3600, 'BSB-SVQ': 3650, 'BSB-AGP': 3550,
  'PMW-VLC': 4100, 'PMW-SVQ': 4150, 'PMW-AGP': 4050
};

async function searchFlightPrice(origin, destination, departureDate) {
  const routeKey = (origin + '-' + destination).toUpperCase();
  const basePrice = basePrices[routeKey] || 3700;
  const variation = Math.random() * 900 - 550;
  const currentPrice = Math.max(2200, Math.round(basePrice + variation));
  const airlines = ['TAP Air Portugal', 'LATAM + Iberia', 'Air Europa', 'GOL + Air France/KLM'];
  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  return {
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departureDate: departureDate || 'Qualquer data',
    price: currentPrice,
    airline,
    currency: 'BRL',
    checkedAt: new Date().toISOString()
  };
}

module.exports = { searchFlightPrice };