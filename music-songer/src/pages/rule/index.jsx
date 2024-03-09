import Banner from "@src/components/banner/index";
import CommonPannel from "@src/components/common-pannel/index";
import React from "react";
import clsx from "clsx";

import {
  NavLink,
  Redirect,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import "./rule.scoped.css";
import { BottomBg } from "@src/components/banner/links";

export default function Rule() {
  let { path } = useRouteMatch();

  return (
    <div className="rule1-page">
      <Banner />
      <div className="nav-links">
        <NavLink
          to={`${path}/competition`}
          className="nav-link"
          activeClassName="active"
          replace
        >
          参赛规则
        </NavLink>
        <NavLink
          to={`${path}/diamond`}
          className="nav-link"
          activeClassName="active"
          replace
        >
          钻石瓜分
        </NavLink>
        <NavLink
          to={`${path}/luckydraw`}
          className="nav-link"
          activeClassName="active"
          replace
        >
          幸运抽奖
        </NavLink>
      </div>
      <Switch>
        <Redirect from={path} to={`${path}/competition`} exact />
        <Route path={`${path}/competition`} component={Competition} />
        <Route path={`${path}/diamond`} component={Diamond} />
        <Route path={`${path}/luckydraw`} component={Luckydraw} />
      </Switch>
      <BottomBg />
    </div>
  );
}

function Competition() {
  return (
    <div className="competition">
      <CommonPannel title="积分方式">
        <p className="li1-new">A、活动页面付费投票：100钻=3票</p>
        <p className="li1-new">B、官方赠票</p>
        <p className="li2-new">1）在聊天室给参赛选手送礼物，100钻=1票</p>
        <p className="li2-new">
          2）新增应援人数、各赛段奖励、pk奖励等规则中含有官方赠票
        </p>
      </CommonPannel>
      <br />
      <br />
      <CommonPannel title="各赛段活动规则">
        <AuditionRule />
        <br />
        <PromotionRule />
        <br />
        <HalfFinalRule />
        <br />
        <FinalRule />
      </CommonPannel>
      <br />
      <br />
      <CommonPannel title="规则说明">
        <RuleExplain />
      </CommonPannel>
    </div>
  );
}

export function DiamondRule(props) {
  return (
    <>
      <div className={clsx(props.path ? "title-sea" : "title-new")}>
        钻石瓜分
      </div>
      <p className="li2-rule-new ">
        瓜分规则：当前用户总投票达到300万应援票可瓜分；如未达到，不予瓜分。
      </p>
      <div className={clsx(props.path ? "title-sea" : "title-new")}>奖池</div>
      <p className="li2-rule-new">钻石奖池金额由活动页面总投票数决定</p>
      <p className="li2-rule-new">活动页面总投票数：奖池钻石数量=3：10</p>
      <br />
      <p className="li2-rule-new">A、歌手可参与瓜分：</p>
      <p className="li2-rule-new">海选赛票数第一 2%奖池</p>
      <p className="li2-rule-new">晋级赛票数第一 3%奖池</p>
      <p className="li2-rule-new">半决赛票数第一 5%奖池</p>
      <p className="li2-rule-new">决赛票数第一 35%奖池 </p>
      <p className="li2-rule-new">决赛赛票数第二 20%奖池 </p>
      <p className="li2-rule-new">决赛票数第三 10%奖池  </p>
      <br />
      <p className="li2-rule-new">B、在页面付费投票用户参与瓜分：</p>
      <p className="li2-rule-new">前1000名：按照用户的榜单名次瓜分钻石奖池</p>
      <p className="li2-rule-new">后1000名：均分</p>
      <p className="li2-rule-new">应援榜第1-10         均分5%奖池</p>
      <p className="li2-rule-new">应援榜第11-1000    均分10%奖池</p>
      <p className="li2-rule-new">应援榜1000以上       均分10%奖池</p>
      <p className="li2-rule-new">
        tips：钻石将在活动结束后1个工作日内发放到用户账户中。
      </p>
    </>
  );
}

export function Diamond(props) {
  return (
    <div className="competition">
      <CommonPannel title="钻石瓜分">
        <DiamondRule />
      </CommonPannel>
    </div>
  );
}

function Luckydraw() {
  return (
    <div className="competition">
      <CommonPannel title="幸运星冰乐">
        <p className="li2-rule-new">
          幸运币获取方式：在活动页面付费投票，每投出9应援票可获得1枚幸运币
        </p>
        <p className="li2-rule-new">幸运币仅在活动期间有效，过期则会失效</p>
        {/* <p className="li2-rule-new">盲盒配置：</p> */}
        <table>
          <thead>
            <tr>
              <th>奖励名称</th>
              <th>概率</th>
              <th>单位</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>月球之恋-戒指</td>
              <td>0.005%</td>
              <td>1个</td>
            </tr>
            <tr>
              <td>一见倾心-头像框</td>
              <td>28%</td>
              <td>1小时</td>
            </tr>
            <tr>
              <td>一见倾心-聊天气泡</td>
              <td>30%</td>
              <td>1小时</td>
            </tr>
            <tr>
              <td>一见倾心-座驾</td>
              <td>10%</td>
              <td>1小时</td>
            </tr>
            <tr>
              <td>一见倾心-入场特效</td>
              <td>5%</td>
              <td>1天</td>
            </tr>
            <tr>
              <td>一见倾心-主页装扮</td>
              <td>5%</td>
              <td>1天</td>
            </tr>
            <tr>
              <td>一见倾心-麦上光圈</td>
              <td>1%</td>
              <td>1天</td>
            </tr>
            <tr>
              <td>蝶恋花-戒指</td>
              <td>0.05%</td>
              <td>1个</td>
            </tr>
            <tr>
              <td>c位出道3元</td>
              <td>0.93%</td>
              <td>1个</td>
            </tr>
            <tr>
              <td>恋爱物语188元</td>
              <td>0.01%</td>
              <td>3个</td>
            </tr>
            <tr>
              <td>浪漫星河1314元</td>
              <td>0.005%</td>
              <td>1个</td>
            </tr>
            <tr>
              <td>谢谢参与</td>
              <td>20%</td>
              <td />
            </tr>
          </tbody>
        </table>
        <br />
        <p className="li2-rule-new">其中:</p>
        <table>
          <thead>
            <tr>
              <th>礼物</th>
              <th>应援票加权</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>c位出道*1</td>
              <td>送出后歌手可获得10*应援票加成</td>
            </tr>
            <tr>
              <td>恋爱物语*1</td>
              <td>送出后歌手可获得700*应援票加成</td>
            </tr>
            <tr>
              <td>浪漫星河*1</td>
              <td>送出后歌手可获得5000*应援票加成</td>
            </tr>
          </tbody>
        </table>
      </CommonPannel>
      <br />
      <SecretGift />
    </div>
  );
}

function SecretGift() {
  return (
    <div className="competition">
      <CommonPannel title="神秘礼盒">
        <p className="li2-rule-new">
          用户在活动页面投票，有机会触发神秘礼盒哦～
        </p>
        <p className="li2-rule-new">
          触发礼盒条件：每日在活动页投出30票后解锁，每人每日仅可购买一次，礼盒价格为：52000钻石。
        </p>
        <br />
        <p className="li2-rule-new">深入你心礼物（价值520元）*1</p>
        <p className="li2-rule-new">礼盒内容：宝藏-头像框*1天</p>
        <p className="li2-rule-new">
          新礼物：深入你心（520元），在聊天室给参赛歌手送出1个深入你心礼物可获得2000应援票加成哦～
        </p>
      </CommonPannel>
    </div>
  );
}

// 海选赛
export function AuditionRule(props) {
  return (
    <React.Fragment>
      <div>
        {props.path !== "entry" && props.path !== "modal" && (
          <div className="title-new">1、海选赛</div>
        )}
        <p className="li2-rule-new">
          （3月4日12:00:00-3月7日12:00:00）n进200
        </p>
        <p className="li2-rule-new mgt10">
          获得应援票数（页面投票+官方赠票）各榜单最高的前50名选手进入晋级赛
        </p>

        <p className="li2-rule-new mgt10">1）海选赛官方赠票奖励</p>
        <p className="li2-rule-new">
          每日新增应援人数前3名分别获得官方赠票：
        </p>
        <table>
          <tbody>
            <tr>
              <td>新增应援人数</td>
              <td>奖励</td>
            </tr>
            <tr>
              <td>每日第一名</td>
              <td>5000*应援票</td>
            </tr>
            <tr>
              <td>每日第二名</td>
              <td>3000*应援票</td>
            </tr>
            <tr>
              <td>每日第三名</td>
              <td>1000*应援票</td>
            </tr>
          </tbody>
        </table>

        <p className="li2-rule-new">2）海选赛期间歌手收到应援票奖励</p>

        <table>
          <tbody>
            <tr>
              <td>歌手收到应援票</td>
              <td>奖励</td>
            </tr>
            <tr>
              <td>300票</td>
              <td>荣耀歌手-主页装扮*5天</td>
            </tr>
            <tr>
              <td>12000票</td>
              <td>荣耀歌手-聊天气泡*5天</td>
            </tr>
            <tr>
              <td>30000票</td>
              <td>荣耀歌手-头像框*5天</td>
            </tr>
          </tbody>
        </table>

        <p className="li2-rule-new">3）海选赛奖励</p>
        <p className="li2-rule-new">海选总榜第一名可获得：钻石奖池瓜分：2%</p>
        <p className="li2-rule-new">各赛道 官方赠票</p>
        <table>
          <tbody>
            <tr>
              <td>海选总榜</td>
              <td>奖励</td>
            </tr>
            <tr>
              <td>第一名</td>
              <td>10000*应援票</td>
            </tr>
            <tr>
              <td>第二名</td>
              <td>5000*应援票</td>
            </tr>
            <tr>
              <td>第三名</td>
              <td>3000*应援票</td>
            </tr>
          </tbody>
        </table>
        <p className="li2-rule-new">tips：官方赠票将会计入到晋级赛中。</p>
      </div>
    </React.Fragment>
  );
}

// 晋级赛
export function PromotionRule(props) {
  return (
    <React.Fragment>
      {props.path !== "entry" && props.path !== "modal" && (
        <div className="title-new">2、晋级赛</div>
      )}
      <p className="li1-rule-new">
        （3月7日12:00:00-3月10日12:00:00）200进80
      </p>
      <p className="li2-rule-new mgt10">
        1）票数清0，采取跨赛道1v1pk掠夺票数机制
        <br />
        根据各赛道榜单，每日淘汰每组末尾10名选手
      </p>
      <br />
      <p className="li2-rule-new">
        2）开启时间：晋级赛期间
        <br />
        每晚19:00-23:00期间每个整点开启30分钟pk；每天共计4场pk
      </p>
      <p className="li2-rule-new mgt10">
        第一场pk时间：19:00-19:30
        <br />
        第二场pk时间：20:00-20:30
        <br />
        第三场pk时间：21:00-21:30
        <br />
        第四场pk时间：22:00-22:30
      </p>
      <p className="li2-rule-new" style={{ marginTop: "18px" }}>
        3）<span className="">pk奖励：</span>
      </p>
      <table>
        <tbody>
          <tr>
            <td>pk获胜方</td>
            <td>PK失败方</td>
          </tr>
          <tr>
            <td>
              第一天
              <br />
              实时获得对方前一日
              <br />
              （海选最后一天）
              <br />
              票数的5%加成
            </td>
            <td rowSpan="3">不损失票数</td>
          </tr>
          <tr>
            <td>
              第二天
              <br />
              实时获得对方前一日
              <br />
              不损失票数
              <br />
              票数的5%加成
            </td>
          </tr>
          <tr>
            <td>
              第三天
              <br />
              实时获得对方前一日
              <br />
              不损失票数
              <br />
              票数的10%加成
            </td>
          </tr>
        </tbody>
      </table>
      <p className="li2-rule-new">Tips：当场pk结束，获胜方实时加上应援票。</p>
      <br />
      <p className="li2-rule-new">4）pk连胜奖励：</p>
      <table>
        <tbody>
          <tr>
            <td>连胜次数</td>
            <td>pk奖励</td>
          </tr>
          <tr>
            <td>4场</td>
            <td>5千票</td>
          </tr>
          <tr>
            <td>8场</td>
            <td>1万票</td>
          </tr>
          <tr>
            <td>12场</td>
            <td>3万票</td>
          </tr>
        </tbody>
      </table>
      <p className="li2-rule-new">
        tips：官方赠票将会计入到半决赛中。
        <br />
        晋级赛票数第一歌手奖励：3%钻石奖池
      </p>
      <br />
      <p className="li2-rule-new">5）人气日榜官方赠票奖励</p>
      <p className="li2-rule-new">每日新增应援人数前3名分别获得官方赠票：</p>
      <table>
        <tbody>
          <tr>
            <td>排名</td>
            <td>奖励</td>
          </tr>
          <tr>
            <td>每日第一名</td>
            <td>5k票</td>
          </tr>
          <tr>
            <td>每日第二名</td>
            <td>3k票</td>
          </tr>
          <tr>
            <td>每日第三名</td>
            <td>1k票</td>
          </tr>
        </tbody>
      </table>
    </React.Fragment>
  );
}

// 半决赛
export function HalfFinalRule(props) {
  return (
    <React.Fragment>
      {props.path !== "entry" && props.path !== "modal" && (
        <div className="title-new">3、半决赛</div>
      )}
      <p className="li2-rule-new">
        （3月10日14:00:00-3月14日12:00:00）80进25
      </p>
      <p className="li2-rule-new mgt10">
        1）票数清0，80进25，采取1v1pk淘汰制
      </p>
      <p className="li2-rule-new">
        开启时间：3月10日14:00:00-3月14日12:00:00
      </p>
      <p className="li2-rule-new mgt10">2）半决赛pk规则</p>
      <p className="li2-rule-new">
        <i className="dot">1</i>3月10日14:00-3月11日12:00
      </p>
      <p className="li2-rule-new">晋级的80名选手将随机配对一名对手进行pk</p>
      <p className="li2-rule-new">
        【40vs40】胜利继续留在胜者组，失败进入待定组
      </p>
      <p className="li2-rule-new">
        <i className="dot">2</i>3月11日14:00-3月12日12:00
      </p>
      <p className="li2-rule-new">
        胜者组的【20vs20】胜利继续留在胜者组，失败进入待定组。
      </p>
      <p className="li2-rule-new">
        12日待定组【20vs20】胜利继续留在待定组，失败则被淘汰
      </p>
      <p className="li2-rule-new">
        <i className="dot">3</i>3月12日14:00-3月13日12:00
      </p>
      <p className="li2-rule-new">
        胜者组的【10vs10】胜利者晋级决赛，失败进入待定组。
      </p>
      <p className="li2-rule-new">
        13日待定组【20vs20】胜利继续留在待定组，失败则被淘汰
      </p>
      <p className="li2-rule-new">
        <i className="dot">4</i>3月13日14:00-3月14日12:00
      </p>
      <p className="li2-rule-new">
        14日待定组【15vs15】胜利继续晋级决赛，失败则被淘汰
      </p>
      <br />
      <p className="li2-rule-new">3）pk奖励</p>
      <p className="li2-rule-new">
        每日pk期间流水奖励（聊天室收礼+页面投票收礼）：
      </p>
      <table>
        <tbody>
          <tr>
            <td>pk期间应援票达到</td>
            <td>奖励</td>
          </tr>
          <tr>
            <td>20万张应援票</td>
            <td>1万应援票</td>
          </tr>
          <tr>
            <td>35万张应援票</td>
            <td>2万应援票</td>
          </tr>
          <tr>
            <td>70万张应援票</td>
            <td>
              10万应援票+
              <br />
              恋爱物语礼物188元*28个
              <br />
              （每日库存1份，先到先得）
            </td>
          </tr>
        </tbody>
      </table>
      <p className="li2-rule-new">
        tips：每日获得应援票将计入决赛，若选手未晋级到决赛，则票数累积到总榜中
      </p>
      <br />
      <p className="li2-rule-new">4）半决赛票数第一名歌手奖励： 5%奖池 </p>
      <br />
      <p className="li2-rule-new">
        5）每日新增应援人数前3名分别获得官方赠票：
      </p>
      <table>
        <tbody>
          <tr>
            <td>排名</td>
            <td>奖励</td>
          </tr>
          <tr>
            <td>每日第一名</td>
            <td>5千票</td>
          </tr>
          <tr>
            <td>每日第二名</td>
            <td>3千票</td>
          </tr>
          <tr>
            <td>每日第三名</td>
            <td>1千票</td>
          </tr>
        </tbody>
      </table>
    </React.Fragment>
  );
}

// 决赛
export function FinalRule(props) {
  return (
    <React.Fragment>
      {props.path !== "entry" && props.path !== "modal" && (
        <div className="title-new">4、决赛</div>
      )}
      <p className="li2-rule-new">
        （3月14日12:00:00-3月16日23:59:59） 25进3
      </p>
      <p className="li2-rule-new mgt10">
        1）3月14日12:00:00-3月15日12:00:00期间，根据榜单票数排名：前10歌手可获得3月16日公演赛拉票资格
      </p>
      <p className="li2-rule-new mgt10">
        2）3月16日晚19:00-21:00，举行现场公演赛
      </p>
      <p className="li2-rule-new">现场公演赛top3奖励：</p>
      <p className="li2-rule-new">按照公演赛期间总分排序</p>
      <p className="li2-rule-new">第一名： 10万应援票、supreme周边礼盒*2</p>
      <p className="li2-rule-new">第二名： 5万应援票、supreme周边礼盒*2</p>
      <p className="li2-rule-new">第三名： 3万应援票、supreme周边礼盒*2</p>
      <p className="li2-rule-new">
        公演期间收到钻石打赏最多的选手奖励：时空恋人*1（9999元）、房间热度卡
        10000*15天
      </p>
      <p className="li2-rule-new">
        公演期间晚19:00-21:00
        获得打赏人数（非金币礼物）最多的选手奖励：童话木马*1（1314元）、房间热度卡
        10000*15天
      </p>
      <p className="li2-rule-new mgt10">
        3）3月14日12:00:00-3月16日23:59:59，《伴伴最强音》top前25位歌手将根据决赛榜单票数决出冠、亚、季军
      </p>
    </React.Fragment>
  );
}

export function RuleExplain() {
  return (
    <React.Fragment>
      <p className="li2-rule-new">
        1、本次活动将使用票数评比方式进行，如出现票数一致的情况，先达到该票数的选手排名靠前。
      </p>
      <p className="li2-rule-new mgt10">
        2、参赛的资料必须为本人真实作品，并必须带伴奏；如发现作假、代唱、假唱、恶搞等行为，冻结相关资质并取消参赛资格(不得选取伴伴平台禁歌参赛)。
      </p>
      <p className="li2-rule-new mgt10">
        3、在比赛期间违反平台规则、恶意刷票、上传违规内容，平台将取消其比赛资格，并对账户进行处理。
      </p>
      <p className="li2-rule-new mgt10">
        4、奖励将在活动结束后30个工作日内安排发放，钻石奖励将直接发放至获奖选手账号内（瓜分奖金四舍五入取整精确到1钻石）不予更换账号领取。单曲发行奖励将与获奖者沟通发放。
      </p>
      <p className="li2-rule-new mgt10">5、该活动解释权归伴伴所有。</p>
    </React.Fragment>
  );
}



