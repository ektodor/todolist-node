const http = require("http");
const { v4: uuid } = require("uuid");
const { successHandler, errorHandler } = require("./handler.js");

const todos = [];
const requestListener = (req, res) => {
  let data = "";
  req.on("data", (chuck) => {
    data += chuck;
  });
  if (req.method == "OPTIONS") {
    successHandler(res, "OK");
  } else if (req.method == "GET" && req.url == "/todos") {
    successHandler(res, "取得資料成功", todos);
  } else if (req.method == "POST" && req.url == "/todos") {
    req.on("end", () => {
      try {
        const title = JSON.parse(data).title;
        if (title !== undefined) {
          const todo = {
            id: uuid(),
            title,
          };
          todos.push(todo);
          successHandler(res, "上傳成功", todos);
        } else {
          errorHandler(res, "查無 title");
        }
      } catch (e) {
        errorHandler(res, e.message);
      }
    });
  } else if (req.method == "DELETE" && req.url == "/todos") {
    todos.length = 0;
    successHandler(res, "已全部刪除", todos);
  } else if (req.method == "DELETE" && req.url.startsWith("/todos/")) {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((item) => item.id == id);
    if (index > -1) {
      todos.splice(index, 1);
      successHandler(res, `刪除 ${id}`, todos);
    } else {
      errorHandler(res, "查無此 id");
    }
  } else if (req.method == "PATCH" && req.url.startsWith("/todos/")) {
    req.on("end", () => {
      const id = req.url.split("/").pop();
      const index = todos.findIndex((item) => item.id == id);
      try {
        const title = JSON.parse(data).title;
        if (title !== undefined && index > -1) {
          todos[index].title = title;
          successHandler(res, "更新成功", todos);
        } else {
          errorHandler(res, "查無此 id 或 title");
        }
      } catch (e) {
        errorHandler(res, e.message);
      }
    });
  } else {
    errorHandler(res, "404 NOT FOUND", 404);
  }
};

const server = http.createServer(requestListener);
server.listen(3000);
