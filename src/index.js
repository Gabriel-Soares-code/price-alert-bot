// src/index.js
require('dotenv').config();
const express = require('express');
const { addFlightAlert, readAlerts } = require('./db');
const { checkFlightAlerts, startScheduler } = require('./scheduler');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'Bot de alertas de passagens está rodando 🚀',
    totalAlerts: readAlerts().length
  });
});

// Rota para disparar a checagem manual a qualquer momento
app.get('/checar-agora', async (req, res) => {
  await checkFlightAlerts();
  res.json({ ok: true, message: 'Verificação executada com sucesso!' });
});

// Rota para cadastrar um novo alerta de passagem
app.post('/alertas/voo', (req, res) => {
  const { origin, destination, departureDate, maxPrice } = req.body;

  if (!origin || !destination || !departureDate || !maxPrice) {
    return res.status(400).json({
      ok: false,
      error: 'Campos obrigatórios: origin, destination, departureDate, maxPrice'
    });
  }

  const novoAlerta = addFlightAlert({ origin, destination, departureDate, maxPrice });
  res.json({ ok: true, alerta: novoAlerta });
});

// Liga o servidor e inicia o agendador automático
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  // Inicia o scheduler automático a cada 30 minutos
  startScheduler(30);
});
