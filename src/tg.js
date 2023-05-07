import telebot from "telebot";
import botConfig from "../index";
import Telebot from "telebot";

const api_key = botConfig.tg.tg_api_key;
const bot = new Telebot(api_key);

export default bot;
