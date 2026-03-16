const NeteaseCloudMusicApi = require('NeteaseCloudMusicApi');

// 阿里云 FC HTTP 触发器入口
exports.handler = async (req, res, context) => {
  try {
    // 解析请求路径
    const path = req.queries?.['path'] || req.path?.replace(/^\//, '') || '';
    const query = { ...req.queries };
    delete query['path'];

    // 获取请求体
    let body = {};
    if (req.body) {
      try {
        body = JSON.parse(req.body);
      } catch (e) {
        body = req.body;
      }
    }

    // 调用网易云 API
    const apiName = path.split('?')[0] || path;
    if (!apiName || !NeteaseCloudMusicApi[apiName]) {
      res.setStatusCode(404);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.end(JSON.stringify({ code: 404, msg: 'API not found' }));
      return;
    }

    const result = await NeteaseCloudMusicApi[apiName]({
      ...query,
      ...body,
      cookie: req.headers?.cookie || ''
    });

    // 设置响应头
    res.setStatusCode(200);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end(JSON.stringify(result.body || result));
  } catch (error) {
    console.error('API Error:', error);
    res.setStatusCode(500);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end(JSON.stringify({ code: 500, msg: error.message }));
  }
};
