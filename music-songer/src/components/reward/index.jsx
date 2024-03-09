
import React from "react";
// import { observer, useLocalStore } from "mobx-react";

import './index.scoped.css'
import imgIphone from "@src/assets/images/img-iphone.jpg";
import imgAirpods from "@src/assets/images/img-airpods.jpg";
import imgSideGift from "@src/assets/images/img-side-gift.png";
import imgSupportTicket from "@src/assets/images/img-support-ticket.png";
import imgRoomHot from "@src/assets/images/img-room-hot.png";
import imgSweetheart from "@src/assets/images/img-sweetheart.png";
import imgHobbyhorse from "@src/assets/images/img-hobbyhorse.png";
import imgCircleBubble from "@src/assets/images/img-bubble.png";
import imgCircle1 from "@src/assets/images/img-circle1.png";
import imgMedal from "@src/assets/images/img-medal.png";
import imgAlbum from "@src/assets/images/img-album.png";
import imgDiamondPool from "@src/assets/images/img-diamond-pool.png";
import imgNumber from "@src/assets/images/img-number.png";
import imgChampion from "@src/assets/reword-entry1.png";
import imgGift from "@src/assets/images/img-gift.png";
import imgHot from "@src/assets/images/img-hot.png";

import imgMassElection1 from "@src/assets/images/imgMassElection1.png";
import imgMassElection2 from "@src/assets/images/imgMassElection2.png";
import imgMassElection3 from "@src/assets/images/imgMassElection3.png";

import imgtimelimit1 from "@src/assets/images/imgtimelimit1.png";
import imgtimelimit2 from "@src/assets/images/imgtimelimit2.png";

import img21211 from "@src/assets/images/img21211.png";
import fishGift3 from "@src/assets/images/img-bao.png";

const mass_election_match_list = [
  {
    icon: imgMassElection1,
    name: "荣耀歌手<br/>主页装扮",
    num: "5天",
  },
  {
    icon: imgMassElection2,
    name: "荣耀歌手<br/>聊天气泡",
    num: "5天",
  },
  {
    icon: imgMassElection3,
    name: "荣耀歌手<br/>头像框",
    num: "5天",
  },
];

const finalscene1 = [
  {
    icon: imgIphone,
    name: "iPhone12 Pro Max",
    num: "一等奖",
  },
  {
    icon: imgAirpods,
    name: "airPods",
    num: "二等奖",
  },
  {
    icon: imgSideGift,
    name: "伴伴周边3个",
    num: "三等奖",
  },
];

const finalscene2 = [
  {
    icon: imgSupportTicket,
    name: "应援票",
  },
  {
    icon: imgSideGift,
    name: "伴伴周边",
  },
  {
    icon: imgSweetheart,
    name: "时空恋人",
  },
  {
    icon: imgRoomHot,
    name: "房间热度卡",
  },
  {
    icon: imgHobbyhorse,
    name: "童话木马",
  },
];

const time_limit = [
  { icon: imgtimelimit1, name: "宝藏-头像框", num: "1天" },
  { icon: imgtimelimit2, name: "深入你心" },
];

const mass_award_list_model1 = [
  { icon: imgCircleBubble, name: "明星歌手勋章 <br/>(发放至比赛结束日)" },
  { icon: imgCircle1, name: "聊天气泡*5天" },
  { icon: imgMedal, name: "头像框*5天" },
];

const mass_award_list_model2 = [
  { icon: imgSupportTicket, name: "官方赠票*10000" },
  { icon: imgSupportTicket, name: "官方赠票*5000" },
  { icon: imgSupportTicket, name: "官方赠票*3000" },
];

const entrypage = [
  {
    icon: imgDiamondPool,
    name: "巨额钻石奖池",
  },
  {
    icon: imgChampion,
    name: "短视频ip孵化",
    scale: 9,
  },
  {
    icon: imgAlbum,
    name: "定制单曲发行",
    scale: 6,
  },
  {
    icon: imgNumber,
    name: "个人靓号",
    extra: "5555",
    scale: 9,
  },
  {
    icon: imgGift,
    name: "限定礼物",
  },
  {
    icon: imgHot,
    name: "热度推荐",
    scale: 6,
  },
];

