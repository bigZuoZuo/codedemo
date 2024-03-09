import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useUserinfoState } from "@src/hooks";
import native from "@src/lib/native";
import { isInApp } from "@src/system";
import TimeLimitModal from "@src/components/modal/time-limit";
import { getGiftPack } from "@src/services";
import clsx from "clsx";

import "./links.scoped.css";

export const BannerLinkRight1 = () => {
  const history = useHistory();
  const _onClick = useCallback(() => {
    history.push("/support");
  }, [history]);

  return <span className="link-right1" onClick={_onClick} />;
};

export const BannerLinkRight2 = () => {
  const history = useHistory();
  const _onClick = useCallback(() => {
    history.push("/vote-records");
  }, [history]);

  return <span className="link-right2" onClick={_onClick} />;
};

export const BannerLinkRight3 = () => {
  const history = useHistory();
  const _onClick = useCallback(() => {
    history.push("/entry");
  }, [history]);

  return <span className="link-right3" onClick={_onClick} />;
};

export const BannerLinkLeft1 = () => {
  const _onClick = useCallback(() => {
    native.NativeOpenTopicDetail({ tagName: "《我是歌手》s1赛季", tagId: 21749 });
  }, []);

  return <span className="link-left1" onClick={_onClick} />;
};

export const BannerLinkLeft2 = () => {
  const history = useHistory();
  const _onClick = useCallback(() => {
    history.push("/singers");
  }, [history]);

  return <span className="link-left2" onClick={_onClick} />;
};

export const BannerLinkLeft3 = () => {
  const history = useHistory();
  const _onClick = useCallback(() => {
    history.push("/ranks");
  }, [history]);

  return <span className="link-left3" onClick={_onClick} />;
};

export const BannerLinkLucky = () => {
  const history = useHistory();
  const _onClick = useCallback(() => {
    history.push("/lottery");
  }, [history]);

  return <span className="link-lucky" onClick={_onClick} />;
};

export const BannerLinkRule = () => {
  const history = useHistory();
  const _onClick = useCallback(() => {
    history.push("/rule");
  }, [history]);

  return <span className="link-rule" onClick={_onClick} />;
};

export const BannerLinkRule2 = () => {
  const history = useHistory();
  const _onClick = useCallback(() => {
    history.push("/rule2");
  }, [history]);

  return <span className="link-rule2" onClick={_onClick} >现场规则</span>;
};

export const BannerLinkRule3 = () => {
  const history = useHistory();
  const _onClick = useCallback(() => {
    history.push("/rule3");
  }, [history]);

  return <span className="link-rule3" onClick={_onClick} />;
};

export const BannerLinkBack = (props) => {
  const _onClick = useCallback(() => {
    isInApp ? native.NativeNavigateBack() : window.history.back(-1);
  }, []);

  return <span className="link-back" data-top={props.top ? 1 : 0} onClick={_onClick} />;
};

export const BannerLinkPack = () => {
  const userInfoState = useUserinfoState();
  const _onClick = useCallback(async () => {
    try {
      const data = await getGiftPack();
      userInfoState.updateGiftPack(data.is_show);
    } catch (err) {}

    TimeLimitModal.show();
  }, [userInfoState]);

  return <span className="link-pack" onClick={_onClick} />;
};

// 主播红人扶持计划
export const BannerLinkRedPeople = () => {
  const history = useHistory();
  const _onClick = useCallback(() => {
    history.push("/hotPeople");
  }, [history]);

  return <span className="link-red-people" onClick={_onClick} />;
};


export const BottomBg = (props) => {
  return (
    <div className={clsx("bottom-bg", props.haveBottom && "have-bottom")} />
  );
};