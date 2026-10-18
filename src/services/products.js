const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function sendMessage(text) {
  const url = "[api.telegram.org](https://api.telegram.org/bot)" + token + "/sendMessage";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description || "Erro no Telegram");
  }
  return data;
}

module.exports = { sendMessage };
