import React from "react";
import { useModal, useMask } from "@src/hooks";
import { DiamondRule } from "@src/pages/rule/index";
import "./semifinal-match.scoped.css";

const AwardPoolModal = () => {
  const [visible, setVisible] = useModal(AwardPoolModal);

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
        <div className="semifinal-modal-new">
          <span data-title />
          <div className="competition">
            <DiamondRule path="modal" />
          </div>
        </div>
        <span className="modal-btn-close" onClick={_onClose} />
      </div>
    </div>
  );
};

export default AwardPoolModal;
