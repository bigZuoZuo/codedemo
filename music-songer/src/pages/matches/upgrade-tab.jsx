import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import clsx from "clsx";

import "./upgrade-tab.scoped.css";

// const semifinal_tab_titles = ["总榜", "PK榜"];
// const final_tab_titles = ["获胜组", "待定组"];

const UpgradeTab = memo((props) => {
  const [activeTab, setActiveTab] = useState(0);
  const mountRef = useRef(props.mountFetch || false);

  const tabChangedCallback = props.tabChangedCallback;
  const titles = props.tabs;

  const _onTabChange = useCallback((ev) => {
    const { tab } = ev.target.dataset;
    if (!tab) {
      return;
    }

    mountRef.current = false;
    const _tabIndex = titles.indexOf(tab);
    setActiveTab(_tabIndex >= 0 ? _tabIndex : 0);
  }, []);

  useEffect(() => {
    if (mountRef.current) {
      return;
    }

    if (tabChangedCallback && typeof tabChangedCallback === "function") {
      const key = (props.keys && props.keys[activeTab]) || activeTab;
      tabChangedCallback(key);
    }
  }, [activeTab]);

  return (
    <div className="upgrade-tab">
      {titles.map((tab, index) => (
        <div
          key={tab}
          data-tab={tab}
          onClick={_onTabChange}
          className={clsx("upgrade-tab-item", activeTab === index && titles.length > 1 && "active")}
        >
          {tab}
        </div>
      ))}
    </div>
  );
});

export default UpgradeTab;
