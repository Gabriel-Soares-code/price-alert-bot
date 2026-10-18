// src/scheduler.js
const { readAlerts, updateAlertPrice } = require('./db');
const { searchFlightPrice } = require('./services/flights');
const { sendMessage } = require('./services/notifier');

async function checkFlightAlerts() {
  console.log('🔍 [Scheduler] Verificando voos para a Espanha...');
  const alerts = readAlerts().filter(a => a.type === 'flight' && a.active);

  if (alerts.length === 0) {
    console.log('Nenhum alerta ativo.');
    return;
  }

  for (const alert of alerts) {
    try {
      const flightInfo = await searchFlightPrice(
        alert.origin,
        alert.destination,
        alert.departureDate
      );

      console.log(`Rota ${alert.origin} -> ${alert.destination}: R$ ${flightInfo.price} (Meta: R$ ${alert.maxPrice})`);

      if (flightInfo.price <= alert.maxPrice) {
        if (alert.lastPrice !== flightInfo.price) {
          const discount = alert.maxPrice - flightInfo.price;
          const discountPercent = Math.round((discount / alert.maxPrice) * 100);

          const gOrigin = encodeURIComponent(alert.origin);
          const gDest = encodeURIComponent(alert.destination);
          const googleFlightsUrl = 'https://' + 'www.google.com' + '/travel/flights?q=Flights%20to%20' + gDest + '%20from%20' + gOrigin;
          const skyscannerUrl = 'https://' + 'www.skyscanner.com.br' + '/transporte/passagens-aereas/' + alert.origin.toLowerCase() + '/' + alert.destination.toLowerCase() + '/';

          const horaAgora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

          const msg = [
            '✈️ <b>OFERTA ENCONTRADA: ESPANHA!</b> 🇪🇸',
            '━━━━━━━━━━━━━━━━━━━━',
            `📍 <b>Rota:</b> <code>${flightInfo.origin}</code> ➔ <code>${flightInfo.destination}</code>`,
            `📅 <b>Data:</b> ${flightInfo.departureDate}`,
            `🏢 <b>Cia Aérea:</b> ${flightInfo.airline}`,
            `💰 <b>Preço Atual:</b> <b>R$ ${flightInfo.price.toLocaleString('pt-BR')}</b>`,
            `🎯 <b>Sua Meta:</b> R$ ${alert.maxPrice.toLocaleString('pt-BR')}`,
            `📉 <b>Economia:</b> R$ ${discount.toLocaleString('pt-BR')} (${discountPercent}% de desconto)`,
            `🕒 <b>Atualizado às:</b> ${horaAgora}`,
            '━━━━━━━━━━━━━━━━━━━━',
            '👇 <b>Toque nos botões abaixo para ver as opções:</b>'
          ].join('\n');

          const inlineKeyboard = {
            inline_keyboard: [
              [
                { text: '🔍 Abrir Google Flights', url: googleFlightsUrl },
                { text: '✈️ Abrir Skyscanner', url: skyscannerUrl }
              ]
            ]
          };

          await sendMessage(msg, inlineKeyboard);
          console.log(`✅ Alerta com botões enviado: ${alert.origin}-${alert.destination}!`);
        }
      }

      updateAlertPrice(alert.id, flightInfo.price);
    } catch (err) {
      console.error(`Erro no alerta ${alert.id}:`, err.message);
    }
  }
}

function startScheduler(intervalMinutes = 30) {
  checkFlightAlerts();
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(checkFlightAlerts, intervalMs);
  console.log(`⏱️ Agendador ativo! Checando a cada ${intervalMinutes} minutos.`);
}

module.exports = { checkFlightAlerts, startScheduler };
