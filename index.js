const Koa = require("koa");
const views = require("koa-views");
const serve = require("koa-static");
const router = require("koa-router")();
const path = require("path");
const telegram = require("./src/report-telegram");
let { readJson, writeJson } = require("./src/tool.js");
const configFile = path.resolve(__dirname, "./src/config.json");
const monitor = require("./src/monitor");

const app = new Koa();

app.use(serve(__dirname + "/src/static"));
app.use(serve(__dirname + "/src/views/static"));

app.use(
  views(path.join(__dirname, "./src/views"), {
    map: {
      html: "ejs",
    },
  })
);

router.get("/", async (ctx) => {
  await ctx.render("index");
});

// 获取域名列表
router.get("/list", async (ctx) => {
  const list = readJson(configFile);
  ctx.body = list;
});

// 添加域名
router.get("/add", async (ctx) => {
  let query = ctx.request.query;
  const list = readJson(configFile);

  list.push({
    url: query.url,
  });
  writeJson(configFile, list);
  ctx.body = {
    code: 0,
  };
});

// 删除域名
router.get("/delete", async (ctx) => {
  let query = ctx.request.query;
  const list = readJson(configFile);

  let index = list.findIndex((ele) => ele.url == query.url);

  if (index !== -1) {
    list.splice(index, 1);
  }

  writeJson(configFile, list);
  ctx.body = {
    code: 0,
  };
});

// 检测域名
router.get("/test", async (ctx) => {
  let query = ctx.request.query;
  let result = await monitor(query.url);

  if (result.status == 0) {
    await telegram(result);
  }

  const list = readJson(configFile);
  let index = list.findIndex((ele) => ele.url == result.url);

  if (index !== -1) {
    list[index] = {
      ...result,
    };
  }

  writeJson(configFile, list);
  ctx.body = result;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, () => {
  console.log(`listening at http://localhost:8080`);
});
