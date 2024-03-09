import { CommonEvent } from "@tarojs/components";
import classNames from "classnames";
import { useState } from "react";
import { AtTabs, AtTabsPane } from "taro-ui";
import styles from "./index.module.scss";

interface Tab {
  title: string;
  value: string;
}
interface CurrentState {
    current: number;
    currentState: string;
}

interface TabsProps {
  tabList: Tab[];
  //   onClick: (index: number, event: CommonEvent<any>) => void;
  className?: string;
  children: React.ReactNode;
  currentStateInfo: CurrentState;
  setCurrentStateInfo: Function;
}

function Tabs(props: TabsProps) {
  const { tabList, className, children,currentStateInfo,setCurrentStateInfo } = props;

  const changeTab = (index) => {
    setCurrentStateInfo({
      current: index,
      currentState: tabList[index].value,
    });
  };

  return (
    <AtTabs
      className={classNames(styles["custom-tabs"], className)}
      current={currentStateInfo.current}
      tabList={tabList}
      onClick={changeTab}
    >
      {children}
    </AtTabs>
  );
}

export default Tabs;
