import React, { useCallback, useRef } from "react";
import { observer } from "mobx-react";
import Banner from "@src/components/banner";
import CommonPannel from "@src/components/common-pannel";
import { getLotteryLogsnew } from "@src/services";
import NoData from "@src/components/nodata";
import { useLoadMore } from "@src/hooks";
import { fmtDate } from "@src/lib/utils";
import {
  BannerLinkRule,
  BannerLinkPack,
  BottomBg,
} from "@src/components/banner/links";

import "./index.scoped.css";

const LotteryRecordsPages = () => {
  const bottomRef = useRef();

  const _fetchData = useCallback(async (page) => {
    const list = await getLotteryLogsnew(page);

    // return list
    //   .map((item) => ({
    //     created_at: item.created_at,
    //     name: giftMap[item.commodity_id] || "",
    //   }))
    //   .filter((item) => !!item.name);
    return list
  }, []);

  const [list] = useLoadMore(_fetchData, bottomRef);
  // console.log(list)
  return (
    <div className="lottery-records-pages">
      <Banner>
        <BannerLinkRule />
        <BannerLinkPack />
      </Banner>
      <CommonPannel title="抽奖记录" column fixedbottom>
        {list.length ? (
          list.map((item, index) => (
            <div key={item.created_at + index} className="record-item">
              <span className="record-date">{item.created_at}</span>
              <span className="award-name">
                抽中【{item.name}】* {item.num}
              </span>
              {/* <span className="record-date">
                {fmtDate(
                  new Date(item.created_at * 1000),
                  "MM月dd日 hh:mm:ss"
                )}
              </span> */}
            </div>
          ))
        ) : (
          <NoData />
        )}
        <div id="modal-message-bottom" ref={bottomRef} />
      </CommonPannel>
      <BottomBg />
    </div>
  );
};

export default observer(LotteryRecordsPages);
