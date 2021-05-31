import React from "react";
import "./styles.css";
import ImgChannel from "./imgChannel";
import ReactDOM from "react-dom";

export default class BackView extends React.Component {
  constructor(props) {
    super(props);
    this.colors = this.props.colorBg;
  }

  render() {
    var color1 = this.props.colorBg[0];
    return (
      <div
        class="BackView"
        style={{
          background:
            "linear-gradient(" +
            this.props.colorBg[0] +
            "," +
            this.props.colorBg[1] +
            ")"
        }}
      >
        <ImgChannel id="1" color={color1} />
        <ImgChannel id="2" color={color1} />
        <ImgChannel id="3" color={color1} />
        <ImgChannel id="4" color={color1} />
        <ImgChannel id="5" color={color1} />
        <ImgChannel id="6" color={color1} />
        <ImgChannel id="7" color={color1} />
        <ImgChannel id="8" color={color1} />
        <ImgChannel id="9" color={color1} />
        <ImgChannel id="10" color={color1} />
        <ImgChannel id="11" color={color1} />
        <ImgChannel id="12" color={color1} />
        <ImgChannel id="13" color={color1} />
        <ImgChannel id="14" color={color1} />
        <ImgChannel id="15" color={color1} />
        <ImgChannel id="16" color={color1} />
        <ImgChannel id="17" color={color1} />
        <ImgChannel id="18" color={color1} />
        <ImgChannel id="19" color={color1} />
        <ImgChannel id="20" color={color1} />
        <ImgChannel id="21" color={color1} />
        <ImgChannel id="22" color={color1} />
        <ImgChannel id="23" color={color1} />
        <ImgChannel id="24" color={color1} />
        <ImgChannel id="25" color={color1} />
      </div>
    );
  }
}
