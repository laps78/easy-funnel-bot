import botConfig from "./src/getenv.js";
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

/**
 * 
 * @returns текущее время в UNIX формате
 */
const getCurrentTime = () => {
  const now = new Date();
  return now.getTime();
}
//TODO проверь, надо ли умножать на index?
const newSheduler = (ctx) => {
  let currentTime = getCurrentTime();
  const splicedMessages = messages;
  splicedMessages.splice(0, 1);
  splicedMessages.forEach((message, index) => {
    preSheduledTime = currentTime + botConfig.interval * (index + 1);
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
  sheduledMessagesArray.forEach((task, index) => {
    if (task.sheduledTime <= getCurrentTime()) {
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

// TMP code ACTIVATE LOST & FOUND FUNNEL USERS
const foundIds = {
  '28.07.2023': [
    2100265554,
    6235801357,
    590023980,
    631825284,
    908945479,
    742088366,
    742088366,
    957108504,
    6275929737,
    5252340652,
    1267394163,
    509109910,
    1420347757,
    6253120879,
    1516199449,
    5951580960,
    6294705589,
    6012771382,
    1159813220,
    5228605278,
    1790179766,
    6207197414,
    6064425696,
    1055918952,
    5155378615,
    5141490553,
    1176255261,
    872692878,
  ],
  '30.07.2023': [
    5427005061
  ]
};

const sheduleFound = () => {
  try {
    if (foundIds) {
      // убираем приветствие
      const splicedMessages = messages
      splicedMessages.splice(0, 1);
  
      for (let [key, value] of Object.entries(foundIds)) {
        // dtae formater for this sheduler
        const makeStartTime = (dateString) => {
          const timedDateString = dateString + '.10.00';
          const [day, month, year, hour, minute] = timedDateString.split('.');
          return new Date(year, month - 1, day, hour, minute);
        }
        //console.log('Обработаем предуыдущие вступления от', key);
        const startTime = makeStartTime(key);
        // run throw array of ids
        foundIds[key].map(id => {
          //console.log('обрабатываем id:', id, `, который попал в воронку ${key}.`)
          // определим какое количество интервалов бота ID находится в воронке
          const intervalsInFunnel = Math.round((getCurrentTime() - startTime) / botConfig.interval);
          //console.log(`этот ${id} крутится ${intervalsInFunnel} интервалов`)       
  
          // необходимо запланировать сообщения №№...
          let sheduleMessagesFromIndex = null;
          if (intervalsInFunnel === 0) {
            const sheduleMessagesFromIndex = 0//отправлять сообщшения начиная с...
          }
          if (intervalsInFunnel > 0) {
            const sheduleMessagesFromIndex = intervalsInFunnel - 1;
            //console.log(`shedule from ${sheduleMessagesFromIndex}`)
          }
          // и оставшиеся закидываем в очередь
          splicedMessages.forEach((message, index) => {
            if (index >= intervalsInFunnel) {
              sheduledMessagesArray.push(
                {
                  id: id,
                  first_name: 'не поддерживается',
                  last_name: 'не поддерживается',
                  index: index,
                  message: message,
                  sheduledTime: new Date(startTime.getTime() + (botConfig.interval * index)),
                }
              );
              // console.log(`pushing ${index}`)
              // console.log(`sheduledTime: ${new Date(startTime.getTime() + (botConfig.interval * index))}`);
            }
          });
        })
      }
    }
    //console.log(sheduledMessagesArray);
  } catch (error) {
    console.log(error, error.statusText);
  }
  
}

sheduleFound();
