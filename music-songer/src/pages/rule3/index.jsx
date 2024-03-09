import React, { useEffect } from "react";
import Banner from "@src/components/banner/index";
import CommonPannel from "@src/components/common-pannel";
import "./index.scoped.css";
import { BottomBg } from "@src/components/banner/links";

const Home = () => {
  // const playerState = usePlayerState();

  useEffect(() => {}, []);

  return (
    <div className="rule3-page">
      <Banner />
      <CommonPannel title="榜单合集" fixedbottom>
        <h6 class="new-title">歌神榜</h6>
        <table>
          <tbody>
            <tr>
              <td>名次</td>
              <td colSpan={2}>奖励</td>
            </tr>

            <tr>
              <td rowSpan={5}>冠军</td>
              {/* <td colSpan={2}>35%钻石奖池</td> */}
            </tr>
            <tr>
              <td colSpan={2}>定制单曲发行*1首</td>
            </tr>
            <tr>
              <td colSpan={2}>歌手靓号：55555</td>
            </tr>
            <tr>
              <td>冠军荣誉道具套装*30天</td>
              <td className="width_nowrap">
                荣耀歌手-勋章
                <br />
                荣耀歌手-头像框
                <br />
                荣耀歌手-座驾
                <br />
                荣耀歌手-聊天气泡
                <br />
                荣耀歌手-主页装扮
                <br />
                荣耀歌手-入场特效
                <br />
                冠军歌手-头像框
                <br />
                冠军歌手-主页装扮
              </td>
            </tr>
            <tr>
              <td colSpan={2}>单曲收录*30天</td>
            </tr>
            <tr>
              <td rowSpan={3}>亚军</td>
              {/* <td colSpan={2}>20%钻石奖池</td> */}
            </tr>
            <tr>
              <td>亚军荣誉道具套装*30天</td>
              <td className="width_nowrap">
                荣耀歌手-勋章
                <br />
                荣耀歌手-头像框
                <br />
                荣耀歌手-座驾
                <br />
                荣耀歌手-聊天气泡
                <br />
                荣耀歌手-主页装扮
                <br />
                荣耀歌手-入场特效
                <br />
                亚军歌手-头像框
                <br />
                亚军歌手-主页装扮
              </td>
            </tr>
            <tr>
              <td colSpan={2}>单曲收录*30天</td>
            </tr>
            <tr>
              <td rowSpan={3}>季军</td>
              {/* <td colSpan={2}>10%钻石奖池</td> */}
            </tr>
            <tr>
              <td>季军荣誉道具套装*30天</td>
              <td className="width_nowrap">
                荣耀歌手-勋章
                <br />
                荣耀歌手-头像框
                <br />
                荣耀歌手-座驾
                <br />
                荣耀歌手-聊天气泡
                <br />
                荣耀歌手-主页装扮
                <br />
                荣耀歌手-入场特效
                <br />
                季军歌手-头像框
                <br />
                季军歌手-主页装扮
              </td>
            </tr>
            <tr>
              <td colSpan={2}>单曲收录*30天</td>
            </tr>
            <tr>
              <td rowSpan={3}>第4-10名</td>
              <td colSpan={2}>糖果飞船（520元）*1</td>
            </tr>
            <tr>
              <td>歌手荣誉道具套装*10天</td>
              <td className="width_nowrap">
                荣耀歌手-勋章
                <br />
                荣耀歌手-头像框
                <br />
                荣耀歌手-座驾
                <br />
                荣耀歌手-聊天气泡
                <br />
                荣耀歌手-主页装扮
                <br />
                荣耀歌手-入场特效
              </td>
            </tr>
            <tr>
              <td colSpan={2}>单曲收录*30天</td>
            </tr>
            <tr>
              <td rowSpan={3}>第11-25名</td>
            </tr>
            <tr>
              <td>歌手荣誉道具套装*7天</td>
              <td className="width_nowrap">
                荣耀歌手-勋章
                <br />
                荣耀歌手-头像框
                <br />
                荣耀歌手-座驾
                <br />
                荣耀歌手-聊天气泡
                <br />
                荣耀歌手-主页装扮
                <br />
                荣耀歌手-入场特效
              </td>
            </tr>
            <tr>
              <td colSpan={2}>单曲收录*30天</td>
            </tr>
            <tr>
              <td rowSpan={3}>第26-80名</td>
            </tr>
            <tr>
              <td>歌手荣誉道具套装*3天</td>
              <td className="width_nowrap">
                荣耀歌手-勋章
                <br />
                荣耀歌手-头像框
                <br />
                荣耀歌手-座驾
                <br />
                荣耀歌手-聊天气泡
                <br />
                荣耀歌手-主页装扮
                <br />
                荣耀歌手-入场特效
              </td>
            </tr>
            <tr>
              <td colSpan={2}>单曲收录*30天</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: "32px" }} />
        <h6 class="new-title">人气榜</h6>
        <table>
          <tbody>
            <tr>
              <td rowSpan={8}>新增应援人数</td>
              <td>日榜TOP1</td>
              <td>5千票</td>
            </tr>
            <tr>
              <td>日榜TOP2</td>
              <td>3千票</td>
            </tr>
            <tr>
              <td>日榜TOP3</td>
              <td>1千票</td>
            </tr>
            <tr>
              <td rowSpan={2}>总榜TOP1</td>
              <td>歌手靓号：五位数</td>
            </tr>
            <tr>
              <td>可盐可甜麦上光圈*30天</td>
            </tr>
            <tr>
              <td>总榜TOP2</td>
              <td>可盐可甜麦上光圈*30天</td>
            </tr>
            <tr>
              <td>总榜TOP3</td>
              <td>可盐可甜麦上光圈*15天</td>
            </tr>
            <tr>
              <td>总榜TOP4-10</td>
              <td>可盐可甜麦上光圈*7天</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: "32px" }} />
        <h6 class="new-title">应援榜</h6>
        <p className="li2-rule-new">
          应援榜单：根据用户在活动期间送出的应援票数量排序
        </p>
        <table>
          <tbody>
            <tr>
              <td rowSpan={8}>应援榜单</td>
              <td rowSpan={4}>第1-10名</td>
              <td>均分5%钻石奖池</td>
            </tr>
            <tr>
              <td>
                个人靓号：五位数
                <br />
                （仅第一名获得）
              </td>
            </tr>
            <tr>
              <td>应援套装*15天</td>
            </tr>
            <tr>
              <td>经纪人-麦上光圈*15天</td>
            </tr>
            <tr>
              <td rowSpan={2}>第11-1000名</td>
              <td>应援套装*10天</td>
            </tr>
            <tr>
              <td>均分10%钻石奖池</td>
            </tr>
            <tr>
              <td rowSpan={2}>第1000名及以上</td>
              <td>应援套装*7天</td>
            </tr>
            <tr>
              <td>均分10%钻石奖池</td>
            </tr>
          </tbody>
        </table>
        <p className="li2-rule-new">
          应援套装包括：cpdd系列的头像框、主页装扮、入场特效、聊天气泡
        </p>
      </CommonPannel>
      <BottomBg />
    </div>
  );
};

export default Home;
