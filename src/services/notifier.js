// src/services/notifier.js
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function sendMessage(text, replyMarkup = null) {
  if (!token || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não definidos no .env');
  }

  const parts = ['https:', '', 'api.telegram.org', 'bot' + token, 'sendMessage'];
  const url = parts.join('/');

  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  };

  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description || 'Erro no Telegram');
  }
  return data;
}

module.exports = { sendMessage };
