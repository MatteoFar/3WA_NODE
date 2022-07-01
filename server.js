const http = require("http");
const pug = require("pug");
require("dotenv").config();

const render = require("./utils/renderPage");

const { RenderPage } = render;

const { APP_LOCALHOST, APP_PORT } = process.env;

const server = http.createServer((req, res) => {
  const url = req.url.replace("/", "");
  console.log(req.method);

  switch (url) {
    case "":
      RenderPage("view/home.pug", res, 200, req);
      break;
    case "users":
      RenderPage("view/studentList.pug", res, 200, req);
      break;
    default:
      RenderPage("view/404.pug", res, 404);
      break;
  }
});

server.listen(APP_PORT, APP_LOCALHOST, () => {
  console.log(`Server running at http://${APP_LOCALHOST}:${APP_PORT}/`);
});
