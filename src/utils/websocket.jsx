import React, { Component } from "react";
import { withRouter } from "react-router-dom";

let ws; // websocket实例
let lockReconnect = false; //避免重复连接
let tt;
const wsUrl = "ws://localhost:8001";

class Websocket extends Component {
  componentDidMount() {
      this.webSocket();
  }
  componentWillUnmount() {
    ws && ws.close();
  }

  webSocket = () => {
    const _this = this
    // 初始化
    const time = 15 * 1000
    const initEventHandle = () => {
      // 关闭时重连
      ws.onclose = function () {
        reconnect(wsUrl);
      };

      // 报错时重连
      ws.onerror = function (e) {
        if (e.target.readyState === 3) {
          // message.warning("WebSocket未连接");
        }
      };

      ws.onopen = function () {
        // 心跳检测重置
        console.log('open')
        heartCheck.reset().start();
      };

      ws.onmessage = function (data) {
        // 如果获取到消息，心跳检测重置
        // 拿到任何消息都说明当前连接是正常的
        if (data.data === "HeartReconnect") {
          console.log('心跳检测', data.data)
          heartCheck.reset().start();
          return false;
        }
        // 返回的信息
        console.log('result', data.data)
        _this.props.onmessage && _this.props.onmessage(data.data);
      };
    };

    // 重连
    const reconnect = (url) => {
      console.log('重连中...')
      if (lockReconnect) {
        return;
      }
      lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      tt && clearTimeout(tt);
      tt = setTimeout(function () {
        createWebSocket(url);
        lockReconnect = false;
      }, 4000);
    };

    //心跳检测
    const heartCheck = {
        timeout: time,
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
          clearTimeout(this.timeoutObj)
          clearTimeout(this.serverTimeoutObj)
          return this
        },
        start: function () {
          // var self = this;
          this.timeoutObj = setTimeout(function () {
            if (ws.readyState === 3) {
              return
            }
            // 这里发送一个心跳，后端收到后，返回一个心跳消息，
            // onmessage拿到返回的心跳就说明连接正常
            ws.send('HeartReconnect')
          }, this.timeout)
        }
      }

    // 创建websocket
    const createWebSocket = (url) => {
      try {
        ws = new WebSocket(url);
        initEventHandle();
      } catch (e) {
        reconnect(url);
      }
    };

    createWebSocket(wsUrl);
  };

  render() {
    return <div />;
  }
}

export default withRouter(Websocket);
