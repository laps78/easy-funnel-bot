import nodemailer from "nodemailer";
import { botCredentials } from "../../index";

const emailAccount = await nodemailer.createTestAccount();

export default transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: botCredentials.email.username,
    pass: botCredentials.email.passwd,
  },
});

let result = await transporter.sendMail({
  from: '"Node js" <nodejs@example.com>',
  to: "user@example.com, user@example.com",
  subject: "Message from Node js",
  text: "This message was sent from Node js server.",
  html: "This <i>message</i> was sent from <strong>Node js</strong> server.",
});

console.log(result);

// второй пример - отправка письма с файлами

await transporter.sendMail({
  from: '"Node js" <nodejs@example.com>',
  to: "user@example.com, user@example.com",
  subject: "Attachments",
  text: "This message with attachments.",
  html: "This <i>message</i> with <strong>attachments</strong>.",
  attachments: [
    {
      filename: "greetings.txt",
      path: "/assets/files/",
    },
    {
      filename: "greetings.txt",
      content: "Message from file.",
    },
    {
      path: "data:text/plain;base64,QmFzZTY0IG1lc3NhZ2U=",
    },
    {
      raw: `
        Content-Type: text/plain
        Content-Disposition: attachment;

        Message from file.
      `,
    },
  ],
});
