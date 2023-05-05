import { useEffect, useState } from "react";

import styles from "./pay.module.scss";

import axios from "axios";
import CloseIcon from "../icons/close.svg";
import { Button, Radio, RadioChangeEvent } from "antd";
import {
  TransactionOutlined,
  AlipayOutlined,
  WechatOutlined,
} from "@ant-design/icons";

async function userLogin(act: string, pwd: string) {
  const data = {
    account: act,
    psd: pwd,
  };
  await axios({
    method: "post",
    url: "/api/signUp",
    data,
  }).then((res) => {
    console.log("get res:", res);
  });
}

interface Prompt {
  id: number;
  gp_name: string;
  goods: Goods[];
}

interface Goods {
  actual_price?: string;
  api_hook?: null;
  balance?: number;
  buy_limit_num?: number;
  buy_prompt?: null;
  carmis_count?: number;
  deleted_at?: null;
  description?: null;
  gd_description?: string;
  gd_keywords?: string;
  gd_name?: string;
  group_id?: number;
  id?: number;
  in_stock?: number;
  is_open?: number;
  ord?: number;
  other_ipu_cnf?: null;
  picture?: string;
  retail_price?: string;
  sales_volume?: number;
  type?: number;
}

export function PayList(props: { onClose?: () => void }) {
  const [payList, setPayList] = useState<Prompt[]>([] as Prompt[]);
  const [radioValue, setRadioValue] = useState(1);
  const [money, setMoney] = useState();
  useEffect(() => {
    async function getPayList() {
      const res = await axios({
        method: "get",
        url: "/api/goodsList",
      });
      console.log("test", res.data.data[0]);
      if (res?.data?.data?.length) {
        setPayList(res.data.data);
      }
    }
    getPayList();
  }, []);

  const onChange = (e: RadioChangeEvent) => {
    console.log("changed", e.target.value);
    setRadioValue(e.target.value);
  };

  async function payConfirm() {
    props.onClose?.();
    // const data = {
    //   id: 1,
    //   user_id: 1,
    // }
    // await axios({
    //   method: 'get',
    //   url: '/api/buy',
    //   data
    // }).then(res => {
    //   props.onClose?.()
    //   console.log("get res:",res);
    // })
  }

  return (
    <div className={styles["pay-mask"]}>
      <div className={styles["pay-wrapper"]}>
        <div className={styles["pay-close-icon"]} onClick={props.onClose}>
          <CloseIcon />
        </div>
        {payList?.map((item) => (
          <div className={styles["pay-list-wrapper"]} key={item.id}>
            {item?.goods?.map((good) => (
              <>
                <div className={styles["pay-goods-wrapper"]} key={good.id}>
                  <div className={styles["pay-good-icon"]}>
                    <TransactionOutlined />
                  </div>
                  <div className={styles["pay-good-name"]}>{good.gd_name}</div>
                  <div className={styles["pay-good-raido"]}>
                    <Radio
                      checked={radioValue === 1}
                      value={1}
                      onChange={onChange}
                    >
                      A
                    </Radio>
                  </div>
                </div>
                <div className={styles["pay-good-desc"]}>
                  {good.gd_description}
                </div>
              </>
            ))}
          </div>
        ))}

        {/* <div className={styles["pay-list-wrapper"]}>
          <div className={styles["pay-goods-wrapper"]}>
            <div className={styles["pay-good-icon"]}>
              <WechatOutlined twoToneColor="green" />
            </div>
            <div className={styles["pay-good-name"]}>微信</div>
            <div className={styles["pay-good-raido"]}>
              <input type="radio"></input>
            </div>
          </div>
        </div>

        <div className={styles["pay-list-wrapper"]}>
          <div className={styles["pay-goods-wrapper"]}>
            <div className={styles["pay-good-icon"]}>
              <AlipayOutlined twoToneColor="#999999" />
            </div>
            <div className={styles["pay-good-name"]}>支付宝</div>
            <div className={styles["pay-good-raido"]}>
              <input type="radio"></input>
            </div>
          </div>
        </div> */}
        <div className={styles["pay-bottom"]}>
          <Button className={styles["pay-btn"]} onClick={payConfirm}>
            确定支付
          </Button>
        </div>
      </div>
    </div>
  );
}
