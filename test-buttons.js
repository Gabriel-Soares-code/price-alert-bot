require('dotenv').config();
const { sendMessage } = require('./src/services/notifier');

async function run() {
  const googleFlightsUrl = 'https://' + 'www.google.com' + '/travel/flights';
  const skyscannerUrl = 'https://' + 'www.skyscanner.com.br';

  const msg = [
    '✈️ <b>OFERTA ENCONTRADA: ESPANHA!</b> 🇪🇸',
    '━━━━━━━━━━━━━━━━━━━━',
    '📍 <b>Rota:</b> <code>PMW</code> ➔ <code>MAD</code>',
    '📅 <b>Data:</b> Qualquer data',
    '🏢 <b>Cia Aérea:</b> Iberia / LATAM',
    '💰 <b>Preço Atual:</b> <b>R$ 3.250</b>',
    '🎯 <b>Sua Meta:</b> R$ 3.800',
    '📉 <b>Economia:</b> R$ 550 (14% de desconto)',
    '━━━━━━━━━━━━━━━━━━━━',
    '👇 <b>Toque nos botões abaixo para ver as opções:</b>'
  ].join('\n');

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🔍 Abrir Google Flights', url: googleFlightsUrl },
        { text: '✈️ Abrir Skyscanner', url: skyscannerUrl }
      ]
    ]
  };

  await sendMessage(msg, keyboard);
  console.log('TESTE_BOTOES_ENVIADO_COM_SUCESSO');
}

run().catch(err => console.error('ERRO:', err.message));
