import botConfig from "./src/getenv.js";
import foundIds from "./src/modules/lost & found/foundids.js";
import { Telegraf } from "telegraf";
import bot from "./src/tg.js";
import messages from "./src/messages.js";
import logo from "./src/modules/logoMaker/logo.js";
import makeLogo2Console from "./src/modules/logoMaker/logoMaker.js";
import Logger from "./src/modules/logger/logger.js";

// leave a fingerprint
makeLogo2Console(logo);

const catchedUsers = [];
const sheduledMessagesArray = [];
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

bot.start(async (ctx) => {
  registerStartEvent(ctx);
});

/**
 * Принимает @ctx объект контекста виделяет id пользователя, проверяет есть ли он в воронке.
 * Если есть - логирует событие повторной активации бота.
 * Если нет, логирует событие активации бота и ставит id пользователя в рассылку по расписанию.
 */
const registerStartEvent = (ctx) => {
  if (isCatched(ctx.from.id)) {
    const logMessage = `Кому-то не терпится провалиться ниже? \nПользователь ${ctx.from.id}(${ctx.from.first_name} ${ctx.from.last_name}) опять нажал(а) [start]!\nZаколебали блэт!\nИгнорирую.`;
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
 * Принимает @param {string} user строку id и проверяет, есть ли такой id в расписании
 * Если есть - @returns true.
 * Если нет - @returns false
 */
const isCatched = (user) => {
  if (catchedUsers.find((item) => item.user_id === user)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @param {object} ctx - объект контекста
 * Активирует воронку
 */
const activateFunnel = (ctx) => {
  sendGreeting(ctx);
  catchedUsers.push({
    user_id: ctx.from.id,
  });
  newSheduler(ctx);
};

/**
 * Оптравляет приветствие
 * @param {object} ctx - объект контекста
 *
 */
const sendGreeting = async (ctx) => {
  const greetingMessage = messages[0];
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

// TODO недописан переводчи...
const parseTasksFromMessage = (msg) => {
  const lines = String(msg).split('\n');
  for (let line in lines) {
    const lineElements = line.split(' ');
  }
}

const queue2list = (queue) => {
  let count = 0;
  let list = ``;
  queue.sort((a, b) => a.sheduledTime - b.sheduledTime);
  queue.forEach((message) => {
    ++count;
    list = `${list}${count}. ${message.first_name} ${
      message.last_name
    } сообщение №${message.index + 1}: ${logger.timeStamp(
      new Date(+message.sheduledTime)
    )}\n`;
  });
  return list;
};
  
// Admin commands
// show queue
bot.hears("Покажи очередь!", (ctx) => {
  if (
    ctx.from.id == botConfig.developer_id ||
    ctx.from.id == botConfig.admin_id
  ) {
    
    if (sheduledMessagesArray.length === 0) {
      ctx.reply("Очередь рассылки пуста.");
    } else {
      ctx.reply(`В очереди на рассылку:\n${queue2list(sheduledMessagesArray)}`);
    }
  }
});

const newSheduler = (ctx) => {
  const now = new Date();
  let preSheduledTime = now.getTime();
  const  splicedMessages = messages;
  splicedMessages.splice(0, 1);
  splicedMessages.forEach((message, index) => {
    preSheduledTime = preSheduledTime + botConfig.interval;
    sheduledMessagesArray.push({
      id: ctx.from.id,
      first_name: ctx.from.first_name,
      last_name: ctx.from.last_name,
      index,
      message,
      sheduledTime: preSheduledTime,
    });
  });
};

const taskChecker = async () => {
  const now = new Date();
  sheduledMessagesArray.forEach((task, index) => {
    if (task.sheduledTime <= now.getTime()) {
      sendMessage(
        task.id,
        task.message,
        task.first_name,
        task.last_name,
        task.index
      );
      sheduledMessagesArray.splice(index, 1);
    }
  });
};

const sendMessage = async (id, message, first_name, last_name, index) => {
  try {
    await bot.telegram.sendPhoto(id, {
      source: message.image_link,
      caption: message.name,
    });
    await bot.telegram.sendMessage(id, message.text, {
      reply_markup: {
        inline_keyboard: message.buttons,
      },
    });
  } catch (error) {
    console.error(error);
    logger.writeLog(error);
  } finally {
    if (logger) {
      const logMessage = ` Пользователь ${id} (${first_name} ${last_name}) получил сообщение №${
        index + 1
      }`;
      logger.writeLog(logMessage);
      log2Admin(logMessage);
    }
  }
};


bot.launch();

// Заводим проверку очереди сообщений для отправки
const interval = setInterval(taskChecker, botConfig.interval_to_check_tasks);


// // TMP code
// if (foundIds) {
//   const today2send = foundIds['28.07.2023'];
//   console.log(today2send)
//   today2send.forEach(id => sendMessage(id, messages[1], 'no name', 'noname', 1,));
// }