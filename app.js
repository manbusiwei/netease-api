const NeteaseCloudMusicApi = require('NeteaseCloudMusicApi')
const express = require('express')
const app = express()

// 启用 CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  next()
})

// 解析请求体
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 健康检查
app.get('/', (req, res) => {
  res.json({ code: 200, msg: 'NeteaseCloudMusicApi 服务正常运行' })
})

// 启用所有 API - 使用 get 方法而不是 use
Object.keys(NeteaseCloudMusicApi).forEach(key => {
  if (typeof NeteaseCloudMusicApi[key] === 'function') {
    app.get(`/${key}`, async (req, res) => {
      try {
        const result = await NeteaseCloudMusicApi[key]({ ...req.query, ...req.body })
        res.json(result.body || result)
      } catch (e) {
        res.status(500).json({ code: 500, msg: e.message })
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