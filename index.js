import botConfig from "./src/getenv.js";
import { Telegraf } from "telegraf";
import bot from "./src/tg.js";
import messages from "./src/messages.js";
import logo from "./src/modules/logoMaker/logo.js";
import makeLogo2Console from "./src/modules/logoMaker/logoMaker.js";
import Logger from "./src/modules/logger/logger.js";

const log = [];

makeLogo2Console(logo);
let alreadyStarted = [];
const timeIntervalsMS = {
  ms: 1,
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 24 * 1000 * 60 * 60,
};

// make a bot
botConfig.interval = timeIntervalsMS.day;

// INIT MODULES
// init logger
const logger = new Logger();

async function log2Admin(ctx, message) {
  if (botConfig.admin_id) {
    await ctx.telegram.sendMessage(botConfig.admin_id, message);
  }
}

bot.start(async (ctx) => {
  if (alreadyStarted.find((item) => item === ctx.from.id)) {
    const logMessage = `${ctx.from.id()}(${ctx.from.first_name} ${ctx.from.last_name}) опять нажал(а) /start, заколебали блэт!`;
    logger.writeLog(logMessage);
    log2Admin(ctx, logMessage);
    return;
  }
  alreadyStarted.push(ctx.from.id)
  if (logger) {
    const logMessage = `Бот запущен ${ctx.from.id}: ${ctx.from.first_name} ${ctx.from.last_name}`;
    logger.writeLog(logMessage);
    log2Admin(ctx, logMessage);
  }
  const greetingMessage = messages.shift();
  await bot.telegram.sendPhoto(ctx.from.id, {
    source: greetingMessage.image_link,
    caption: "Ваш персональный таролог",
  });
  await ctx.reply(
    `Привет, ${ctx.from.first_name}!\n\n${greetingMessage.text}`,
    {
      reply_markup: {
        inline_keyboard: greetingMessage.buttons,
      },
    }
  );
  sendMessages(ctx);
});

function sendMessages(ctx) {
  let messageInterval = setInterval(async () => {
    let message = messages.shift();
    await bot.telegram.sendPhoto(ctx.from.id, {
      source: message.image_link,
      caption: message.name,
    });
    await ctx.reply(message.text, {
      reply_markup: {
        inline_keyboard: message.buttons,
      },
    });
    if (logger) {
      const logMessage = ` Пользователь ${ctx.from.id} (${
        ctx.from.first_name
      } ${ctx.from.last_name}) получил сообщение №${message.id + 1}`;
      logger.writeLog(logMessage);

      log2Admin(ctx, logMessage)
    }
    if (messages.length === 0) {
      clearInterval(messageInterval);
    }
  }, botConfig.interval);
}

bot.launch();
