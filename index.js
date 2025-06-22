
const { Telegraf } = require('telegraf');
const express = require('express');
const app = express();

const bot = new Telegraf('8121608942:AAE2pmnJnPNw2KNhiDYnie78EfMfNRWujj8');

// رسالة /start
bot.start((ctx) => {
  ctx.reply('✅ أهلاً بك في بوت صيد الأرقام!\nأرسل /help لمعرفة الأوامر.');
});

// رسالة /help
bot.help((ctx) => {
  ctx.reply('/start - بدء البوت\n/help - التعليمات');
});

// بدء البوت مع webhook
app.use(bot.webhookCallback(`/bot${bot.token}`));
bot.telegram.setWebhook(`https://temporary-number-bot.onrender.com/bot${bot.token}`);

// اختبار الصفحة الرئيسية
app.get('/', (req, res) => {
  res.send('✅ البوت يعمل من Render!');
});

app.listen(3000, () => {
  console.log('🚀 Server started on port 3000');
});
