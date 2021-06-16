import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { Button ,Input, message} from 'antd'
import './index.less'

const Overview = () => {
  const [name, setName] = useState('')
  const [pwd, setPwd] = useState('')
  let history = useHistory();
  
  const handleLogin = () => {
    axios.post(API.login, { name, pwd }).then((resp) => {
      if (resp.id) {
        document.cookie = `loginId=${resp.id}`
        window.userId = resp.id
        history.push('about')
      }
    })
  }

   const handleSign = () => {
    axios.post(API.signUp, { name, pwd }).then((resp) => {
      console.log('resp',resp)
    })
  }
  
  return <div className="login">
    <div className="header" style={{marginBottom:10}}>
      <label style={{ marginRight: 10 }}>账号:</label>
      <Input style={{ width: 300 }} onChange={(e) => { setName(e.target.value) }} />
      <br />
      <label style={{ marginRight: 10 }}>密码:</label>
      <Input style={{ width: 300, marginTop: 10 }} onChange={ (e)=>{setPwd(e.target.value)} } />
    </div>
    <div className="footer">
      <Button style={{marginRight:10}} onClick={handleLogin}>登陆</Button>
      <Button onClick={handleSign}>注册</Button>
    </div>
  </div>
}

export default Overview