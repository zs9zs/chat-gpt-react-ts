import { useState, useEffect, useRef } from "react";

import styles from "./home.module.scss";

import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import Locale from "../locales";

import { useAppConfig, useChatStore } from "../store";

import {
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "../constant";

import { Link, useNavigate } from "react-router-dom";
import { useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { Input, List, ListItem, Modal, Popover } from "./ui-lib";
import CopyIcon from "../icons/copy.svg";
import axios from "axios";
import { Login } from "./login"
import { PayList } from "./pay"

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? 300);
  const lastUpdateTime = useRef(Date.now());

  const handleMouseMove = useRef((e: MouseEvent) => {
    if (Date.now() < lastUpdateTime.current + 50) {
      return;
    }
    lastUpdateTime.current = Date.now();
    const d = e.clientX - startX.current;
    const nextWidth = limit(startDragWidth.current + d);
    config.update((config) => (config.sidebarWidth = nextWidth));
  });

  const handleMouseUp = useRef(() => {
    startDragWidth.current = config.sidebarWidth ?? 300;
    window.removeEventListener("mousemove", handleMouseMove.current);
    window.removeEventListener("mouseup", handleMouseUp.current);
  });

  const onDragMouseDown = (e: MouseEvent) => {
    startX.current = e.clientX;

    window.addEventListener("mousemove", handleMouseMove.current);
    window.addEventListener("mouseup", handleMouseUp.current);
  };
  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? 300);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragMouseDown,
    shouldNarrow,
  };
}

async function userLogin(act: string, pwd: string) {
  console.log(act, pwd)
  // await axios({
  //   method: 'get',
  //   url: '/api/info',
  //   params: {
  //     id: 1,
  //   }
  // }).then(res => {
  //   console.log("get res:",res);
  // },error => {
  //     console.log("get request failed:",error);
  // })
}

function userRegister(act: string, pwd: string) {
  console.log(act, pwd)
}


function UserPromptModal(props: { onClose?: () => void }) {
  const [accountText, setAccountText] = useState('')
  const [passwordText, setPasswordText] = useState('')
  return (
    <div className="modal-mask">
      <Modal
        title='登录注册'
        onClose={() => props.onClose?.()}
        actions={[
          <IconButton
            key="login"
            icon={<CopyIcon />}
            bordered
            text='登录'
            onClick={() => userLogin(accountText, passwordText)}
          />,
          <IconButton
            key="regist"
            icon={<CopyIcon />}
            bordered
            text='注册'
            onClick={() => userRegister(accountText, passwordText)}
          />,
        ]}
      >
        <div className={styles["user-prompt-modal"]}>
          <div className={styles["user-prompt-list"]}>
              <div className={styles["user-prompt-item"]}>
                <div className={styles["user-prompt-header"]}>
                  账号：
                  <input
                    type="text"
                    className={styles["user-prompt-title"]}
                    placeholder="请输入账号"
                    value={accountText}
                    onInput={(e) => setAccountText(e.currentTarget.value)}
                  ></input>
                </div>
                <div className={styles["user-prompt-header"]}>
                  密码：
                  <input
                    type="text"
                    className={styles["user-prompt-title"]}
                    placeholder="请输入密码"
                    value={passwordText}
                    onInput={(e) => setPasswordText(e.currentTarget.value)}
                  ></input>
                </div>
              </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function SideBar(props: { className?: string }) {
  const chatStore = useChatStore();

  // drag side bar
  const { onDragMouseDown, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();

  const [shouldShowPromptModal, setShowPromptModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  return (
    <div
      className={`${styles.sidebar} ${props.className} ${
        shouldNarrow && styles["narrow-sidebar"]
      }`}
    >
      <div className={styles["sidebar-header"]}>
        <div className={styles["sidebar-title"]}>ChatGPT Next</div>
        <div className={styles["sidebar-sub-title"]}>
          Build your own AI assistant.
        </div>
        <div className={styles["sidebar-logo"]}>
          <ChatGptIcon />
        </div>
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate(Path.Home);
          }
        }}
      >
        <ChatList narrow={shouldNarrow} />
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<CloseIcon />}
              onClick={chatStore.deleteSession}
            />
          </div>
          <div className={styles["sidebar-action"]}>
            <Link to={Path.Settings}>
              <IconButton icon={<SettingsIcon />} shadow />
            </Link>
          </div>
          <div className={styles["sidebar-action"]}>
            {/* <a href={REPO_URL} target="_blank"> */}
              <IconButton icon={<GithubIcon />} shadow  onClick={() => setShowLoginModal(true)}/>
            {/* </a> */}
          </div>
          <div className={styles["sidebar-action"]}>
              <IconButton icon={<GithubIcon />} shadow  onClick={() => setShowPayModal(true)}/>
          </div>
        </div>
        <div>
          <IconButton
            icon={<AddIcon />}
            text={shouldNarrow ? undefined : Locale.Home.NewChat}
            onClick={() => {
              chatStore.newSession();
            }}
            shadow
          />
        </div>
      </div>

      <div
        className={styles["sidebar-drag"]}
        onMouseDown={(e) => onDragMouseDown(e as any)}
      ></div>
      {shouldShowPromptModal && (<UserPromptModal onClose={() => setShowPromptModal(false)} />)}
      {showLoginModal && (<Login onClose={() => setShowLoginModal(false)} />)}
      {showPayModal && (<PayList onClose={() => setShowPayModal(false)} />)}
    </div>
  );
}
