
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');

const TOKEN = '8121608942:AAE2pmnJnPNw2KNhiDYnie78EfMfNRWujj8';
const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();
const PORT = process.env.PORT || 3000;

// إدخال معرف الأدمن
const ADMIN_ID = 7690150728;

// رسائل الترحيب
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const isAdmin = msg.from.id === ADMIN_ID;

  let buttons = {
    reply_markup: {
      inline_keyboard: [
        [{
          text: "📥 جلب رقم",
          callback_data: "get_number"
        }],
        ...(isAdmin ? [[{ text: "🔐 إدارة الاشتراك", callback_data: "manage_subscription" }]] : [])
      ]
    }
  };

  bot.sendMessage(chatId, "👋 مرحبًا بك في بوت صيد الأرقام المؤقتة!", buttons);
});

// الأحداث التفاعلية
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "get_number") {
    try {
      const res = await axios.get("https://ar.temporary-phone-number.com/api/v1/number?country=all");
      if (res.data && res.data.numbers && res.data.numbers.length > 0) {
        const number = res.data.numbers[0];
        const message = `📱 الرقم: ${number.number}\n🌍 الدولة: ${number.country}\n🔗 رابط الصفحة: ${number.url}`;
        bot.sendMessage(chatId, message);
      } else {
        bot.sendMessage(chatId, "❌ لا توجد أرقام متاحة الآن.");
      }
    } catch (err) {
      bot.sendMessage(chatId, "🚫 خطأ في جلب الرقم.");
      console.error("جلب الرقم فشل:", err.message);
    }
  }

  if (data === "manage_subscription" && query.from.id === ADMIN_ID) {
    bot.sendMessage(chatId, "🛠 لوحة الإدارة قيد التطوير.");
  }
});

// تشغيل خادم Express
app.get("/", (req, res) => {
  res.send("🤖 البوت يعمل!");
});

app.listen(PORT, () => {
  console.log(`🚀 Bot server running on port ${PORT}`);
});
