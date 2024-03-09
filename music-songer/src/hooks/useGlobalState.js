import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";

export const useStore = (field) => {
  const rootStore = useContext(MobXProviderContext);

  return field ? rootStore[field] : rootStore;
};

export const useUserinfoState = () => useStore("userInfo");

export const usePlayerState = () => useStore("player");
