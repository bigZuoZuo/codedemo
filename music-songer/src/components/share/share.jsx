import native from "../../lib/native";
import { doCopy } from "../../lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import System from "@src/system";
import "./share.scoped.css";
import Mask from "../mask/mask";

const overseaList = [
  {
    name: "facebook",
    type: "facebook",
    icon: require("./images/facebook.png"),
  },
  {
    name: "twitter",
    type: "twitter",
    icon: require("./images/twitter.png"),
  },
  {
    name: "line",
    type: "line",
    icon: require("./images/line.png"),
  },
  {
    name: "link",
    type: "link",
    icon: require("./images/link.png"),
  },
];

const mainlandList = [
  {
    name: "微信",
    type: "wechat",
    icon: require("./images/wechat.svg"),
  },
  {
    name: "QQ",
    type: "qq",
    icon: require("./images/qq.svg"),
  },
  {
    name: "朋友圈",
    type: "moment",
    icon: require("./images/moment.svg"),
  },
  {
    name: "QQ空间",
    type: "qzone",
    icon: require("./images/qzone.svg"),
  },
];

export default function Share() {
  let [visible, setVisible] = useState(false);
  let [tp, setTP] = useState(null);
  let confirmRef = useRef();

  useEffect(() => {
    Share.show = (tp) => {
      setTP(+tp);
      setVisible(true);
      return new Promise((resolve) => {
        confirmRef.current = resolve;
      });
    };
  });

  const share = useCallback(
    (type) => {
      if (type === "wechat") native.NativeShareWechat(tp);
      if (type === "qq") native.NativeShareQQ(tp);
      if (type === "moment") native.NativeShareWechatMoment(tp);
      if (type === "qzone") native.NativeShareQQ(tp);
      if (type === "facebook") native.NativeShareFacebook(tp);
      if (type === "twitter") native.NativeShareTwitter(tp);
      if (type === "line") native.NativeShareLine(tp);
      if (type === "link") doCopy(window.location.href);
      confirmRef.current && confirmRef.current(type);
      setVisible(false);
    },
    [tp]
  );

  return (
    <Mask visible={visible} onClick={() => setVisible(false)}>
      <div className="share">
        {(System.appName === "partying" ? overseaList : mainlandList).map((item) => {
          return (
            <button className="item" onClick={(e) => share(item.type)} key={item.type}>
              <img src={item.icon} alt={item.name} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </Mask>
  );
}
