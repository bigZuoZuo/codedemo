import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
    if (!!props) {
      this.el.id = props.id || false;
      if (props.className) this.el.className = props.className;
      if (props.style) {
        Object.keys(props.style).forEach((v) => {
          this.el.style[v] = props.style[v];
        });
      }
      document.body.appendChild(this.el);
    }
  }
  componentDidMount() {
    document.body.appendChild(this.el);
  }
  componentWillUnmount() {
    document.body.removeChild(this.el);
  }
  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
Portal.propTypes = {
  style: PropTypes.object,
};

export default function CreateProtal(props) {
  return <Portal {...props} />;
}
