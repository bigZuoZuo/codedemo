import React, { memo, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { parseLeftTime } from "@src/lib/utils";

import "./index.scoped.css";

// 48px = 6.4vw
const aniLimitArr = [9, 9, 2, 9, 5, 9, 5, 9];
const createAniArr = (index) => Array.from({ length: aniLimitArr[index] + 1 }, (_, index) => index);

const TimeItem = memo(({ count, hasSpace, sourceValue, index }) => {
  const changedRef = useRef(false);

  if (count !== sourceValue) {
    changedRef.current = true;
  }

  const aniArr = createAniArr(index);

  return (
    <div className={clsx("time-item-layer", hasSpace && "space")}>
      <TransitionGroup>
        {aniArr
          .filter((item) => item === count)
          .map((item) => (
            <CSSTransition key={item} in={true} timeout={1000} classNames="slide">
              <div className={clsx("time-item", item === count && "active")}>{item}</div>
            </CSSTransition>
          ))}
      </TransitionGroup>
    </div>
  );
});
TimeItem.displayName = "TimeItem";


const txtArr = ["天", "时", "分", "秒"];
const buildWidgets = (countList, sourceList) => {
  const res = [];
  // console.log(countList);

  countList.slice(0, 3).forEach((item, index) => {
    item.forEach((count, idx) => {
      const _index = item.length * index + idx;

      res.push(
        <TimeItem
          key={"time-item-" + _index}
          count={+count}
          hasSpace={idx === 1}
          index={_index}
          sourceValue={sourceList[_index]}
        />
      );
    });

    if (index !== countList.length - 1) {
      res.push(
        <span key={"span-ext-" + index} className="time-ext">
          {txtArr[index]}
        </span>
      );
    }
  });

  return res;
};

const CountDown = memo(({ lefttime, action }) => {
  const [leftTime, setLeftTime] = useState(lefttime);
  const countRef = useRef(lefttime);
  const timerRef = useRef();

  const _updateTime = () => {
    if (countRef.current <= 0) {
      clearInterval(timerRef.current);
      return;
    }

    countRef.current--;
    setLeftTime((val) => val - 1);
    // 每5s一次
    if (countRef.current % 5 === 0) {
      action && typeof action === "function" && action();
    }
  };

  useEffect(() => {
    if (!timerRef.current) {
      timerRef.current = setInterval(_updateTime, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  if (!leftTime) {
    return null;
  }

  const countList = parseLeftTime(leftTime);
  const sourceList = parseLeftTime(lefttime)
    .join(",")
    .split(",")
    .map((item) => +item);

  // console.log(countList);
  // console.log(sourceList);


  return (
    <div className="count-down">
      <span>距离瓜分奖池还有</span>
      {buildWidgets(countList, sourceList)}
    </div>
  );
});

export default CountDown;
