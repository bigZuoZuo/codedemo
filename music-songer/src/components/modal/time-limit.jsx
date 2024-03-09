import React, { useCallback } from "react";
import { useObserver } from "mobx-react";
import { useModal, useMask, useUserinfoState } from "@src/hooks";
import { postPackBuy } from "@src/services";
import { toast } from "@src/system";
import RewordList from "@src/components/reward";

import "./time-limit.scoped.css";
import imgBtnBuy from "./images/btn-buy.png";
import imgBtnBuyDisabled from "./images/btn-buy-disabled.png";

const TimeLimitModal = () => {
  const [visible, setVisible] = useModal(TimeLimitModal);
  const userInfoState = useUserinfoState();

  const _onClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const _onSubmit = useCallback(async () => {
    if (!userInfoState.showGiftPack) {
      toast("当日页面投票必须不低于30票且每人每日仅可购买一次");
      return;
    }

    try {
      await postPackBuy();
      toast("购买成功");
      setVisible(false);
    } catch (err) { }
  }, [setVisible, userInfoState.showGiftPack]);

  useMask(visible);

  return useObserver(() =>
    !visible ? null : (
      <div className="modal-wrapper">
        <div className="content-wrapper">
          <div className="time-limit-modal">
            <span data-title />
            <h6 className="new-title">限时礼包</h6>
            <div className="tip">送出后歌手可获得2000*应援票加成</div>
            <RewordList rewordkey="time_limit" />
            <div className="price">
              <span className="img-diamond" />
              <span className="dia-price">52000</span>
            </div>
            <img
              src={userInfoState.showGiftPack ? imgBtnBuy : imgBtnBuyDisabled}
              className="btn-buy"
              alt=""
              onClick={_onSubmit}
            />
          </div>
          <span className="modal-btn-close" onClick={_onClose} />
        </div>
      </div>
    )
  );
};

export default TimeLimitModal;
