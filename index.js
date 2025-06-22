
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const express = require('express');
const app = express();

const TOKEN = '8121608942:AAE2pmnJnPNw2KNhiDYnie78EfMfNRWujj8';
const CHANNEL = '@smscobnm';

const bot = new Telegraf(TOKEN);

let currentNumber = null;
let currentCountry = 'us';

async function fetchNumber() {
  try {
    const res = await axios.get('https://ar.temporary-phone-number.com/countries');
    const countries = res.data;
    const country = countries.find(c => c.code === currentCountry);
    if (!country) return null;

    const phones = await axios.get(`https://ar.temporary-phone-number.com/api/v1/country/${country.code}`);
    const numbers = phones.data.numbers;
    if (numbers.length === 0) return null;

    return {
      number: numbers[0].number,
      id: numbers[0].id,
      country: country.name
    };
  } catch (e) {
    console.error('Fetch error:', e.message);
    return null;
  }
}

async function fetchMessages(id) {
  try {
    const res = await axios.get(`https://ar.temporary-phone-number.com/api/v1/messages/${id}`);
    return res.data;
  } catch (e) {
    return [];
  }
}

// /start
bot.start(async (ctx) => {
  const user = ctx.from.first_name;
  ctx.reply(`👋 أهلاً ${user}!
اضغط على الزر لجلب رقم وهمي.`, Markup.inlineKeyboard([
    [Markup.button.callback('📱 احصل على رقم وهمي', 'get_number')]
  ]));
});

// زر: احصل على رقم وهمي
bot.action('get_number', async (ctx) => {
  await ctx.answerCbQuery();
  const data = await fetchNumber();
  if (!data) return ctx.reply('❌ لا يوجد أرقام الآن.');

  currentNumber = data;
  ctx.reply(`✅ رقم جديد من ${data.country}:

📞 ${data.number}`, Markup.inlineKeyboard([
    [Markup.button.callback('📩 تحديث الرسائل', 'refresh')],
    [Markup.button.callback('♻️ تغيير الرقم', 'get_number')]
  ]));

  // أرسل إلى القناة
  bot.telegram.sendMessage(CHANNEL, `📥 تم جلب رقم جديد:

${data.number} (${data.country})`);
});

// زر: تحديث الرسائل
bot.action('refresh', async (ctx) => {
  await ctx.answerCbQuery();
  if (!currentNumber) return ctx.reply('❗ لم يتم تحديد رقم بعد.');
  const msgs = await fetchMessages(currentNumber.id);
  if (!msgs || msgs.length === 0) return ctx.reply('📭 لا توجد رسائل بعد.');

  let text = `📨 الرسائل على ${currentNumber.number}:

`;
  msgs.forEach((m, i) => {
    text += `#${i + 1} - من: ${m.from}
💬 ${m.text}

`;
  });
  ctx.reply(text);
});

// إعداد webhook
app.use(bot.webhookCallback(`/bot${TOKEN}`));
bot.telegram.setWebhook(`https://stemporary-number-bot.onrender.com/bot${TOKEN}`);

app.get('/', (req, res) => res.send('✅ البوت شغّال!'));
app.listen(3000, () => console.log('🚀 BOT SERVER READY'));
