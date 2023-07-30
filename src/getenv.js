import * as dotenv from "dotenv";

dotenv.config();

const botConfig = {
  // email: {
  //   username: process.env.EMAIL_ACCOUNT_NAME,
  //   passwd: process.env.EMAIL_ACCOUNT_PASSWD,
  // },
  tg: {
    tg_api_key: process.env.TG_API_KEY,
  },
  admin_id: "1217863849",
  developer_id: "950322101",
  admin_name: "Мария",
  interval_to_check_tasks: 5 * 1000,
  botStart: {
    day: '28',
    month: '07',
    year: '2023',
    hours: '10',
    minutes: '00',
    seconds: '00',
  },
};

export default botConfig;
