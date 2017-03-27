'use strict'

// 服务
let WebSocket = require('ws')
let WebSocketServer = require('ws').Server
let uuid = require('node-uuid')
// 连接列表
let clients = []
// 端口监听
let wss = new WebSocketServer({ port: 8181 })
// 事件
wss.on('connection', (ws) => {
	// 记录连接
	let client_uuid = uuid.v4()
	clients.push({ 'id': client_uuid, 'ws': ws })
    console.log(client_uuid + ' client connected')

    // 收到消息后发送给第一个
    ws.on('message', (message) => {
    	let clientSocket = clients[0].ws
    	if (clientSocket.readyState === WebSocket.OPEN) {
    		clientSocket.send(message)
    	}
        console.log(JSON.parse(message))
    })
})