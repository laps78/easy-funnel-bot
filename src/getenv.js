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
};

export default botConfig;
