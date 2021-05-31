import React, { useEffect } from "react";
import "./styles.css";
import ReactDOM from "react-dom";
import Select from "react-select";
import DayCard from "./daycard.js";
import JobsPage from "./jobsPage";
import Banner from "./banner";
import Time from "./time";
import axios from "axios";
import Popup from "./popup";
import BackView from "./backView";
import { isMobileOnly, isTablet } from "react-device-detect";
import PayPeriod from "./payPeriod";
import moment from "moment";

/*If a punch starts before any other times, 
it cannot be ended after any other times, and contains  a stop. */
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.doubleWeek = true;
    this.dayRefs = [];
    this.punches = [];
    this.dayCards = [];
    this.times = [];
    this.state = {
      text: "",
      classNames: "",
      animationFinished: false,
      payRate: 80.0,
      hourCutoff: 65.0,
      showPopup: false,
      showJobs: false,
      popDay: "",
      popData: [],
      totalHours: 0.0,
      colors: this.getColors(),
      foregr: "foreground",
      multiplier: 1.5,
      hasData: false,
      status: 0,
      id: -1,
      email: "",
      name: "",
      currJob: "",
      startsAt: "Sun",
      startsDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      doubleWeek: 0
    };
    this.hours = this.state.totalHours;
    this.overtimeHours = 0.0;
    //default cardwidth should be 160. If anything else its for testing
    this.cardWidth = "160";
    if (isMobileOnly) {
      this.cardWidth = "40";
    }
    if (isTablet) {
      this.cardWidth = "80";
    }
  }
  async getData() {
    if (!this.state.hasData) {
      var url = "https://jax-apps.com/otime_app/api/getpaypdt.php";
      var punches = await axios
        .get(url, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then((response) => response.data);
      this.punches = punches;
    }
  }
  async getJobs(id) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ jobAction: "2", id: id })
    };
    var response = await fetch(
      "https://jax-apps.com/otime_app/api/job.php",
      requestOptions
    );
    var dataTEXT = await response.text();
    try {
      var data = JSON.parse(dataTEXT);
      return data;
    } catch (e) {
      console.log("Failed to retrieve jobs.");
      return [];
    }
  }
  async updateUser(data, s) {
    if (!data) {
      this.setState({
        status: 0,
        id: "",
        email: "",
        name: ""
      });
    } else {
      var jobs = await this.getJobs(data.id);
      this.setState({
        status: 1,
        id: data.id,
        email: data.email,
        name: data.name,
        jobs: jobs
      });
    }
  }
  filterTimesAt(moda) {
    var timeArr = [];
    if (this.state.hasData) {
      for (var r = 0; r < this.times.length; r++) {
        if (this.times[r].date == moda) {
          timeArr.push(this.times[r]);
        }
      }
    }
    return timeArr;
  }
  getColors() {
    var today = new Date();
    var hourNow = today.getHours();
    var purple = "#CC99C9"; //0
    var blue = "#9EC1CF"; //1
    var green = "#9EE09E"; //2
    var yellow = "#FDFD97"; //3
    var orange = "#FEB144"; //4
    var red = "#FF6663"; //5
    //1st is top, second is bottom
    //midnight-4AM:
    if (hourNow <= 4) {
      return [blue, green];
    } else if (hourNow <= 8) {
      return [green, yellow];
    } else if (hourNow <= 12) {
      return [yellow, orange];
    } else if (hourNow <= 16) {
      return [orange, red];
    } else if (hourNow <= 20) {
      return [red, purple];
    } else if (hourNow <= 24) {
      return [purple, blue];
    } else {
      return ["#000", "#FFF"];
    }
  }
  pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  getBaseHours() {
    if (this.state.totalHours > this.state.hourCutoff) {
      this.overtimeHours = this.state.totalHours - this.state.hourCutoff;
      return this.state.hourCutoff;
    }
    return this.hours;
  }
  addToHours(h) {
    this.setState((prevState) => ({
      totalHours: prevState.totalHours + h
    }));
  }
  async setJob(job) {
    var arr = job.value.periodStarts.toString().split(" ");
    var sa = arr[0];
    var pp = await this.getPayPdtStart(job.value.id);
    var sd = pp.startDay.toString().substring(0, 10);
    /*startsAt={this.state.startsAt}
            startsDate={this.state.startsDate}
            doubleWeek={this.state.doubleweek}* */
    this.setState({
      ppId: pp.id,
      startsAt: sa,
      startsDate: sd,
      doubleWeek: job.value.isWeekly,
      payRate: Number(job.value.payrate),
      currJob: job
    });
  }
  async getPayPdtStart(jobId) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ jobAction: 3, id: jobId })
    };
    var response = await fetch(
      "https://jax-apps.com/otime_app/api/job.php",
      requestOptions
    );
    var dataTEXT = await response.text();
    try {
      var data = JSON.parse(dataTEXT);
      return data;
    } catch (e) {
      console.log(dataTEXT);
    }
  }
  openPopup(day, dt, times) {
    var timeArr = times;
    var popDay = [day];
    this.setState({
      showPopup: !this.state.showPopup,
      bgz: "100",
      dt: dt,
      popDay: day,
      popData: timeArr,
      foregr: "fadeout"
    });
  }
  closePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
      bgz: "-100",
      foregr: "foreground"
    });
  }
  openJobs() {
    if (!this.state.showJobs) {
      this.setState({
        showJobs: !this.state.showJobs,
        bgz: "100",
        foregr: "fadeout",
        status: 3
      });
    }
  }
  closeJobs() {
    this.setState({
      showJobs: !this.state.showJobs,
      bgz: "-100",
      foregr: "foreground",
      status: 1
    });
  }
  render() {
    console.log(this.state.ppId);
    this.baseHours = this.getBaseHours();
    var dayRefs = [];
    var weekOne = [];
    var weekTwo = [];
    var daySelect = [];
    var dates = [
      "04/08",
      "04/09",
      "04/10",
      "04/11",
      "04/12",
      "04/13",
      "04/14",
      "04/15",
      "04/16",
      "04/17",
      "04/18",
      "04/19",
      "04/20",
      "05/22"
    ];
    if (this.state.jobs) {
      for (var k = 0; k < this.state.jobs.length; k++) {
        var j = this.state.jobs[k];
        daySelect.push({ value: j, label: j.name });
      }
    }
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames = dayNames.concat(dayNames);
    var stop = false;
    //first week
    var weekArr = weekOne;
    if (this.state.hasData) {
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
    }

    var len = 7;
    if (this.doubleWeek) {
      weekArr = weekArr.concat(weekTwo);
      len = 14;
    }
    for (var i = 0; i < len; i++) {
      stop = false;
      var moda = dates[i].toString();
      if (
        this.times.length > 0 &&
        moda == this.times[this.times.length - 1].date
      ) {
        stop = true;
      }
      weekArr.push(
        <DayCard
          cardWidth={this.cardWidth}
          payRate={this.state.payRate}
          moda={moda}
          color={this.state.colors[1]}
          day={dayNames[i]}
          elapsedTime="0.0"
          times={this.filterTimesAt(moda)}
          stop={stop}
          popUpFn={this.openPopup.bind(this)}
          addHrsFn={this.addToHours.bind(this)}
          colorBg={this.state.colors}
        />
      );
    }
    weekOne = weekArr.slice(0, 7);
    dayRefs = (
      <div className="weekView">
        <div class="week">{weekOne}</div>
      </div>
    );
    //second week
    if (this.doubleWeek) {
      weekTwo = weekArr.slice(7, 14);
      dayRefs = (
        <div className="weekView">
          <div class="week">{weekOne}</div>
          <div class="week2">{weekTwo}</div>
        </div>
      );
    }
    this.dayRefs = dayRefs;
    return (
      <div className="App">
        <BackView colorBg={this.state.colors} />
        {this.state.showPopup ? (
          <Popup
            colorBg={this.state.colors}
            day={this.state.popDay}
            payPeriod={this.state.payPeriod}
            id={this.state.ppId}
            dt={this.state.dt}
            data={this.state.popData}
            closePopup={this.closePopup.bind(this)}
          />
        ) : null}
        <div class="menuContainer">
          {/*<img
            src="https://static.thenounproject.com/png/3107464-200.png"
            id="otime_icon"
            alt="otime_icon"
         />*/}
          <Banner
            status={this.state.status}
            id={this.state.id}
            email={this.state.email}
            name={this.state.name}
            updFn={this.updateUser.bind(this)}
            showJobFn={this.openJobs.bind(this)}
            closeJobFn={this.closeJobs.bind(this)}
          />
        </div>

        {this.state.showJobs ? (
          <JobsPage
            id={this.state.id}
            jobs={this.state.jobs}
            fontSize={this.cardWidth}
          />
        ) : null}
        <div class={this.state.foregr}>
          <Select
            id="sbSearch"
            options={daySelect}
            onChange={this.setJob.bind(this)}
            placeholder={this.state.currJob.name}
          />
          <br />
          <PayPeriod
            id={this.state.ppId}
            startsAt={this.state.startsAt}
            startsDate={this.state.startsDate}
            doubleWeek={this.state.doubleWeek}
            colors={this.state.colors}
            openPopup={this.openPopup.bind(this)}
            addToHours={this.addToHours.bind(this)}
            cardWidth={this.cardWidth}
          />
          <div class="menuContainer" style={{ position: "absolute" }}>
            <br />
            <h3
              style={{
                background: this.state.colors[0],
                color: this.state.colors[1]
              }}
            >
              Base Time:{" "}
            </h3>
            <p className="timelabel1">
              {this.baseHours.toFixed(2) + " hours "}
            </p>
            <br />
            <br />
            <h3
              style={{
                background: this.state.colors[0],
                color: this.state.colors[1]
              }}
            >
              Over Time:{" "}
            </h3>
            <p className="timelabel2">
              {this.pad(this.overtimeHours.toFixed(2), 5) + " hours "}
            </p>
            <br />
            <hr class="leftHr" />
            <br />
            <h3
              style={{
                background: this.state.colors[1],
                color: this.state.colors[0]
              }}
            >
              Total Time:{" "}
            </h3>
            <p className="timelabel3">
              {this.state.totalHours.toFixed(2) + " hours "}
            </p>
            <h4>Pay Rate: ${this.state.payRate.toFixed(2)}</h4>
            <br />
            <h3
              style={{
                background: this.state.colors[0],
                color: this.state.colors[1]
              }}
            >
              Base Pay:{" "}
            </h3>
            <p className="payLabel1">
              {"$" + (this.state.totalHours * this.state.payRate).toFixed(2)}
            </p>
            <br />
            <br />
            <h3
              class="olabel"
              style={{
                background: this.state.colors[0],
                color: this.state.colors[1]
              }}
            >
              O-time Pay:{" "}
            </h3>
            <p className="payLabel2">
              {"$" +
                (
                  this.overtimeHours *
                  this.state.payRate *
                  this.state.multiplier
                ).toFixed(2)}
            </p>
            <br />
            <hr class="rightHr" />
            <br />
            <h3
              style={{
                background: this.state.colors[1],
                color: this.state.colors[0]
              }}
            >
              Total Pay:{" "}
            </h3>
            <p className="payLabel3">
              {"$" + (this.state.totalHours * this.state.payRate).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    );
  }
  async componentDidMount() {
    await this.getData();
    this.setState({ hasData: true });
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
