class WXSocket {
  constructor({ url = '', reConnectLimit = -1 }) {
    this.socketTask = null
    this.wsUrl = url
    this.originReConnectLimit = reConnectLimit
    this.reConnectLimit = reConnectLimit
    this.msgQueue = []
    this.ws = {
      send: this.sendSocketMessage.bind(this),
      close: this.closeSocket.bind(this),
      onopen: null,
      onclose: null,
      onmessage: null,
    }
  }

  async client() {
    const Stomp = require('./stomp').Stomp
    Stomp.setInterval = (interval, f) => {
      return setInterval(f, interval)
    }
    Stomp.clearInterval = (id) => {
      return clearInterval(id)
    }
    try {
      await this.connectSocket()
      this.onSocketOpen()
      this.onSocketMessage()
      this.onSocketError()
      this.onSocketClose()
    } catch (error) {}
    return Stomp.over(this.ws)
  }

  connectSocket() {
    return new Promise((resolve, reject) => {
      this.socketTask = wx.connectSocket({
        url: this.wsUrl,
        success: (msg) => resolve(msg),
        fail: (err) => reject(err),
      })
    })
  }

  onSocketOpen() {
    this.socketTask.onOpen(() => {
      this.reConnectLimit = this.originReConnectLimit
      this.msgQueue.forEach((item) => {
        this.sendSocketMessage(item)
      })
      this.msgQueue = []
      this.ws.onopen && this.ws.onopen()
    })
  }

  sendSocketMessage(msg) {
    try {
      this.socketTask.send({
        data: msg,
      })
    } catch {
      this.msgQueue.push(msg)
    }
  }

  onSocketMessage() {
    this.socketTask.onMessage((res) => {
      this.ws.onmessage && this.ws.onmessage(res)
    })
  }

  onSocketError() {
    this.socketTask.onError((err) => {
      this.reConnectLimit--
      console.log('websocket 错误事件：', err)
    })
  }

  closeSocket() {
    this.socketTask.close()
  }

  onSocketClose() {
    this.socketTask.onClose((res) => {
      this.ws.onclose && this.ws.onclose(res)
      if (this.reConnectLimit === 0) return
      setTimeout(() => {
        this.connectSocket()
          .then(() => {
            this.onSocketOpen()
            this.onSocketMessage()
            this.onSocketError()
            this.onSocketClose()
          })
          .catch((err) => {})
      }, 5000)
    })
  }
}

export default WXSocket
