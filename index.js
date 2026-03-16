const app = require('./app.js');

// 阿里云 FC HTTP 触发器入口
exports.handler = (req, res, context) => {
  // 适配 FC 的请求格式到 Express
  app(req, res);
};
