import React from "react";
import Time from "./time";
import DayCard from "./daycard.js";
import moment from "moment";

export default class PayPeriod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.times = [];
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
  render() {
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
    //first week
    /*if (this.state.hasData) {
      this.punches.forEach((punch) => {
        if (punch.end) {
          //START PUNCH is complete
          this.times.push(new Time(punch.id, punch.start, true, true));
          this.times.push(new Time(punch.id, punch.end, false, true));
        } else {
          //START PUNCH not complete
          this.times.push(new Time(punch.id, punch.start, true, false));
        }
      });
    }*/

    var weekNo = 1;
    if (this.props.startsAt != "Sun") {
      weekNo = 2;
    }
    if (this.props.doubleWeek) {
      weekNo += 1;
    }
    var weekArr = [];
    var startDate = moment(this.props.startsDate);
    console.log(this.props.startsDate);
    var sDate = Date.parse(this.props.startDate);
    var b = 0;
    for (var y = 0; y < dayIndex; y++) {
      weeks[b].push(
        <DayCard
          isVisible="hidden"
          cardWidth={this.props.cardWidth}
          payRate={this.state.payRate}
          moda={moda}
          color={this.props.colors[1]}
          day={dayOfWeek}
          elapsedTime="0.0"
          //times={this.filterTimesAt(moda)}
          stop={stop}
          //popUpFn={this.openPopup.bind(this)}
          //addHrsFn={this.addToHours.bind(this)}
          colorBg={this.props.colors}
        />
      );
    }
    for (var i = 0; i < 7 + this.props.doubleWeek * 7; i++) {
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
      weeks[b].push(
        <DayCard
          isVisible="visible"
          dt={dt}
          cardWidth={this.props.cardWidth}
          payRate={this.state.payRate}
          moda={moda}
          color={this.props.colors[1]}
          day={dayOfWeek}
          elapsedTime="0.0"
          times={this.filterTimesAt(moda)}
          stop={stop}
          popUpFn={this.props.openPopup.bind(this)}
          addHrsFn={this.props.addToHours.bind(this)}
          colorBg={this.props.colors}
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
    return this.dayRefs;
  }
}
