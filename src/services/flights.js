// src/services/flights.js

/**
 * Monitora rotas internacionais saindo de Palmas (PMW) e Bras�lia (BSB) com destino � Espanha
 * Destinos: Madri (MAD) e Barcelona (BCN)
 * Conex�es t�picas: TAP (via Lisboa), LATAM (via GRU), Iberia ou Air Europa.
 */
async function searchFlightPrice(origin, destination, departureDate) {
  // M�dias de pre�o base saindo de BSB e PMW para Espanha
  const basePrices = {
    'BSB-MAD': 3300, // Bras�lia -> Madri (frequente via TAP ou conex�o)
    'BSB-BCN': 3500, // Bras�lia -> Barcelona
    'PMW-MAD': 3800, // Palmas -> Madri (com conex�o em BSB/GRU)
    'PMW-BCN': 4000  // Palmas -> Barcelona (com conex�o em BSB/GRU)
  };

  const routeKey = `${origin.toUpperCase()}-${destination.toUpperCase()}`;
  const basePrice = basePrices[routeKey] || 3600;

  // Oscila��o de mercado (-600 a +400) para testar promo��es e quedas
  const variation = (Math.random() * 1000 - 600);
  const currentPrice = Math.max(2200, Math.round(basePrice + variation));

  const airlines = ['TAP Air Portugal', 'LATAM + Iberia', 'Air Europa', 'GOL + Air France/KLM'];
  const airline = airlines[Math.floor(Math.random() * airlines.length)];

  return {
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departureDate: departureDate || 'Qualquer data (Melhor tarifa)',
    price: currentPrice,
    airline: airline,
    currency: 'BRL',
    checkedAt: new Date().toISOString()
  };
}

module.exports = { searchFlightPrice };
