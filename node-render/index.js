'use strict'

// 引入文件路径
let fs = require('fs')
let path = require('path')

// 定义全局的Vue为了服务端的app.js
global.Vue = require('vue')

/* part1 */
// 获取HTML布局
let layout = fs.readFileSync('./index.html', 'utf8')
// 拆分布局成两段HTML
let layoutSections = layout.split('<div id="app"></div>')
let preAppHTML = layoutSections[0]
let postAppHTML = layoutSections[1]

// 创建一个渲染器
let renderer = require('vue-server-renderer').createRenderer()

// 创建一个Express服务器
let express = require('express')
let server = express()

server.use('/assets', express.static(
  path.resolve(__dirname, 'assets')
))

/* part2 */
// 处理所有的Get请求
server.get('*', function (request, response) {
  // 1渲染我们的Vue实例作为流
  let stream = renderer.renderToStream(require('./assets/app')())
  // 2将预先的HTML写入响应
  response.write(preAppHTML)
  // 3每当新的块被渲染
  stream.on('data', function (chunk) {
    // 将块写入响应
    response.write(chunk)
  })
  // 4当所有的块被渲染完成
  stream.on('end', function () {
    // 将post-app HTML写入响应
    response.end(postAppHTML)
  })
  // 5当渲染时发生错误
  stream.on('error', function (error) {
    // 打印错误到控制台
    console.error(error)
    // 告诉客服端发生了错误
    return response
      .status(500)
      .send('Server Error')
  })
})

// 监听5000端口
server.listen(5000, function (error) {
  if (error) throw error
  console.log('Server is running at localhost:5000')
})