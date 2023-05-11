import botConfig from "../src/getenv.js";
import {Telegraf} from "telegraf";

const api_key = botConfig.tg.tg_api_key;
const bot = new Telegraf(api_key);

export default bot;
