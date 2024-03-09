import React, { useCallback, useRef } from "react";
import clsx from "clsx";
import { observer } from "mobx-react";
import { differenceInDays } from "date-fns";
import Banner from "@src/components/banner";
import CommonPannel from "@src/components/common-pannel";
import { getAvatar, noop, fmtDate } from "@src/lib/utils";
import { getSubscribeList, postSubscribe } from "@src/services";
import NoData from "@src/components/nodata";
import { toast } from "@src/system";
import { useLoadMore } from "@src/hooks";
import { BannerLinkRule,BottomBg} from "@src/components/banner/links";

import "./index.scoped.css";
import native from "@src/lib/native";

const parseTime = (start_at, end_at) => {
  let endStr = "~";
  const startTime = new Date(start_at * 1000);
  const endTime = new Date(end_at * 1000);
  endStr += fmtDate(endTime, differenceInDays(startTime, endTime) === 0 ? "hh:mm" : "MM-dd hh:mm");

  return fmtDate(startTime, "MM-dd hh:mm") + endStr;
};

const getIsExpirated = (end_at) => Date.now() - new Date(end_at * 1000).getTime() >= 0;

const AppointmentPage = () => {
  const bottomRef = useRef();

  const _fetchData = useCallback(async (page) => {
    return await getSubscribeList(page);
  }, []);

  const [list, refresh] = useLoadMore(_fetchData, bottomRef);

  const _onPostSubscribe = useCallback(async (ev) => {
    const { rid } = ev.target.dataset;
    if (!rid || ev.target.classList.contains("finish")) {
      return;
    }

    try {
      await postSubscribe(+rid);
      toast("预约成功");
      refresh();
    } catch (err) {
      toast("预约出错");
    }
  }, []);

  const _onOpenRoom = useCallback((ev) => {
    const { rid } = ev.target.dataset;
    if (!rid) {
      return;
    }

    native.NativeOpenRoom(+rid);
  }, []);

  return (
    <div className="appointment-page">
      <Banner>
        <BannerLinkRule />
      </Banner>
      <CommonPannel title="活动房间" column fixedbottom>
        {list.length ? (
          list.map((item) => (
            <div key={item.id} className="room-item">
              <div className="avatar-box">
                <img
                  src={getAvatar(item.room.icon)}
                  data-rid={item.rid}
                  onClick={_onOpenRoom}
                  alt=""
                />
                {item.is_broadcast && <span data-living />}
              </div>
              <div className="roominfo-box">
                <div className="room-name">{item.title}</div>
                <div className="room-desc">{item.room.name}</div>
                <div className="room-time">
                  {parseTime(item.start_at, item.end_at)}
                </div>
              </div>
              <div
                className={clsx(
                  "make-a-date",
                  item.is_subscribe && "done",
                  getIsExpirated(item.end_at) && "finish"
                )}
                data-rid={item.id}
                onClick={!item.is_subscribe ? _onPostSubscribe : noop}
              />
            </div>
          ))
        ) : (
          <NoData />
        )}
      </CommonPannel>
      <BottomBg />
    </div>
  );
};

export default observer(AppointmentPage);
