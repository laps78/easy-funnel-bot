import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
import Telebot from "telebot";
import messages from "./src/messages.js";

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

const botShedule = (msg) => {
  console.log(msg);
  const timeout = setTimeout(() => {
    msg.reply.text(`next step!`);
  }, 1 * 60 * 1000);
  messages.map((message, index) => {
    if (index < 0) {
      setTimeout((msg) => {
        // Тут формируется очередное сообщение
        msg.reply.tex(message.text);
      }, 1000 * 60 * 5 * index);
    }
  });
};

const shedule = () => {};
console.log(botConfig);

// make bot
const api_key = botConfig.tg.tg_api_key;
const bot = new Telebot(api_key);

bot.on("/start", (msg) => {
  msg.reply.text(`Привет, ${msg.from.first_name}! 🌹\n\n${messages[0]}`);
  botShedule(msg);
});

bot.on("text", (msg) => {
  botOnStart(msg);
  msg.reply.text("Процесс погружения активирован...");
});

bot.start();

export default botConfig;
