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

import { BUY_URL } from "../constant";

import { useAccessStore } from "../store";

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
  const [radioValue, setRadioValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const accessStore = useAccessStore();

  useEffect(() => {
    async function getPayList() {
      const res = await axios({
        method: "get",
        url: "/api/goodsList",
      });
      setIsLoading(false);
      if (res?.data?.data?.length) {
        setPayList(res.data.data);
        const { goods } = res.data.data[0];
        if (goods?.length) {
          const { id } = goods[0];
          setRadioValue(id);
        }
      }
    }
    getPayList();
  }, []);

  const onChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value);
  };

  function payConfirm() {
    props.onClose?.();
  }

  return (
    <>
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
                    <div className={styles["pay-good-name"]}>
                      {good.gd_name}
                    </div>
                    <div className={styles["pay-good-raido"]}>
                      <Radio
                        checked={radioValue == good.id}
                        value={good.id}
                        onChange={onChange}
                      ></Radio>
                    </div>
                  </div>
                  <div className={styles["pay-good-desc"]}>
                    {good.gd_description}
                  </div>
                </>
              ))}
            </div>
          ))}
          <div className={styles["pay-bottom"]}>
            <a
              className={styles["pay-btn-a"]}
              href={BUY_URL + `?id=${radioValue}&token=${accessStore.token}`}
              target="_blank"
            >
              <Button
                className={styles["pay-btn"]}
                onClick={payConfirm}
                loading={isLoading}
              >
                {isLoading ? "Loading" : "确定支付"}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
