import { Input,Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import Websocket from '../utils/websocket'
import { useHistory } from "react-router-dom";

const About = () => {
  const [data, setData] = useState([])
  const [value, setValue] = useState('')
  let history = useHistory();
  
  useEffect(() => {
    const isUser = document.cookie.split('; ').find(item => item.split('=')[0] === 'loginId' && item.split('=')[1])
    if (!isUser) {
      history.replace('/')
    }
  },[])

  const columns = [{
    dataIndex: 'msg',
    title:'内容'
  }]
  
  const handleSend = () => {
    const params = {
      userID:window.userId,
      message:value,
      messageType:'string'
    }
    axios.post(API.sendMessage, params).then((resp) => {
    })
    setValue('')
  }

  return <div>
    <Input.TextArea value={value} onChange={e => {
      setValue(e.target.value)
    }} />
    <Button onClick={handleSend} style={{ marginTop: 10 }}>发送</Button>
    <Table
      key="id"
      columns={columns}
      dataSource={data}
      pagination={false}
    />
    <Websocket
      onmessage={(e) => {
        setData(data => data.concat({
          msg:JSON.parse(e).message
        }))
      }}
    />
  </div>;
};
export default About;
