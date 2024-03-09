import React, { useEffect } from "react";
import Banner from "@src/components/banner/index";
// import LotteryCodeModal from "@src/components/modal/lottery-code";
// import { usePlayerState } from "@src/hooks";
import "./index.scoped.css";

const Home = () => {
  // const playerState = usePlayerState();

  useEffect(() => {}, []);

  return (
    <div className="home">
      <Banner />
    </div>
  );
};

export default Home;
