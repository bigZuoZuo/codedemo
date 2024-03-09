import React, { useEffect, useState, useCallback } from "react";
import copy from "copy-to-clipboard";
import { useModal, useMask } from "@src/hooks";
import { toast } from "@src/system";
import { getLotteryCode } from "@src/services";
import NoData from "@src/components/nodata";

import "./lottery-code.scoped.css";

const LotteryCodeModal = () => {
  const [visible, setVisible] = useModal(LotteryCodeModal);
  const [list, setList] = useState([]);

  const _onClose = useCallback(() => {
    setVisible(false);
  }, []);

  const _onCopy = useCallback((ev) => {
    const { code } = ev.target.dataset;
    if (!code) {
      return;
    }

    copy(code);
    toast("已复制");
  }, []);

  const _fetchData = useCallback(async () => {
    try {
      const data = await getLotteryCode();
      const _list = data.map((item) => item.code);
      if (_list.length) {
        setList(_list);
      }
    } catch (err) { }
  }, []);

  useMask(visible);

  useEffect(() => {
    if (!visible) {
      return;
    }

    _fetchData();
  }, [visible, _fetchData]);

  if (!visible) {
    return null;
  }

  return (
    <div className="modal-wrapper">
      <div className="content-wrapper">
        <div className="lottery-code-modal">
          <span data-title />
          <h6 className="new-title">我的抽奖码</h6>

          {list.length ? (
            <div className="scroll-y">
              <div className="lottery-code-tip">
                您已获得以下抽奖码，可在决赛现场参与抽奖
              </div>
              {list.map((code, index) => (
                <div key={code + index} className="lottery-code-row">
                  <span>{code}</span>
                  <span data-copy data-code={code} onClick={_onCopy} />
                </div>
              ))}
              <div className="lottery-code-action" onClick={_onClose} />
            </div>
          ) : (
            <NoData tips="暂无抽奖码" />
          )}
        </div>
        <span className="modal-btn-close" onClick={_onClose} />
      </div>
    </div>
  );
};

export default LotteryCodeModal;
