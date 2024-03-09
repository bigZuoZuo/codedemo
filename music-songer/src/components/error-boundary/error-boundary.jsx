import React, { Component } from "react";
import "./error-boundary.scoped.css";

export default class ErrorBoundary extends Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { error };
  }

  //   componentDidCatch(error, errorInfo) {
  //     toast(error.message);
  //   }

  render() {
    if (this.state.error) {
      return (
        <div className="page">
          <img src={require("./error3.svg")} alt="" />
          <span>Something went wrong!</span>
          <p>{decodeURIComponent(this.state.error.message)}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
