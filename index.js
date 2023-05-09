import * as dotenv from "dotenv";
//import nodemailer from "nodemailer";
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

// make bot
const api_key = botConfig.tg.tg_api_key;
const bot = new Telebot(api_key);
let global = null;

// проверяем messages
//console.log("messages parse:");
//console.log("messages type: ", typeof messages);
//console.log("messages:", messages);
//console.log("messages data: ", messages[0].name);

// start handler
bot.on("/start", (msg) => {
  const userId = msg.from.id;
  bot.sendPhoto(userId, messages[0].image_links[0]);

  setTimeout(() => {
    bot.sendMessage(userId, messages[0].text);
  }, 1000);

  setTimeout(() => {
    bot.sendPhoto(userId, messages[0].image_links[1]);
  }, 2000);

  setTimeout(() => {
    try {
      bot.sendPhoto(userId, messages[1].image_links[0]);
      bot.sendMessage(userId, messages[1].text);
    } catch (err) {
      console.log(err);
    } finally {
      console.log("finally");
    }
  }, 5000);
});

bot.start();

export default botConfig;
