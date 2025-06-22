
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const token = '8121608942:AAE2pmnJnPNw2KNhiDYnie78EfMfNRWujj8';
const bot = new TelegramBot(token, { polling: true });

let forcedChannels = ['@smscobnm'];
const adminId = 6226492176;

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const notJoined = [];

  for (const channel of forcedChannels) {
    try {
      const member = await bot.getChatMember(channel, userId);
      if (['left', 'kicked'].includes(member.status)) {
        notJoined.push(channel);
      }
    } catch (error) {
      notJoined.push(channel);
    }
  }

  if (notJoined.length > 0) {
    const channelsList = notJoined.map(c => `🔹 ${
      c
    }`).join('\n');
    return bot.sendMessage(chatId, `📛 يجب الاشتراك في القنوات التالية أولاً:\n${channelsList}`);
  }

  const welcome = `
👋 مرحبًا بك في بوت الأرقام الوهمية!
اضغط على /get للحصول على رقم مؤقت 🔢
البوت يدعم أكثر من مصدر أرقام، منها أرقام عربية 🇸🇦🇪🇬
`;
  bot.sendMessage(chatId, welcome);
});

bot.onText(/\/get/, async (msg) => {
  const chatId = msg.chat.id;

  const sources = [
    {
      name: "temporary-phone-number.com",
      number: "+447537150994"
    },
    {
      name: "receive-smss.com",
      number: "+13322978052"
    },
    {
      name: "smsreceivefree.com",
      number: "+447723598988"
    }
  ];

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    try {
      await bot.sendMessage(chatId, `📡 المصدر: ${source.name}\n📱 الرقم: ${source.number}`);
      return;
    } catch (error) {
      console.error(`❌ فشل في المصدر: ${source.name}`);
    }
  }

  bot.sendMessage(chatId, "❌ لا توجد أرقام متاحة حاليًا. حاول لاحقًا.");
});

bot.onText(/\/setchannels (.+)/, (msg, match) => {
  if (msg.from.id != adminId) return;

  const newChannels = match[1].split(' ').filter(c => c.startsWith('@'));
  forcedChannels = newChannels;
  bot.sendMessage(msg.chat.id, "✅ تم تحديث قنوات الاشتراك الإجباري إلى:\n" + newChannels.join('\n'));
});
