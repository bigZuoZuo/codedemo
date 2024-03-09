import React from "react";
import { useModal, useMask } from "@src/hooks";
import { PromotionRule } from "@src/pages/rule/index";

import "./upgrade-match.scoped.css";
const UpgradeMatchModal = () => {
  const [visible, setVisible] = useModal(UpgradeMatchModal);

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
        <div className="upgrade-match-modal-new">
          <span data-title />
          <h6 className="new-title">晋级赛规则</h6>
          <div className="competition">
            <PromotionRule path="modal" />
          </div>
        </div>
        <span className="modal-btn-close" onClick={_onClose} />
      </div>
    </div>
  );
};

export default UpgradeMatchModal;

// import ModalAwardList from "@src/components/modal-award-list";
// import imgSupportTicket from "@src/assets/images/img-support-ticket.png";
// const list = [
//   {
//     key: "4场",
//     img: imgSupportTicket,
//     name: "官方赠票5000",
//   },
//   {
//     key: "8场",
//     img: imgSupportTicket,
//     name: "官方赠票10000",
//   },
//   {
//     key: "12场",
//     img: imgSupportTicket,
//     name: "官方赠票30000",
//   },
// ];

// const UpgradeMatchModal = () => {
//   const [visible, setVisible] = useModal(UpgradeMatchModal);

//   const _onClose = () => {
//     setVisible(false);
//   };

//   useMask(visible);

//   if (!visible) {
//     return null;
//   }

//   return (
//     <div className="modal-wrapper">
//       <div className="content-wrapper">
//         <div className="upgrade-match-modal">
//           <span data-title-top />
//           <span data-title />
//           <h6 className="new-title">每日PK连胜奖励</h6>
//           <ModalAwardList currIndex={2} list={list} />
//           <div className="upgrade-match-action" onClick={_onClose} />
//         </div>
//         <span className="modal-btn-close" onClick={_onClose} />
//       </div>
//     </div>
//   );
// };