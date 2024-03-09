import React, { memo } from "react";
import { useModal, useMask } from "@src/hooks";

import "./pay-success.scoped.css";
// import imgPaySuccessContent from "./images/pay-success-content.png";

const PaySuccessModal = memo(() => {
  const [visible, setVisible] = useModal(PaySuccessModal);

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
        <div className="pay-success-modal">
          {/* <img src={imgPaySuccessContent} alt="" /> */}
        </div>
        <span className="modal-btn-close" onClick={_onClose} />
      </div>
    </div>
  );
});

export default PaySuccessModal;
