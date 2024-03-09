import { useEffect } from "react";
import { usePlayerState } from "@src/hooks";

const AudioPlayer = () => {
  const playerState = usePlayerState();

  useEffect(() => {
    if (playerState.player) {
      // 出错或者播放完成的时候
      playerState.player.onerror = () => {
        playerState.stop();
      };
      playerState.player.onended = () => {
        playerState.stop();
      };
      playerState.player.onplay = () => {
        playerState.state = 1;
      };
      playerState.player.onpause = () => {
        playerState.state = 2;
      };
      playerState.player.oncanplay = () => {
        playerState.duration = playerState.player.duration;
      };
      playerState.player.onplaying = () => {
        playerState.duration = playerState.player.duration;
      };
    }
  }, [playerState.src]);

  return null;
};

export default AudioPlayer;
