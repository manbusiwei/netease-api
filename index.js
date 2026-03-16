const NeteaseCloudMusicApi = require('NeteaseCloudMusicApi');

// API 类型映射（旧版格式 → 新版格式）
function convertApiType(type, query) {
  const map = {
    'search': () => ({
      api: 'search',
      params: {
        keywords: query.s || query.keywords,
        limit: query.limit,
        offset: query.offset,
        type: query.search_type
      }
    }),
    'song': () => ({
      api: 'song_url',
      params: {
        id: query.id,
        br: query.br
      }
    }),
    'detail': () => ({
      api: 'song_detail',
      params: {
        ids: query.id
      }
    }),
    'lyric': () => ({
      api: 'lyric',
      params: {
        id: query.id
      }
    }),
    'playlist': () => ({
      api: 'playlist_detail',
      params: {
        id: query.id
      }
    }),
    'album': () => ({
      api: 'album',
      params: {
        id: query.id
      }
    }),
    'artist': () => ({
      api: 'artists',
      params: {
        id: query.id
      }
    }),
    'toplist': () => ({
      api: 'toplist',
      params: {}
    }),
    'toplist/detail': () => ({
      api: 'toplist_detail',
      params: {}
    })
  };

  return map[type] ? map[type]() : { api: type, params: query };
}

// 阿里云 FC HTTP 触发器入口
exports.handler = async (req, res, context) => {
  try {
    // 获取查询参数
    const queries = req.queries || {};
    const type = queries.type;

    if (!type) {
      res.setStatusCode(400);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.end(JSON.stringify({ code: 400, msg: 'Missing type parameter' }));
      return;
    }

    // 转换 API 类型
    const { api, params } = convertApiType(type, queries);

    console.log('API Call:', api, params);

    // 调用网易云 API
    if (!NeteaseCloudMusicApi[api]) {
      res.setStatusCode(404);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.end(JSON.stringify({ code: 404, msg: `API ${api} not found` }));
      return;
    }

    const result = await NeteaseCloudMusicApi[api]({
      ...params,
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
