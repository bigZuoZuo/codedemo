import React from "react";
import { useModal, useMask } from "@src/hooks";

import "./vote-success.scoped.css";

const VoteSuccessModal = () => {
  const [visible, setVisible] = useModal(VoteSuccessModal);

  const _onClose = () => {
    setVisible(false);
  };

  useMask(visible);

  if (!visible) {
    return null;
  }

  return (
    <div className="modal-wrapper">
      <div className="content-wrapper">
        <div className="vote-success-modal">
          <span data-title />
          <h6 className="new-title">投票成功</h6>
          <div className="vote-success-content">
            恭喜你获得3个幸运币，可用于参与幸运抽奖
          </div>
          <div className="vote-success-tip">邀请更多好友来为她投票吧！</div>
          <div className="vote-success-action" />
        </div>
        <span className="modal-btn-close" onClick={_onClose} />
      </div>
    </div>
  );
};

export default VoteSuccessModal;
