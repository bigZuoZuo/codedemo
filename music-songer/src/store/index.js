import UserInfoState from "./user";
import PlayerState from "./player";

const createStore = () => {
  const userInfo = new UserInfoState();
  const player = new PlayerState();

  return {
    userInfo,
    player,
  };
};

const stores = createStore();

export default stores;
