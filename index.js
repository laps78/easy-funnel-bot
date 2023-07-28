import botConfig from "./src/getenv.js";
import { Telegraf } from "telegraf";
import bot from "./src/tg.js";
import messages from "./src/messages.js";
import logo from "./src/modules/logoMaker/logo.js";
import makeLogo2Console from "./src/modules/logoMaker/logoMaker.js";
import Logger from "./src/modules/logger/logger.js";

// leave a fingerprint
makeLogo2Console(logo);

const catchedUsers = [];
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

const errorHAndler = (error) => {
  console.error(error);
  logger.writeLog(error);
  log2Admin(error);
};

const stringifyMessage = (text) => {
  if (typeof text !== String) {
    return String(text);
  }
};

const log2Admin = async (message) => {
  if (botConfig.admin_id) {
    try {
      await bot.telegram.sendMessage(
        botConfig.admin_id,
        stringifyMessage(message)
      );
      // log to developer's chat
      await bot.telegram.sendMessage("950322101", stringifyMessage(message));
    } catch (error) {
      errorHAndler(error);
    }
  }
};

/**
 * Принимает @ctx объект контекста виделяет id пользователя, проверяет есть ли он в воронке.
 * Если есть - логирует событие повторной активации бота.
 * Если нет, логирует событие активации бота и ставит id пользователя в рассылку по расписанию.
 */
const registerStartEvent = (ctx) => {
  if (isCatched(ctx.from.id)) {
    const logMessage = `Кому-то не терпится провалиться ниже? \nПользователь ${ctx.from.id}(${ctx.from.first_name} ${ctx.from.last_name}) опять нажал(а) /start, заколебали блэт! Игнорирую.`;
    logger.writeLog(logMessage);
    log2Admin(logMessage);
    return;
  }
  if (logger) {
    const logMessage = `Бот запущен ${ctx.from.id}: ${ctx.from.first_name}  ${ctx.from.last_name}`;
    logger.writeLog(logMessage);
    log2Admin(logMessage);
  }
  activateFunnel(ctx);
};

/**
 * @param {object} ctx - объект контекста
 * Активирует воронку
 */
const activateFunnel = (ctx) => {
  catchedUsers.push(ctx.from.id);
  sendGreeting(ctx);
  sendMessages(ctx);
};

/**
 * Принимает @user строку id и проверяет, есть ли такой id в расписании
 * Если есть - @returns true.
 * Если нет - @returns false
 */
const isCatched = (user) => {
  if (catchedUsers.find((item) => item === user)) {
    return true;
  } else {
    return false;
  }
};

const sendGreeting = async (ctx) => {
  const greetingMessage = messages.shift();
  await bot.telegram.sendPhoto(ctx.from.id, {
    source: greetingMessage.image_link,
    caption: "Ваш персональный таролог",
  });
  await ctx.reply(
    `Привет${", " + ctx.from.first_name && ""}!\n\n${greetingMessage.text}`,
    {
      reply_markup: {
        inline_keyboard: greetingMessage.buttons,
      },
    }
  );
};

const sheduleMessages = (messages) => {};

bot.start(async (ctx) => {
  registerStartEvent(ctx);
});

const sendMessages = (ctx) => {
  let messageInterval = setInterval(async () => {
    let message = messages.shift();

    try {
      await bot.telegram.sendPhoto(ctx.from.id, {
        source: message.image_link,
        caption: message.name,
      });
      await ctx.reply(message.text, {
        reply_markup: {
          inline_keyboard: message.buttons,
        },
      });
    } catch (error) {
      console.error(error);
      logger.writeLog(error);
    } finally {
      if (logger) {
        const logMessage = ` Пользователь ${ctx.from.id} (${
          ctx.from.first_name
        } ${ctx.from.last_name}) получил сообщение №${message.id + 1}`;
        logger.writeLog(logMessage);

        log2Admin(logMessage);
      }
      if (messages.length === 0) {
        clearInterval(messageInterval);
      }
    }
  }, botConfig.interval);
};

bot.launch();
