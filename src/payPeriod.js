import React from "react";
import Time from "./time";
import DayCard from "./daycard.js";
import moment from "moment";

export default class PayPeriod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasData: false,
      punches: []
    };
    this.times = [];
    this.totals = 0.0;
    this.overtime = 0.0;
    this.baseTime = 0.0;
    this.dayTime = 0.0;
    this.overtimeMode = false;
  }
  filterTimesAt(moda) {
    var timeArr = [];
    if (this.times.length) {
      for (var r = 0; r < this.times.length; r++) {
        if (this.times[r].date == moda) {
          timeArr.push(this.times[r]);
        }
      }
    }

    return timeArr;
  }
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
  getTotalTime(timeArr, moda, weekNo) {
    if (this.props.resetsWeekly == 0) {
      weekNo = 0;
    }
    var totalTime = 0.0;
    if (timeArr.length > 0) {
      var last = timeArr[timeArr.length - 1];
      //check if first element is an end punch, if so insert 00:00 in front
      if (!timeArr[0].isStartPunch) {
        var firstTime = new Time(-1, moda + " 00:00", 2, true);
        timeArr = [firstTime].concat(timeArr);
      }
      //check if last element is COMPLETE start punch, if so insert 24:00 in back
      if (last.isStartPunch && last.isComplete) {
        var lastTime = new Time(-1, moda + " 24:00", 2, true);
        timeArr.push(lastTime);
      }
      for (var i = 0; i < timeArr.length; i += 2) {
        try {
          var newTime = Number(
            this.calculateTime(
              timeArr[i].date,
              timeArr[i].time,
              timeArr[i + 1].date,
              timeArr[i + 1].time
            )
          );
          //console.log( newTime+this.baseTime +" "+ Number(this.props.hourCutoff)*(weekNo));
          if (this.overtimeMode) {
            this.overtime += newTime;
            this.dayPay = newTime * this.props.multiplier;
          }
          if (
            newTime + this.baseTime >
            Number(this.props.hourCutoff) * weekNo
          ) {
            var t = newTime + this.baseTime;
            this.overtimeMode = true;
            this.baseTime = this.props.hourCutoff * weekNo;
            var o = t - this.baseTime;
            this.overtime += o;
            this.dayPay = newTime - o + o * this.props.multiplier;
          }
          if (
            newTime + this.baseTime <=
            Number(this.props.hourCutoff) * weekNo
          ) {
            this.baseTime += newTime;
            this.dayPay = newTime;
          }
          this.dayTime = newTime;
          console.log(this.dayPay);
        } catch (e) {
          console.log("Open Punch Day Card: " + moda);
        }
      }
      this.totals = this.totals + newTime;
    }
    return timeArr;
  }
  render() {
    this.times = [];
    if (this.props.punches.length > 0) {
      this.props.punches.forEach((punch) => {
        if (punch.end) {
          //START PUNCH is complete
          this.times.push(new Time(punch.id, punch.start, true, true));
          this.times.push(new Time(punch.id, punch.end, false, true));
        } else {
          //START PUNCH not complete
          this.times.push(new Time(punch.id, punch.start, true, false));
        }
      });

      this.times[this.times.length - 1].hasStop = true;
    }
    var dayRefs = [];
    var weekOne = [];
    var weekTwo = [];
    var weekThree = [];
    var weeks = [weekOne, weekTwo, weekThree];
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dayIndex = -1;
    for (var u = 0; u < 7; u++) {
      if (this.props.startsAt.toString().substring(0, 3) == dayNames[u]) {
        dayIndex = u;
      }
    }
    dayNames = dayNames.concat(dayNames).concat(dayNames);
    var stop = false;

    var weekNo = 1;
    if (this.props.startsAt != "Sun") {
      weekNo = 2;
    }
    if (this.props.doubleWeek) {
      weekNo += 1;
    }
    var weekArr = [];
    var startDate = moment(this.props.startsDate);
    var sDate = Date.parse(this.props.startDate);
    var b = 0;
    for (var y = 0; y < dayIndex; y++) {
      weeks[b].push(
        <DayCard
          isVisible="hidden"
          cardWidth={this.props.cardWidth}
          payRate={this.props.payRate}
          moda={moda}
          color={this.props.colors[1]}
          day={dayOfWeek}
          elapsedTime="0.0"
          times={[]}
          stop={stop}
          //popUpFn={this.openPopup.bind(this)}
          //addHrsFn={this.addToHours.bind(this)}
          colorBg={this.props.colors}
        />
      );
    }

    this.overtime = 0.0;
    this.baseTime = 0.0;
    this.dayTime = 0.0;
    for (var i = 0; i < 7 + this.props.doubleWeek * 7; i++) {
      if (i == 7) {
        this.overtimeMode = false;
      }
      var date = startDate.clone();
      var datecl = date.clone();
      var dayOfWeek = dayNames[dayIndex + i];
      var moda = date.add(i, "days").format("MM/DD");
      var dt = datecl.add(i, "days").format("YYYY-MM-DD");
      stop = false;
      if (
        this.times.length > 0 &&
        moda == this.times[this.times.length - 1].date
      ) {
        stop = true;
      }

      this.dayTime = 0.0;
      this.dayPay = 0.0;
      var preTimes = this.filterTimesAt(moda);
      var postTimes = this.getTotalTime(preTimes, moda, i < 7 ? 1 : 2);
      weeks[b].push(
        <DayCard
          isVisible="visible"
          dt={dt}
          cardWidth={this.props.cardWidth}
          payRate={this.props.payRate}
          moda={moda}
          color={this.props.colors[1]}
          day={dayOfWeek}
          elapsedTime={this.dayTime}
          times={postTimes}
          stop={stop}
          payPeriod={this.props.id}
          popUpFn={this.props.openPopup.bind(this)}
          addHrsFn={this.props.addToHours.bind(this)}
          colorBg={this.props.colors}
          pay={this.dayPay}
        />
      );

      if (dayOfWeek == "Sat") {
        b++;
      }
    }
    dayRefs = (
      <div className="weekView">
        <div class="week1">{weekOne}</div>
        <div class="week2">{weekTwo}</div>
        <div class="week3">{weekThree}</div>
      </div>
    );

    this.dayRefs = dayRefs;
    return dayRefs;
  }
  componentDidUpdate(prevProps) {}
  componentDidMount() {
    this.props.addToHours(this.totals, this.overtime, this.baseTime, true);
  }
}
