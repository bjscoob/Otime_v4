import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import Time from "./time.js";
import App from "./index.js";
import ButtonBase from "@material-ui/core/ButtonBase";

export default class DayCard extends React.Component {
  constructor(props) {
    super(props);
    this.times = this.props.times;
    this.count = 0;
    this.hasData = false;
    this.state = {
      payRate: this.props.payRate,
      day: this.props.day,
      fg: "black",
      bg: "white",
      hasData: false,
      times: this.props.times,
      totalTime: this.props.totalTime
    };
    //diff(
    //moment(this.firstPunch, "MM/DD/YYYY HH:mm:ss")
    this.elapsedTime = 0;
  }
  onMouseOver = () =>
    this.setState({ fg: this.props.colorBg[0], bg: this.props.colorBg[1] });
  onMouseOut = () => this.setState({ fg: "black", bg: "white" });

  render() {
    var content;
    var times = [];
    try {
      for (var f = 0; f < this.props.times.length; f++) {
        var punch = this.props.times[f];
        times.push(
          <Typography>
            <div class={punch.getClass()}>{punch.time}</div>

            <hr class={punch.getClass()} />
          </Typography>
        );
      }
    } catch (e) {}
    content = <div class="dayCardContent">{times}</div>;

    var money =
      "$" +
      Number(this.props.payRate * Number(this.props.elapsedTime)).toFixed(2);
    var bigMoney = money.split(".")[0];
    var lilMoney = "." + money.split(".")[1];
    return (
      <div key={this.props.times}>
        <ButtonBase
          style={{ visibility: this.props.isVisible }}
          onClick={(event) => {
            this.props.popUpFn(
              this.props.moda,
              this.props.dt,
              this.props.times
            );
            this.setState({ hasData: false });
          }}
        >
          <Card
            class="card"
            onMouseOver={this.onMouseOver.bind(this)}
            onMouseOut={this.onMouseOut.bind(this)}
            style={{
              backgroundColor: this.state.bg,
              padding: 0,
              textAlign: "left",
              borderRadius: 0,
              width: Number(this.props.cardWidth),
              marginRight: 3,
              float: "left"
            }}
          >
            <CardContent
              class="card"
              style={{
                padding: 3,
                color: this.state.fg
              }}
            >
              <Typography>
                <div class="moda">{this.props.moda}</div>
              </Typography>
              <Typography>
                <div class="dayName">{this.state.day}</div>
              </Typography>
              <Typography>
                <div class="dayHours">
                  {Number(this.props.elapsedTime).toFixed(2) + "hrs"}
                </div>
              </Typography>
              <Typography>
                <hr />
              </Typography>
              {content}
              <Typography>
                <hr />
              </Typography>
              <Typography>
                <div
                  class="dayPayBig"
                  style={{
                    color: this.props.elapsedTime > 0 ? "green" : "grey"
                  }}
                >
                  {bigMoney}
                </div>
                <div
                  class="dayPayLil"
                  style={{
                    color: this.props.elapsedTime > 0 ? "green" : "grey"
                  }}
                >
                  {lilMoney}
                </div>
              </Typography>
            </CardContent>
          </Card>
        </ButtonBase>
      </div>
    );
  }
  componentDidUpdate(prevProps) {
    if (!this.state.hasData) {
      this.setState({
        times: this.props.times,
        hasData: true
      });
    }
  }
}
