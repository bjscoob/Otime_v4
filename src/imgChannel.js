import React from "react";
import "./styles.css";
import ReactDOM from "react-dom";

export default class ImgChannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: "1s",
      class: "imgChannel"
    };
    this.newDuration();
  }
  newDuration() {
    var newTime = (Math.floor(Math.random() * 10) + 4).toString() + "s";
    this.setState({ duration: newTime, class: "imgChannel" });
  }
  render() {
    return (
      <div
        class={this.state.class}
        onAnimationEnd={this.newDuration.bind(this)}
        style={{
          animationDuration: this.state.duration,
          color: this.props.color
        }}
      >
        .
      </div>
    );
  }
  componentDidMount() {
    this.newDuration();
  }
}
