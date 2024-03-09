import React, { useLayoutEffect } from "react";
import Router from "./router";
import ErrorBoundary from "./components/error-boundary/error-boundary";
import Share from "./components/share/share";
import LandingBanner from "./components/landing-banner/landing-banner";
import Modals from "./modals";
import AudioPlayer from "./components/audio";
import { useLimitPackService } from "./hooks";
import "./App.css";

export default function App() {
  useLimitPackService();

  useLayoutEffect(() => {
    localStorage.removeItem("global.player.position");
  }, []);

  return (
    <ErrorBoundary>
      <LandingBanner />
      <Router />
      <Share />
      <Modals />
      <AudioPlayer />
    </ErrorBoundary>
  );
}
