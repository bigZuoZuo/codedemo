import React from "react";
import { useModal, useMask } from "@src/hooks";
import {HalfFinalRule} from "@src/pages/rule/index"
import "./semifinal-match.scoped.css";

const SemifinalMatchModal = () => {

const [visible, setVisible] = useModal(SemifinalMatchModal);

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
            <h6 className="new-title">半决赛规则</h6>
            <div className="competition">
              <HalfFinalRule path="modal" />
            </div>
          </div>
          <span className="modal-btn-close" onClick={_onClose} />
        </div>
      </div>
    );
};
export default SemifinalMatchModal;


// import imgSupportTicket from "@src/assets/images/img-support-ticket.png";
// import img376 from "@src/assets/images/img376.png";
// import ModalAwardList from "@src/components/modal-award-list";

// const list = [
//   {
//     key: "20万应援",
//     img: imgSupportTicket,
//     name: "官方赠票*10000",
//   },
//   {
//     key: "35万应援",
//     img: imgSupportTicket,
//     name: "官方赠票*20000",
//   },
//   {
//     key: "70万应援",
//     img: imgSupportTicket,
//     name: "官方赠票*100000",
//   },
// ];

// const SemifinalMatchModal = () => {
//   const [visible, setVisible] = useModal(SemifinalMatchModal);

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
//         <div className="semifinal-modal">
//           <span data-title-top />
//           <span data-title />
//           <h6 className="new-title">每日累计得票奖励</h6>
//           <ModalAwardList currIndex={2} list={list} />
//           <h6 className="new-title">限量礼物奖励<br/>(价值5200钻)</h6>
//           <div className="semifinal-words">
//             每日首位达到70W票的歌手可获得【嗨翻全场】*10
//           </div>
//           <div className="semifinal-award" style={{ marginLeft: 0 }}>
//             <div className="img-box">
//               <img src={img376} alt="" />
//             </div>
//           </div>
//           <div className="semifinal-action" onClick={_onClose} />
//         </div>
//         <span className="modal-btn-close" onClick={_onClose} />
//       </div>
//     </div>
//   );
// };

