import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
import Telebot from "telebot";

// Получаем данные из окружения
dotenv.config();

const botConfig = {
  email: {
    username: process.env.EMAIL_ACCOUNT_NAME,
    passwd: process.env.EMAIL_ACCOUNT_PASSWD,
  },
  tg: {
    tg_api_key: process.env.TG_API_KEY,
  },
};

const botOnStart = (msg) => {
  console.log(msg);
  const timeout = setTimeout(() => {
    msg.reply.text(`next step!`);
    clearTimeout(timeout);
  }, 1 * 60 * 1000);
  // for (let day = 0; day <= 5; day += 1){

  // }
};

const shedule = () => {};
console.log(botConfig);

// make bot
const api_key = botConfig.tg.tg_api_key;
const bot = new Telebot(api_key);

bot.on("/start", (msg) => {
  msg.reply.text(
    `Привет, ${msg.from.first_name}! 🌹\n\nСразу предлагаю подписаться на мой канала, нажав на кнопку ниже👇 Там я публикую общие расклады и много интересной информации.\n\nСледующие несколько дней мы погрузимся в мир Таро.\n\n🎁 Раз в день вы будете получать от меня сообщения, а в них подарок — общий расклад на любовные отношения. Может, какой-то из них даст ответ на ваш вопрос.\n\nИногда я провожу «Ламповые эфиры с картами Таро», где в режиме реального времени делаю общие расклады на популярные темы.\n\nНа этих эфирах вы сможете погрузиться в атмосферу магии карт Таро и выиграть приятные призы.\n\n👉 Обязательно подписывайтесь на мой канал, чтобы не пропускать эфиры.\n\n👉 А тут немного обо мне:\n\nhttps://t.me/taro_laptevoy/8\n\nУже завтра, вам придет первое письмо с  раскладом.\n\nГотовы погрузиться в мир Таро?\n\nСсылка на канал: https://t.me/`
  );
  botOnStart(msg);
});

bot.on("text", (msg) => {
  botOnStart(msg);
  msg.reply.text("Процесс погружения активирован...");
});

bot.start();

export default botConfig;
