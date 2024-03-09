import React, { useEffect, useRef, useCallback } from "react";
import { useObserver, useLocalStore } from "mobx-react";
import clsx from "clsx";
import { useModal, useMask } from "@src/hooks";
import { postVote, getUserMoney } from "@src/services";
import native from "@src/lib/native";
import { toast } from "@src/system";
import { noop } from "@src/lib/utils";

import "./vote.scoped.css";

const vote_arr = [3, 18, 30, 90, 300, 600, 1500, 3000, 15000];

const VoteModal = () => {
  const [visible, setVisible, args = []] = useModal(VoteModal);
  const cbRef = useRef();
  const params = args[0] || {};

  cbRef.current = args[1] && typeof args[1] === "function" ? args[1] : noop;

  const _onClose = useCallback(() => {
    setVisible(false);
  }, []);

  const store = useLocalStore(() => ({
    list: vote_arr,
    active: vote_arr[0],
    total: 0,
    get num() {
      return store.active / 3;
    },
    get amount() {
      return store.num * 100;
    },
    changeActive(ev) {
      const { item } = ev.target.dataset;
      if (!item) {
        return;
      }

      store.active = +item;
    },
    async onSubmit(ev) {
      const { uid } = ev.target.dataset;
      if (!uid) {
        return;
      }

      try {
        await postVote(uid, store.num);
        toast("投票成功");
        setTimeout(_onClose, 1500);
        cbRef.current();
        store.fetchData();
      } catch (err) { }
    },
    async fetchData() {
      try {
        const data = await getUserMoney();
        store.total = data.money;
      } catch (err) { }
    },
    toCharge() {
      native.NativeShowChargeBalance();
    },
  }));

  useMask(visible);

  useEffect(() => {
    if (!visible) {
      return;
    }

    store.fetchData();
  }, [visible]);

  return useObserver(() =>
    !visible ? null : ( 
      <div className="modal-wrapper">
        <div className="content-wrapper">
          <div className="vote-modal">
            <span data-title />
            <h6 className="new-title">投票</h6>
            <div className="vote-info">
              <span>为</span>
              <span className="vote-info-name">{params.name || ""}</span>
              <span>投票</span>
            </div>
            <div className="vote-list">
              {store.list.map((item) => (
                <div
                  key={item}
                  data-item={item}
                  className={clsx(
                    "vote-item",
                    store.active === item && "active"
                  )}
                  onClick={store.changeActive}
                >
                  {item}票
                </div>
              ))}
            </div>
            <div className="vote-amount">
              <div>送TA {store.num}个歌手应援礼物</div>
              <div>需要消耗{store.amount}钻石</div>
            </div>
            <div
              className="btn-vote-sure"
              data-uid={params.uid || 0}
              onClick={store.onSubmit}
            />
            <div className="charge-info">
              <span data-diamond />
              <span>我的钻石：{store.total}</span>
              <div className="charge-info-link" onClick={store.toCharge}>
                充值&gt;
              </div>
            </div>
          </div>
          <span className="modal-btn-close" onClick={_onClose} />
        </div>
      </div>
    )
  );
};

export default VoteModal;
