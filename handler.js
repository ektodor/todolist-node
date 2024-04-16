const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-With",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
  "Content-Type": "application/json",
};

const successHandler = (res, message, todos = null) => {
  const data = {
    status: "success",
    message,
  };
  if (todos !== null) data.todos = todos;
  res.writeHead(200, headers);
  res.write(JSON.stringify(data));
  res.end();
};

const errorHandler = (res, message, statusCode = 400) => {
  const data = {
    status: "failed",
    message,
  };
  res.writeHead(statusCode, headers);
  res.write(JSON.stringify(data));
  res.end();
};

module.exports = { successHandler, errorHandler };
