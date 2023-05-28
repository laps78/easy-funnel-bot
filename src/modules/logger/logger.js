import fs from "fs";

export default class Logger {
  constructor() {
    this.log = [];
    this.interval = null;

    this.sheduleLogToFile();
  }
  /***
   * Готовит строку - таймштамп вида ДД.ММ.ГГГГ (ЧЧ:ММ:СС)
   */
  timeStamp = () => {
    const moment = new Date();
    const dateElements = {
      date: moment.getDate(),
      month: moment.getMonth() + 1,
      year: moment.getFullYear(),
      hours: moment.getHours(),
      minutes: moment.getMinutes(),
      seconds: moment.getSeconds(),
    };

    const formElement = (element) => {
      if (element < 10) {
        return `0${element}`;
      }
      return `${element}`;
    };
    return `${formElement(dateElements.date)}.${formElement(
      dateElements.month
    )}.${dateElements.year} (${formElement(dateElements.hours)}:${formElement(
      dateElements.minutes
    )}:${formElement(dateElements.seconds)})`;
  };

  /***
   * Принимает строку @msg, маркирует таймштампом и пушит в массиа @Logger.log
   * и выводит лог в консоль
   ***/
  writeLog = async (msg) => {
    console.info(`
    ${this.timeStamp()}: ${msg}.
    `);
    this.log.push(
      `
      ${this.timeStamp()}: ${msg}.
      `
    );
    console.info(msg);
  };

  /***
   * Асинхронно пишет массив @Logger.log в файл ./modules/logger/activity.log
   ***/
  saveLog = async () => {
    fs.writeFile("activity.log", data.join("\n"), (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Data written to file");
      }
    });
  };
  /***
   * Планирует интервал автосохранения массива @Logger.log в файл ./modules/logger/activity.log
   ***/
  sheduleLogToFile = () => {
    // log to file every 15 minutes:
    this.interval = setInterval(this.saveLog, 1000 * 60 * 15);
  };
}
