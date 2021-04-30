const puppeteer = require("puppeteer");
const path = require("path");
let { timeout, deleteFile } = require("./tool.js");

function monitor(url) {
  return new Promise((resolve, reject) => {
    puppeteer.launch({ headless: true }).then(async (browser) => {
      console.log("puppeteer launch success...");

      deleteFile(path.join(__dirname,'./static'))

      let page = await browser.newPage();
      let time = new Date().getTime();
      let site = url;
      let _status = "";
      let status = 0;
      try {
        console.log("goto the site", url);
        let open = await page.goto(site, { timeout: 20000,waitUntil:'domcontentloaded' });
        await timeout(1000);

        _status = open._status;

        // 页面出错
        if (_status.toString().charAt(0) != "2") {
          status = 0;
        } else {
          status = 1;
        }
      } catch (e) {
        console.log("catch error", e, url);
        status = 0;
      } finally {
        await page.screenshot({
          path: `./src/static/${time}.png`,
          type: "png",
        });

        resolve({
          url: url,
          statusCode: _status,
          status,
          img: `${time}.png`,
          duration: new Date().getTime() - time,
        });
        browser.close();
        console.log("puppeteer end...");
        return;
      }
    });
  });
}

module.exports = monitor;
