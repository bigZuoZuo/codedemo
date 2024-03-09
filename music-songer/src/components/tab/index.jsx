import React, { useEffect, useState, useCallback, memo } from "react";
import clsx from "clsx";
import "./index.scoped.css";

const SplitedTab = memo((props) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabChangedCallback = props.onTabChanged || function() {};

  const _onTabChange = useCallback(
    (ev) => {
      const { tab } = ev.target.dataset;
      if (!tab) {
        return;
      }

      const _tabIndex = props.tabs.indexOf(tab);
      setActiveTab(_tabIndex >= 0 ? _tabIndex : 0);
    },
    [props.tabs]
  );

  useEffect(() => {
    tabChangedCallback(props.keys ? props.keys[activeTab] : activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="splited-tab">
      {props.tabs.map((tab, index) => (
        <div
          key={tab}
          data-tab={tab}
          onClick={_onTabChange}
          className={clsx(
            "splited-tab-item",
            activeTab === index && "active",
            props.size === "s" && "small",
            props.size === "m" && "medium"
          )}
        >
          {tab}
        </div>
      ))}
    </div>
  );
});

export default SplitedTab;
