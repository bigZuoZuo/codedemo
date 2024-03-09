import React, { useCallback } from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { useUserinfoState } from "@src/hooks";

import "./index.scoped.css";

const SignupBtn = (props) => {
  const history = useHistory();
  const userInfoState = useUserinfoState();

  const _onJump = useCallback(() => {
    if (userInfoState.canSignup) {
      history.push("/signup");
    }
  }, [history, userInfoState.canSignup]);

  return (
    <div
      className="signup-btn"
      data-entry={props.isEntry}
      data-status={userInfoState.signupStatus}
      onClick={_onJump}
    />
  );
};

export default observer(SignupBtn);
