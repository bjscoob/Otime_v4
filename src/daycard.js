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
      times: this.props.times
    };
    //diff(
    //moment(this.firstPunch, "MM/DD/YYYY HH:mm:ss")
    this.elapsedTime = 0;
  }
  onMouseOver = () =>
    this.setState({ fg: this.props.colorBg[0], bg: this.props.colorBg[1] });
  onMouseOut = () => this.setState({ fg: "black", bg: "white" });
  calculateTime(startDate, startTime, endDate, endTime) {
    var sDateArr = startDate.split("/");
    var sTimeArr = startTime.split(":");
    var eDateArr = endDate.split("/");
    var eTimeArr = endTime.split(":");

    var d1 = new Date(
      "2021",
      sDateArr[0],
      sDateArr[1],
      sTimeArr[0],
      sTimeArr[1]
    );
    var d2 = new Date(
      "2021",
      eDateArr[0],
      eDateArr[1],
      eTimeArr[0],
      eTimeArr[1]
    );
    const diffInMs = Math.abs(d2 - d1);
    return (diffInMs / (1000 * 60 * 60)).toFixed(2);
  }
  getTotalTime() {
    if (!this.hasData) {
      var timeArr = this.props.times;
      var totalTime = 0.0;
      if (!!timeArr.length) {
        return totalTime;
      }
      var last = timeArr[timeArr.length - 1];
      //check if first element is an end punch, if so insert 00:00 in front
      if (!timeArr[0].isStartPunch) {
        var firstTime = new Time(-1, this.props.moda + " 00:00", 2, true);
        timeArr = [firstTime].concat(timeArr);
      }
      //check if last element is COMPLETE start punch, if so insert 24:00 in back
      if (last.isStartPunch && last.isComplete) {
        var lastTime = new Time(-1, this.props.moda + " 24:00", 2, true);
        timeArr.push(lastTime);
      }
      for (var i = 0; i < timeArr.length; i += 2) {
        try {
          totalTime += Number(
            this.calculateTime(
              timeArr[i].date,
              timeArr[i].time,
              timeArr[i + 1].date,
              timeArr[i + 1].time
            )
          );
        } catch (e) {
          console.log("Open Punch Day Card: " + this.props.moda);
        }
      }
      this.times = timeArr;
      this.elapsedTime = totalTime;
      this.props.addHrsFn(this.elapsedTime);
      this.hasData = true;
    }
  }
  render() {
    var content;
    //this.getTotalTime();
    var times = [];
    if (this.props.times) {
      for (var f = 0; f < this.props.times.length; f++) {
        var punch = this.props.times[f];
        times.push(
          <Typography>
            <div class={punch.getClass()}>{punch.time}</div>

            <hr class={punch.getClass()} />
          </Typography>
        );
      }
    }
    content = <div>{times}</div>;
    return (
      <div key={this.props.times}>
        <ButtonBase
          style={{ visibility: this.props.isVisible }}
          onClick={(event) => {
            this.props.popUpFn(this.props.moda, this.props.dt, this.times);
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
                <div class="dayHours">{this.elapsedTime + " hrs"}</div>
              </Typography>
              <Typography>
                <hr />
              </Typography>
              {content}
              <Typography>
                <hr />
              </Typography>
              <Typography>
                <div class="dayPay">
                  {"$" +
                    Number(
                      this.state.payRate * Number(this.elapsedTime)
                    ).toFixed(2)}
                </div>
              </Typography>
            </CardContent>
          </Card>
        </ButtonBase>
      </div>
    );
  }
  componentDidUpdate() {
    if (!this.state.hasData) {
      this.setState({ hasData: true });
    }
  }
}