const fishGift = [
  {
    icon: img21211,
    name: "浪漫星河*3<br/>（价值3942元）",
    num: "1个",
  },
  {
    icon: imgtimelimit2,
    name: "深入你心*2<br/>（价值1040元）",
    num: "1个",
  },
  {
    icon: fishGift3,
    name: "求抱抱*1<br/>（价值52元）",
    num: "6个",
  },
];

const RewordList = (props) => {
  return (
    <div className="reward">
      {props.rewordkey === "mass" &&
        mass_election_match_list.map((it) => (
          <div className="module" key={it.name}>
            <div className="contain-img">
              <img className={`scale${it.scale}`} src={it.icon} alt="" />
              {it.num && <i>{it.num}</i>}
            </div>
            <span dangerouslySetInnerHTML={{ __html: it.name }} />
          </div>
        ))}
      {props.rewordkey === "final_scene1" &&
        finalscene1.map((it) => (
          <div className="module" key={it.name}>
            <div className="contain-img">
              <img className={`scale${it.scale}`} src={it.icon} alt="" />
              {it.num && <i>{it.num}</i>}
            </div>
            <span dangerouslySetInnerHTML={{ __html: it.name }} />
          </div>
        ))}
      {props.rewordkey === "final_scene2" &&
        finalscene2.map((it) => (
          <div className="module" key={it.name}>
            <div className="contain-img">
              <img className={`scale${it.scale}`} src={it.icon} alt="" />
              {it.num && <i>{it.num}</i>}
            </div>
            <span dangerouslySetInnerHTML={{ __html: it.name }} />
          </div>
        ))}
      {props.rewordkey === "time_limit" &&
        time_limit.map((it) => (
          <div className="module" key={it.name}>
            <div className="contain-img">
              <img className={`scale${it.scale}`} src={it.icon} alt="" />
              {it.num && <i>{it.num}</i>}
            </div>
            <span dangerouslySetInnerHTML={{ __html: it.name }} />
          </div>
        ))}
      {props.rewordkey === "mass_award_list_model1" &&
        mass_award_list_model1.map((it) => (
          <div className="module" key={it.name}>
            <div className="contain-img">
              <img className={`scale${it.scale}`} src={it.icon} alt="" />
              {it.num && <i>{it.num}</i>}
            </div>
            <span
              className="little-name"
              dangerouslySetInnerHTML={{ __html: it.name }}
            />
          </div>
        ))}
      {props.rewordkey === "mass_award_list_model2" &&
        mass_award_list_model2.map((it) => (
          <div className="module" key={it.name}>
            <div className="contain-img">
              <img className={`scale${it.scale}`} src={it.icon} alt="" />
              {it.num && <i>{it.num}</i>}
            </div>
            <span
              className="little-name"
              dangerouslySetInnerHTML={{ __html: it.name }}
            />
          </div>
        ))}
      {props.rewordkey === "entrypage" &&
        entrypage.map((it) => (
          <div className="module" key={it.name}>
            <div className="contain-img">
              <img className={`scale${it.scale}`} src={it.icon} alt="" />
              {it.num && <i>{it.num}</i>}
            </div>
            <span
              className="little-name"
              dangerouslySetInnerHTML={{ __html: it.name }}
            />
          </div>
        ))}
      {props.rewordkey === "fish" &&
        fishGift.map((it) => (
          <div className="module" key={it.name}>
            <div className="contain-img">
              <img className={`scale${it.scale}`} src={it.icon} alt="" />
              {it.num && <i>{it.num}</i>}
            </div>
            <span
              className="little-name"
              dangerouslySetInnerHTML={{ __html: it.name }}
            />
          </div>
        ))}
    </div>
  );
};


export default RewordList;