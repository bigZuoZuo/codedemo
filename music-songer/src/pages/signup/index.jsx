import React, { useCallback } from "react";
import System from "@src/system";
import { toast } from "@src/system";
import copy from "copy-to-clipboard";
import imgPC from "@src/assets/images/pc.png";
import { useUserinfoState } from "@src/hooks";
import native from "@src/lib/native";
import { isInApp } from "@src/system";

import "./index.scoped.css";

const SingupPage = () => {
  const target = `https://page.iambanban.com/singer2022/upload?token=${
    System.token
  }&uid=${System.uid}&server_env=${System.server_env}`;
  // 报名状态 0 立即报名（包括被拒绝） 1 审核中 2 报名成功
  const userInfoState = useUserinfoState();
  console.log(userInfoState);
  const onCopy = useCallback(() => {
    copy(target);
    toast("已复制，请在pc打开该链接");
  }, []);

  const _onClick = useCallback(() => {
    isInApp ? native.NativeNavigateBack() : window.history.back(-1);
  }, []);

  return (
    <div className="singup-page">
      <div className="header-normal">
        <i onClick={_onClick} />
        <span> 作品上传</span>
      </div>
      <img src={imgPC} alt="" className="pc" />
      <div className="link" onClick={onCopy}>
        {target}
      </div>
      <div className="tips" onClick={onCopy}>
        tips：点击链接复制
      </div>
      <p className="desc">
        打开PC电脑浏览器，输入上述地址
        {/* <br />
          完成作品信息并上传 */}
      </p>
      {/* <p className="tips">格式：MP3，大小不超过20M</p> */}
      <div className="copy">
        {
          {
            0: "立即报名",
            1: "审核中",
            2: "报名成功",
          }[userInfoState.signupStatus]
        }
      </div>
    </div>
  );
};

export default SingupPage;

// import React, { useCallback } from "react";
// import Banner from "@src/components/banner";
// import CommonPannel from "@src/components/common-pannel";
// import System from "@src/system";
// import { toast } from "@src/system";
// import copy from "copy-to-clipboard";
// import imgPC from "@src/assets/images/pc.png";
// import { BannerLinkRule } from "@src/components/banner/links";

// import "./index.scoped.css";

// const SingupPage = () => {
//   const target = `https://page.iambanban.com/pigeon-singer/upload?token=${
//     System.token
//   }&uid=${System.uid}&server_env=${System.server_env}`;

//   const onCopy = useCallback(() => {
//     copy(target);
//     toast("已复制，请在pc打开该链接");
//   }, []);

//   return (
//     <div className="singup-page">
//       <Banner>
//         <BannerLinkRule />
//       </Banner>
//       <CommonPannel title="报名参赛">
//         <img src={imgPC} alt="" className="pc" />
//         <div className="link" onClick={onCopy}>
//           {target}
//         </div>
//         <p className="tips" style={{ margin: "0px auto 10px auto" }}>
//           tips：该链接仅供自己报名，不可外传哦～
//         </p>
//         <p className="desc">
//           打开PC电脑浏览器，输入上述地址
//           <br />
//           完成作品信息并上传
//         </p>
//         <p className="tips">格式：MP3，大小不超过20M</p>
//         <button className="copy" onClick={onCopy}>
//           复制链接
//         </button>
//       </CommonPannel>
//     </div>
//   );
// };

// export default SingupPage;
