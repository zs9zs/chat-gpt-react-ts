import { useState } from "react";
import styles from "./login.module.scss";
import axios from "axios";
import CloseIcon from "../icons/close.svg";
import { Button, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import 'antd/dist/reset.css';
import { useAccessStore } from "../store"

export function Login(props: {
  onClose?: () => void;
}) {
  
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [messageApi, contextHolder] = message.useMessage();
  const accessStore = useAccessStore();

  async function GetUserInfo() {
    const res = await axios({
      method: 'get',
      url: '/api/info',
      data: {
        id: 1,
      }
    })
  }

  async function UserLogin(act: string, pwd: string) {
    if (!act || !pwd) {
      console.log(act, pwd)
      messageApi.open({
        type: 'error',
        content: '请输入账号或密码',
      });
      return
    }
    try {
      const res = await axios({
        method: 'post',
        url: '/api/signIn',
        data: {
          account: act,
          psd: pwd,
        }
      })
      if (!res || !res.data) {
        messageApi.open({
          type: 'error',
          content: '登录失败',
        });
        return
      }
      const { data, status, message: errorMsg } = res.data
      if (!status || !data) {
        messageApi.open({
          type: 'error',
          content: errorMsg,
        });
        return
      }
      if (status && data) {
        props.onClose?.()
        accessStore.updateToken(data)
      }
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error,
      });
    }
  }

  async function UserRegister(act: string, pwd: string) {
    await axios({
      method: 'post',
      url: '/api/signUp',
      data: {
        account: act,
        psd: pwd,
      }
    }).then(res => {
      if (!res || !res.data) {
        messageApi.open({
          type: 'error',
          content: '注册失败',
        });
        return
      }
      const { data, status, message: errorMsg } = res.data
      if (!status || !data) {
        messageApi.open({
          type: 'error',
          content: errorMsg,
        });
        return
      }
  
      // 接口返回数据
      // created_at : "2023-05-03 20:36:21"
      // id: 0
      // invitation_code: "1SWWYQZE"
      // password: "e10adc3949ba59abbe56e057f20f883e"
      // updated_at: "2023-05-03 20:36:21"
      // username: "zs1"
    })
  }

  return (
    <div className={styles["login-mask"]}>
      <div className={styles["login-wrapper"]}>
        {contextHolder}
        <div className={styles["login-close-icon"]} onClick={props.onClose}>
          <CloseIcon />
        </div>
        <div className={styles["login-title"]}>Chat-Gpt</div>
        <div className={styles["login-item"]}>
          <Input size="small" placeholder="请输入账号" prefix={<UserOutlined />}  onChange={(e) => setAccount(e.currentTarget.value)}/>
        </div>
        <div className={styles["login-item-pwd"]}>
          <Input.Password type="password" size="small" placeholder="请输入密码" prefix={<LockOutlined />} onChange={(e) => setPassword(e.currentTarget.value)}/>
        </div>
        <div className={styles["login-btns"]}>
        <Button type="primary" block onClick={() => UserLogin(account, password)}> 登录 </Button>
        <Button className={styles["register-btn"]}  block onClick={() => UserRegister(account, password)}>注册</Button>
        </div>
      </div>
    </div>
  );
}