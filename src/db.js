const fs = require("fs");
const path = require("path");
const DB_PATH = path.join(__dirname, "../alerts.json");

function readAlerts() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
    return [];
  }
  const data = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(data || "[]");
}

function saveAlerts(alerts) {
  fs.writeFileSync(DB_PATH, JSON.stringify(alerts, null, 2));
}

function addFlightAlert(alert) {
  const alerts = readAlerts();
  const newAlert = {
    id: Date.now().toString(),
    type: "flight",
    origin: alert.origin.toUpperCase(),
    destination: alert.destination.toUpperCase(),
    departureDate: alert.departureDate,
    maxPrice: Number(alert.maxPrice),
    lastPrice: null,
    active: true,
    createdAt: new Date().toISOString()
  };
  alerts.push(newAlert);
  saveAlerts(alerts);
  return newAlert;
}

function updateAlertPrice(id, newPrice) {
  const alerts = readAlerts();
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.lastPrice = newPrice;
    alert.lastCheckedAt = new Date().toISOString();
    saveAlerts(alerts);
  }
}

module.exports = { readAlerts, addFlightAlert, updateAlertPrice };