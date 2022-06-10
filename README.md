# wxsocket

#### 介绍
基于 stomp 协议的微信小程序的 webSocket 兼容插件。

#### 软件架构
1.  基于 stomp 协议封装。
2.  微信小程序中使用 SocketTask 的方式去管理 webSocket 链接。
3.  保障同时存在多个 webSocket 链接的情况下，各自的生命周期更加可控。


#### 安装教程

1.  将 stomp.js 与 wx-socket.js 文件放置在项目的同一个文件夹中 
2.  wx-socket.js 通过 ESModule 的形式导出的模块，所以通过 import 形式引入 WXSocket 模块。

#### 使用说明

```javascript
const wxSocket = new WXSocket({
  url: 'wss://wss地址 string类型',
  reConnectLimit: '重新链接次数 number类型'
})
// 创建客户端 client。
const client = await wxSocket.client()

```

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
