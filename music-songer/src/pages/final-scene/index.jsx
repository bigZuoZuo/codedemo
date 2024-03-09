import React, { useCallback } from "react";
import BannerFinal from "@src/components/banner/finalbanner";
import CommonPannel from "@src/components/common-pannel";
import { postSubscribeScene } from "@src/services";
import { toast } from "@src/system";
import native from "@src/lib/native";
import {
  BottomBg
} from "@src/components/banner/links";
import {FinalGift} from "@src/pages/rule2/index"

import "./index.scoped.css";
import imgTransferEntry from "./images/img-transfer-entry.png";
import imgIntro from "./images/intro.png";

const singer_list = [
  { no: 1, belong: "小星星", name: "《晚婚》" },
  { no: 2, belong: "山民", name: "《当我要走的时候》" },
  { no: 3, belong: "泥芊", name: "《奇迹再现》" },
  { no: 4, belong: "小得意", name: "《没有人不比我快乐》" },
  { no: 5, belong: "热搜FM.万一", name: "《呼吸决定》" },
  { no: 6, belong: "虎大", name: "《变废为宝》" },
  { no: 7, belong: "简丹小仙女", name: "《伯虎说》" },
  { no: 8, belong: "小腻Zn", name: "《梦一场》" },
  { no: 9, belong: "top北夜", name: "《我管你》" },
  { no: 10, belong: "tg林夕夕", name: "《起风了》" },
];

const shouldShowDetail = () => new Date("2022/03/16 18:55").getTime() - Date.now() <= 0;

const FinalScenePage = () => {
  const _onSubmit = useCallback(() => {
    try {
      postSubscribeScene();
      toast("预约成功");
    } catch (err) {
      console.log("%c err", "background: red", err);
    }
  }, []);

  const _toRoom = useCallback(() => {
    native.NativeOpenRoom(117325317);
  }, []);

  const showDetail = shouldShowDetail();

  return (
    <div className="final-scene-page">
      <BannerFinal rule>
        <img className="one" src={imgIntro} alt="" />
        <img className="two" src={imgIntro} alt="" />
      </BannerFinal>
      {showDetail && (
        <>
          <CommonPannel title="房间传送门" column>
            <div className="transfer-entry" onClick={_toRoom}>
              <img src={imgTransferEntry} alt="" />
            </div>
            {/* <div className="transfer-desc">
              8月8日起， 展示该【 房间传送门
              】入口，用户点击跳转至对应房间。未到17:55，不展示【
              房间传送门入口 】
            </div> */}
          </CommonPannel>
          <div style={{ marginTop: "32px" }} />
        </>
      )}
      <CommonPannel title="十佳歌手比赛节目单" column shadow grade>
        {singer_list.map((item) => (
          <div key={item.name} className="song-item">
            <span className="song-item-no">{item.no}</span>
            <div className="song-item-name">{item.name}</div>
            <div className="song-item-belong">{item.belong}</div>
          </div>
        ))}
        <div className="look-more">还有更多惊喜曲目，来现场一听为快吧～</div>
        <div className="btn-appointment" onClick={_onSubmit} />
      </CommonPannel>
      <div style={{ marginTop: "32px" }} />
      <CommonPannel title="现场福利">
        <FinalGift />
      </CommonPannel>
      <BottomBg />
    </div>
  );
};

export default FinalScenePage;
