//import nodemailer from "nodemailer";
import botConfig from "./src/getenv.js";
import Telebot from "telebot";
import messages from "./src/messages.js";

// make bot
const api_key = botConfig.tg.tg_api_key;
const bot = new Telebot(api_key);

// проверяем messages
//console.log("messages parse:");
//console.log("messages type: ", typeof messages);
//console.log("messages:", messages);
//console.log("messages data: ", messages[0].name);

// start handler
bot.on("/start", (msg) => {
  const user = { id: msg.from.id, name: msg.from.first_name };
  sendGreeting(user);
});

bot.start();

export default botConfig;

const sheduleDays = (user) => {
  setTimeout(sendFirstDayMessage(user), 3000);
};

const sendGreeting = (user) => {
  console.log("greeting: ", user);
  bot.sendPhoto(user.id, messages[0].image_links[0]);

  setTimeout(() => {
    bot.sendMessage(user.id, `Привет, ${user.name}!\n\n${messages[0].text}`);
    bot.keyboard([[{ text: "go to channel" }], [{ text: "button2" }]]);
  }, 1000);

  setTimeout(() => {
    bot.sendPhoto(user.id, messages[0].image_links[1]);
  }, 2000);
};

const sendFirstDayMessage = (user) => {
  console.log("1st day: ", user);
  bot.sendPhoto(user.id, messages[1].image_links[0]);
  bot.sendMessage(user.id, messages[1].text);
};

const senndSecondDayMessage = (user) => {
  console.log("2nd day: ", user);
  bot.sendPhoto(user.id, messages[2].image_links[0]);
  bot.sendMessage(user.id, messages[2].text);
};

const senndThirddDayMessage = (user) => {
  console.log("3d day: ", user);
  bot.sendPhoto(user.id, messages[3].image_links[0]);
  bot.sendMessage(user.id, messages[3].text);
};

const senndFourthDayMessage = (user) => {
  console.log("4 day: ", user);
  bot.sendPhoto(user.id, messages[4].image_links[0]);
  bot.sendMessage(user.id, messages[4].text);
};

const senndFifthDayMessage = (user) => {
  console.log("5 day: ", user);
  bot.sendPhoto(user.id, messages[5].image_links[0]);
  bot.sendMessage(user.id, messages[5].text);
};
