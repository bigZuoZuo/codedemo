import React from "react";
import { useModal, useMask } from "@src/hooks";

import "./common.scoped.css";

const CommonModal = () => {
  const [visible, setVisible, args = []] = useModal(CommonModal);

  const _onClose = () => {
    setVisible(false);
  };

  useMask(visible);

  const title = args[0] || "";
  const subtitle = args[1] || "";

  if (!visible) {
    return null;
  }

  return (
    <div className="modal-wrapper">
      <div className="content-wrapper">
        <div className="common-modal">
          <span data-title />
          <h6 className="new-title">{title}</h6>
          {subtitle && <div className="content">{subtitle}</div>}
          <div className="common-action" onClick={_onClose} />
        </div>
        <span className="modal-btn-close" onClick={_onClose} />
      </div>
    </div>
  );
};

export default CommonModal;
