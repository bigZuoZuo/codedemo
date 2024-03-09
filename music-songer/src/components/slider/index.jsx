import React, { memo } from "react";
import clsx from "clsx";
import { observer, useLocalStore } from "mobx-react";
import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper.scss";
import "./index.scoped.css";

import { toast } from "@src/system";

SwiperCore.use([Autoplay]);

const mockList = [
  { key: "audition", name: "海选赛", time: "3月4日-3月7日", step: "n进200" },
  { key: "promotion", name: "晋级赛", time: "3月7日-3月10日", step: "200进80" },
  { key: "half", name: "半决赛", time: "3月10日-3月14日", step: "80进25" },
  { key: "final", name: "总决赛", time: "3月14日-3月16日", step: "冠军角逐" },
];

export const DATE_LIMIT_LIST = ["2022/03/07 12:00", "2022/03/10 14:00", "2022/03/14 12:00"];

// export const DATE_LIMIT_LIST = ["2022/02/07 12:00", "2022/02/10 12:00", "2022/02/14 12:00"];

const match_list = ["晋级赛", "半决赛", "总决赛"];

export const getCurrentStage = () => {
  const jumpIndex = DATE_LIMIT_LIST.map((item) => new Date(item)).filter(
    (item) => Date.now() - item.getTime() >= 0
  ).length;

  if (jumpIndex < 1 || jumpIndex > 3) {
    return 0;
  }

  return jumpIndex;
};

const Slider = observer((props) => {
  const store = useLocalStore(() => ({
    activeIndex: props.initStage || 0,
    onSlideChange(ev) {
      if (ev.clickedIndex === undefined) {
        return;
      }

      const index = +ev.clickedIndex;

      if (index === store.activeIndex) {
        return;
      }

      if (index > 0 && props.isMatch) {
        const date = DATE_LIMIT_LIST[index - 1];
        const canIJump = Date.now() - new Date(date).getTime() >= 0;
        if (!canIJump) {
          toast(match_list[index - 1] + "还未开始，敬请期待～");
          return;
        }
      }

      store.activeIndex = index;
      props.onSlideChanged && props.onSlideChanged(index);
    },
  }));

  return (
    <div className="singer-slider">
      <Swiper
        initialSlide={props.initStage || 0}
        spaceBetween={13}
        slidesPerView="auto"
        observer
        observeParents
        freeMode
        setWrapperSize
        slideToClickedSlide
        onClick={store.onSlideChange}
      >
        {mockList.map((item, index) => (
          <SwiperSlide key={item.key}>
            {/* <div className={clsx("progress-item", index === store.activeIndex && "active")}>
              <img src={index === store.activeIndex ? item.imgOn : item.img} alt="" />
            </div> */}
            <div
              className={clsx(
                "glory-item",
                index === store.activeIndex && "active"
              )}
            >
              <div className="glory-item-contain">
                <span className="name">{item.name}</span>
                <div className="contain-img">
                  <span>{item.step}</span>
                </div>
                <span className="time">{item.time}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

export default memo(Slider);
