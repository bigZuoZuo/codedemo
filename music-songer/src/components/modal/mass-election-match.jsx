import React from "react";
import { useModal, useMask } from "@src/hooks";
import { AuditionRule } from "@src/pages/rule/index";

import "./mass-election-match.scoped.css";
const MassElectionModal = () => {
  const [visible, setVisible] = useModal(MassElectionModal);

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
        <div className="mass-election-modal-new">
          <span data-title />
          <h6 className="new-title">海选赛规则</h6>
          <div className="competition">
            <AuditionRule path="modal" />
          </div>
        </div>
        <span className="modal-btn-close" onClick={_onClose} />
      </div>
    </div>
  );
};
export default MassElectionModal;


// import ModalAwardList from "@src/components/modal-award-list";
// import RewordList from "@src/components/reward";
// const MassElectionModal = () => {
//   const [visible, setVisible] = useModal(MassElectionModal);

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
//         <div className="mass-election-modal">
//           <span data-title-top />
//           <span data-title />
//           <h6 className="new-title">累计得票奖励</h6>
//           <RewordList rewordkey="mass_award_list_model1" />
//           {/* <ModalAwardList
//             currIndex={2}
//             showPeriod
//             list={[
//               {
//                 key: "300票",
//                 img: imgMedal,
//                 name: "明星歌手",
//                 period: "勋章 (发放至比赛结束日)",
//               },
//               {
//                 key: "12000票",
//                 img: imgCircleBubble,
//                 name: "明星歌手",
//                 period: "聊天气泡*5天",
//               },
//               {
//                 key: "30000票",
//                 img: imgCircle1,
//                 name: "明星歌手",
//                 period: "头像框*5天",
//               },
//             ]}
//           /> */}
//           <h6 className="new-title margin0">总榜奖励</h6>
//           <div className="mass-election-awards">
//             {/* {award_list.map((item, index) => (
//               <div className="mass-election-award">
//                 <div className="img-box" data-txt={`TOP${index + 1}`}>
//                   <img src={item.img} alt="" />
//                 </div>
//                 <div className="name">{item.name}</div>
//               </div>
//             ))} */}
//             <RewordList rewordkey="mass_award_list_model2" />
//           </div>
//           <div className="mass-election-action" onClick={_onClose} />
//         </div>
//         <span className="modal-btn-close" onClick={_onClose} />
//       </div>
//     </div>
//   );
// };

