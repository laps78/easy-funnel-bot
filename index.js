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
console.log("messages parse:");
console.log("messages type: ", typeof messages);
//console.log("messages:", messages);
console.log("messages data: ", messages[0].name);

// start handler
bot.on("/start", (msg) => {
  global = msg;
  //botShedule(msg.from.id, msg);
  bot.sendPhoto(msg.from.id, messages[0].image_links[0]);
  bot.sendPhoto(msg.from.id, messages[0].image_links[1]);
  msg.reply.text(`Привет, ${msg.from.first_name}! 🌹\n\n${messages[0].text}`);
  msg.reply.text("====================");
});

bot.start();

export default botConfig;

const sheduleFunelMessages = (messages) => {};
