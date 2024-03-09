import React, { useCallback, useImperativeHandle, forwardRef } from "react";
import { useLocalStore, useObserver } from "mobx-react";

import "./index.scoped.css";

const SearchBox = (props, ref) => {
  const _onAction = props.action || function() {};
  const _onEaseAction = props.easeAction || function() {};
  const store = useLocalStore(() => ({
    value: "",
    clearValue() {
      store.onChange("");
      _onEaseAction();
    },
    onChange(val) {
      store.value = val;
    },
  }));

  const _onChange = useCallback((ev) => {
    store.onChange(ev.target.value);
  }, []);

  const _onSubmit = useCallback(() => {
    if (store.value) {
      _onAction(store.value);
    } else {
      _onEaseAction();
    }
  }, []);

  useImperativeHandle(ref, () => ({
    clear() {
      store.clearValue();
    },
  }));

  return useObserver(() => (
    <div className="search-box">
      <input
        type={props.pkMode ? "number" : "text"}
        value={store.value}
        placeholder="输入歌手ID"
        onChange={_onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      />
      <span className="icon-close" data-visible={store.value ? 1 : 0} onClick={store.clearValue} />
      <span className="search-btn" onClick={_onSubmit}>
        搜索
      </span>
    </div>
  ));
};

export default forwardRef(SearchBox);
