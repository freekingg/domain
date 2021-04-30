const axios = require("axios");
// 发送消息的api
const telegramApi =
  "https://api.telegram.org/bot1454347308:AAGl4wwEQ1M0KJkoxT07guuT6c_WcfCt6Ko/sendMessage";
// 发送消息的机器人群组id
const chatId = "-464472111";
// event为sentry捕获的错误事件对象
const telegram = (event) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: telegramApi,
      data: {
        parse_mode: "HTML",
        chat_id: chatId,
        text: `
              \n\n<b><u> ${event.url} - 域名异常 </u></b>
              \n<b>错误域名: </b><pre>${event.url}</pre>
              \n<b>错误状态: </b><pre>${event.statusCode}</pre>
              \n<b>发生时间: </b><pre>${new Date().toLocaleString()}</pre>
            `,
      },
    })
      .then((result) => {
        resolve();
      })
      .catch((err) => {
        resolve();
      });
  });
};

module.exports = telegram;
