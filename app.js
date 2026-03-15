const NeteaseCloudMusicApi = require('NeteaseCloudMusicApi')
const express = require('express')
const app = express()

// 启用所有 API
Object.keys(NeteaseCloudMusicApi).forEach(key => {
  if (typeof NeteaseCloudMusicApi[key] === 'function') {
    app.use(`/${key}`, async (req, res) => {
      try {
        const result = await NeteaseCloudMusicApi[key]({ ...req.query, ...req.body })
        res.json(result.body || result)
      } catch (e) {
        res.json({ code: 500, msg: e.message })
      }
    })
  }
})

// Vercel serverless 支持
module.exports = app

// 本地开发
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`网易云音乐 API 运行在 http://localhost:${PORT}`)
  })
}