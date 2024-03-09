import { useEffect, useCallback } from "react";
import { getGiftPack, getRecommendSingers } from "@src/services";
import TimeLimitModal from "@src/components/modal/time-limit";
import RecommandPlayers from "@src/components/modal/recommand-players";
import { usePlayerState, useUserinfoState } from "@src/hooks";
import { isInApp } from "@src/system";
import { shouldRedirectToEntry } from "@src/lib/utils";

export const useLimitPackService = () => {
  const playerState = usePlayerState();
  const userInfoState = useUserinfoState();
  const pathname = window.location.pathname;

  const _fetchData = useCallback(async () => {
    let showPack = false;
    try {
      if (/singer2022\/share/.test(pathname)) {
        showPack = true;
        throw new Error("");
      }

      const data = await getGiftPack();
      userInfoState.updateGiftPack(data.is_show);

      if (!data || !data.is_show) {
        // console.log(11)
        throw new Error("");
      }

      showPack = true;
      // 当日页面投票必须不低于30票，投票大于30票，则可以进行限时礼包的购买
      TimeLimitModal.show();
    } catch (err) {}

    try {
      const list = await getRecommendSingers();
      if (!list || !list.length) {
        return;
      }

      playerState.addRecommandSongs(list);

      // 不在app运行的且环境为dist运行的包，则直接return，比如用户浏览器打开页面，则不会弹框
      if (!isInApp && process.env.NODE_ENV === "production") {
        return;
      }
      // console.log(showPack);
      if (!showPack) {
        RecommandPlayers.show(list.slice(0, 3));
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    if (/singer2022\/entry/.test(pathname) || shouldRedirectToEntry()) {
      return;
    }

    _fetchData();
  }, [_fetchData]);
};

export const useSignupStatusService = () => {
  const userInfoState = useUserinfoState();

  useEffect(() => {
    // 查询用户报名状态
    userInfoState.fetchSignupStatus();
  }, []);
};
