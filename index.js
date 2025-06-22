const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

const TOKEN = '6751268476:AAGWYevpAq0ILKWdFxHtgU6-TeCH_4xC6d0';
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "مرحبًا بك في بوت الأرقام الوهمية! استخدم /get للحصول على رقم.");
});

bot.onText(/\/get/, async (msg) => {
    try {
        const response = await axios.get("https://temporary-phone-number.com", {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html",
                "Referer": "https://google.com"
            }
        });
        bot.sendMessage(msg.chat.id, "تم الجلب بنجاح (مثال).");
    } catch (error) {
        bot.sendMessage(msg.chat.id, "❌ فشل الجلب: " + error.message);
    }
});

app.get("/", (req, res) => {
    res.send("البوت يعمل ✅");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
