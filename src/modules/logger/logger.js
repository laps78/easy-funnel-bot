import { appendFile, createReadStream, openSync, closeSync } from "node:fs";
import path from "node:path";

export default class Logger {
  constructor() {
    this.log = [];
    this.interval = null;
    this.logFilePath = "logger.log";
  }
  /***
   * Готовит строку - таймштамп вида ДД.ММ.ГГГГ (ЧЧ:ММ:СС)
   */
  timeStamp = (date) => {
    let moment = null;
    if (date === undefined) {
      moment = new Date();
    } else {
      moment = date;
    }
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
  writeLog = (msg) => {
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

  loadLog() {
    // Открываем файл для чтения
    const reader = createReadStream(this.logFilePath);
    // Закрываем файл
    closeSync(file);
    return reader.pipe(process.stdout);
  }

  /***
   * Асинхронно пишет массив @Logger.log в файл ./modules/logger/activity.log
   ***/
  saveLog = (newData) => {
    // Открываем файл для записи
    const file = openSync(this.logFilePath, "w");
    // Запись строк в файл
    appendFile(file, newData, (error) => {
      console.log("writefile");
      if (error) {
        console.error(error);
      } else {
        console.log(`${this.timeStamp()}: log written to file`);
      }
    });
  };
}
