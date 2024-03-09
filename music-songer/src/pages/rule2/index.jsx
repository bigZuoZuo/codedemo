import Finalbanner from "@src/components/banner/finalbanner";
import CommonPannel from "@src/components/common-pannel/index";
import React from "react";
import "./rule2.scoped.css";

import imgRoomHot from "@src/assets/images/img-room-hot.png";
import imgSweetheart from "@src/assets/images/img-sweetheart.png";
import imgHobbyhorse from "@src/assets/images/img-hobbyhorse.png";
import { BottomBg } from "@src/components/banner/links";

export default function Rule2() {
  return (
    <div className="rule2-page">
      <Finalbanner/>
      <CommonPannel title="活动时间">
        <p className="intro">活动时间：3月16日  19:00 - 21:00</p>
        <p className="intro">
          活动地点： 
          <span>官厅</span>
          117325317
        </p>
      </CommonPannel>
      <div className="placeholder" />
      <CommonPannel title="活动概述">
        <p className="p2">
          1）《伴伴最强音》伴伴十强歌手现场公演赛。3月14日12：00-3月15日12：00期间，根据歌神榜单票数排名：前10歌手可获得3月16日公演赛现场拉票资格
        </p>
        <p className="p2">
          2）3月16日晚19:00-21:00，举行现场公演赛。歌手参与现场赛获得的成绩可在《伴伴最强音》活动总榜单中加成应援票。
        </p>
        <p className="p2">
          3）3月14日12:00:00-3月16日23:59，《伴伴最强音》top前25位歌手将根据歌神榜单票数决出冠、亚、季军
        </p>
      </CommonPannel>
      <div className="placeholder" />
      <CommonPannel title="现场赛活动规则">
        <p className="p1" data-index="1">
          积分方式：
        </p>
        <table>
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "24%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>公演赛</th>
              <th>比赛形式</th>
              <th>评委分</th>
              <th>人气分</th>
              <th>魅力分</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  color: "#8DF1FA",
                }}
              >
                10强歌手
              </td>
              <td>10强歌手5人为一组分为2组，每组根据总分末尾淘汰3位</td>
              <td>10,  9,  8,  7,  6</td>
              <td>9,  8,  7,  6，5</td>
              <td>8， 7， 6 ,  5 ,  4</td>
            </tr>
            <tr>
              <td
                style={{
                  color: "#8DF1FA",
                }}
              >
                4强歌手
              </td>
              <td>分为一组上麦演唱 按照总分，末尾淘汰1位歌手</td>
              <td>10,  9,  8,  7 </td>
              <td>9,  8,  7,  6</td>
              <td>8， 7， 6 ,  5</td>
            </tr>
            <tr>
              <td
                style={{
                  color: "#8DF1FA",
                }}
              >
                3强歌手
              </td>
              <td>分为一组上麦演唱 按照总分，决出公演赛前3名</td>
              <td>10,  9,  8</td>
              <td>9,  8,  7</td>
              <td>8， 7， 6</td>
            </tr>
            <tr>
              <td colSpan="5" style={{ color: "#F7B8FF" }}>
                积分方式：比赛期间，总分=人气分+魅力分；若总分数一致，根据人气分排序
              </td>
            </tr>
          </tbody>
        </table>
        <p className="p2">总积分和人气分都相同，按照礼物分排名。</p>
        <p className="p3">
          评委分根据麦上心动值高低依次为：10分，9分，8分，7分，6分；
        </p>
        <p className="p3">
          人气分根据麦上心动值高低依次为：9分，8分，7分，6分，5分；
        </p>
        <p className="p3">
          魅力分根据用户投票数高低依次分为：8 分，7分，6分，5分 ，4分；
        </p>
        <p className="p3">歌手总积分最高是 27 分。</p>
        <p className="p1" data-index="2">
          比赛要求
        </p>
        <p className="p2">
          活动歌手榜单前十歌手至少自备3首歌曲。 若在麦上表演时未完成单曲演唱，视为自动弃权。取消参赛资格。
        </p>
      </CommonPannel>
      <div className="placeholder" />
      <CommonPannel title="现场赛活动奖励">
        <FinalGift/>
      </CommonPannel>
      <BottomBg />
    </div>
  );
}

export function FinalGift (){
  return (
    <div>
      <p className="p1" data-index="1">
        现场公演赛top3奖励：
      </p>
      <p className="p2 tips">（按照公演赛期间总分排序 ）</p>
      <p className="p2">第一名：10万应援票、supreme周边礼盒*2</p>
      <p className="p2">第二名：5万应援票、supreme周边礼盒*2</p>
      <p className="p2">第三名：3万应援票、supreme周边礼盒*2</p>
      <div className="awards">
        <div className="award">
          <div className="icon">
            <img src={imgSweetheart} alt="" />
          </div>
          <span className="name">时空恋人</span>
        </div>
        <div className="award">
          <div className="icon">
            <img src={imgRoomHot} alt="" />
          </div>
          <span className="name">房间热度卡</span>
        </div>
        <div className="award">
          <div className="icon">
            <img src={imgHobbyhorse} alt="" />
          </div>
          <span className="name">童话木马</span>
        </div>
      </div>
      <p className="p2">
        公演期间收到钻石打赏最多的选手奖励：时空恋人*1（9999元）、房间热度卡(10000*15天)
      </p>
      <p className="p2">
        公演期间获得打赏人数（非金币礼物）最多的选手奖励：童话木马*1（1314元）、房间热度卡(10000*15天）
      </p>
      <p className="p2 tips">Tips：公演期间时间为3月16日  19:00 - 21:00</p>
      <p className="p1" data-index="2">
        决赛抽奖券抽奖
      </p>
      <p className="p2">
        用户通过在活动页面歌参赛选手赠票获得决赛抽奖券。该抽奖券可在3月16日开展的歌手公演赛现场幸运开奖（共8名幸运用户）。
      </p>
      <table className="table2">
        <thead>
          <tr>
            <th colSpan="2">歌手公演赛现场抽奖奖励</th>
            <th>个数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>一等奖</td>
            <td>浪漫星河礼物（价值1314元）*3</td>
            <td>1个</td>
          </tr>
          <tr>
            <td>二等奖</td>
            <td>深入你心礼物（价值520元）*2</td>
            <td>1个</td>
          </tr>
          <tr>
            <td>三等奖</td>
            <td>求抱抱（价值52元）*1</td>
            <td>6个</td>
          </tr>
        </tbody>
      </table>
      <p className="p2 tips"> Tips：现场还有神秘红包雨奖励哦~</p>
    </div>
  );
}