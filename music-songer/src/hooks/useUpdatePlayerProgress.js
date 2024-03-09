import { useEffect, useCallback, useRef } from "react";
import { usePlayerState } from "@src/hooks";

export const useUpdatePlayerProgress = () => {
  const timerRef = useRef();
  const playerState = usePlayerState();

  const updatePlayingProgress = useCallback(() => {
    if (!playerState.player || playerState.state !== 1) {
      return;
    }

    playerState.progress = playerState.player.currentTime / playerState.player.duration;
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(updatePlayingProgress, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);
};
