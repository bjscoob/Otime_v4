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
      doubleWeek: 0,
      punches: [],
      totalHours: 0.0,
      messageColor: "white",
      bannerMessage: "Welcome to O-time"
    };
    this.totalHours = 0;
    this.baseHours = 0.0;
    this.overtimeHours = 0.0;
    this.hourCutoff = 40.0;
    this.resetsWeekly = 1;
    //default cardwidth should be 160. If anything else its for testing
    this.cardWidth = "160";
    if (isMobileOnly) {
      this.cardWidth = "40";
    }
    if (isTablet) {
      this.cardWidth = "80";
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
    var purple = "#9400d3"; //0
    var blue = "#175aa4"; //1
    var green = "#20d66f"; //2
    var yellow = "#FFDA00"; //3
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

  getBaseHours() {
    if (this.totalHours > this.state.hourCutoff) {
      this.overtimeHours = this.totalHours - this.state.hourCutoff;
      this.baseHours = this.state.hourCutoff;
    } else {
      this.baseHours = this.totalHours;
      this.overtimeHours = 0.0;
    }
  }
  addToHours(t, o, b, whole) {
    if (whole) {
      this.totalHours = t;
      this.overtimeHours = o;
      this.baseHours = b;
    } else {
      this.totalHours += t;
      this.overtimeHours += o;
      this.baseHours += b;
    }

    this.setState({
      totalHours: t
    });
  }

  async getPunches(ppId) {
    if (ppId != -1) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          punchAction: "3",
          id: ppId
        })
      };
      var response = await fetch(
        "https://jax-apps.com/otime_app/api/punch.php",
        requestOptions
      );
      var dataTEXT = await response.text();
      try {
        var data = JSON.parse(dataTEXT);
        return data;
      } catch (e) {
        return dataTEXT;
      }
    }
  }
  liftState() {
    this.setJob(this.state.currJob);
  }
  async setJob(job) {
    var arr = job.value.periodStarts.toString().split(" ");
    var sa = arr[0];
    var pp = await this.getPayPdtStart(job.value.id);
    var punches = await this.getPunches(pp.id);
    var sd = pp.startDay.toString().substring(0, 10);
    let newJob = JSON.parse(JSON.stringify(job));
    this.hourCutoff = job.value.hourCutoff;
    this.resetsWeekly = job.value.resetsWeekly;
    this.setState({
      ppId: pp.id,
      startsAt: sa,
      startsDate: sd,
      punches: punches,
      doubleWeek: job.value.isWeekly,
      payRate: Number(job.value.payrate),
      currJob: newJob
    });
  }
  async setPunches(id) {
    var punches = await this.getPunches(id);
    this.setState({ punches: punches });
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

  openPopup(day, dt, times, baseTime, overTime, overtimeMode, weekNo) {
    var timeArr = times;
    var popDay = [day];
    this.setState({
      showPopup: !this.state.showPopup,
      bgz: "100",
      dt: dt,
      popDay: day,
      popData: timeArr,
      foregr: "fadeout",
      tempBaseTime: baseTime,
      tempOverTime: overTime,
      overtimeMode: overtimeMode,
      weekNo: weekNo
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
    var dayRefs = [];
    var weekOne = [];
    var weekTwo = [];
    var daySelect = [];
    if (this.state.jobs) {
      for (var k = 0; k < this.state.jobs.length; k++) {
        var j = this.state.jobs[k];
        daySelect.push({ value: j, label: j.name });
      }
    }
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames = dayNames.concat(dayNames);

    var payPeriod = "";
    if (this.state.status == 1) {
      payPeriod = (
        <PayPeriod
          id={this.state.ppId}
          startsAt={this.state.startsAt}
          startsDate={this.state.startsDate}
          doubleWeek={this.state.doubleWeek}
          colors={this.state.colors}
          openPopup={this.openPopup.bind(this)}
          cardWidth={this.cardWidth}
          payRate={this.state.payRate}
          punches={this.state.punches}
          addToHours={this.addToHours.bind(this)}
          key={this.state.punches}
          hourCutoff={this.hourCutoff}
          resetsWeekly={this.resetsWeekly}
          multiplier={this.state.multiplier}
        />
      );
    }
    return (
      <div className="App">
        <BackView colorBg={this.state.colors} />
        {this.state.showPopup ? (
          <Popup
            colorBg={this.state.colors}
            day={this.state.popDay}
            payPeriod={this.state.payPeriod}
            id={this.state.ppId}
            job={this.state.currJob}
            dt={this.state.dt}
            data={this.state.popData}
            liftState={this.liftState.bind(this)}
            closePopup={this.closePopup.bind(this)}
            setFn={this.setPunches.bind(this)}
            baseTime={this.state.tempBaseTime}
            overTime={this.state.tempOverTime}
            overtimeMode={this.state.overtimeMode}
            weekNo={this.state.weekNo}
            hourCutoff={this.state.hourCutoff}
          />
        ) : null}
        <div
          class={this.state.status != 0 ? "menuContainer" : "loginContainer"}
          style={{
            marginLeft:
              Number(this.cardWidth) > 40 || this.state.status == 0
                ? "20%"
                : "0%",
            marginRight:
              Number(this.cardWidth) > 40 || this.state.status == 0 > 40
                ? "20%"
                : "0%"
          }}
        >
          <Banner
            status={this.state.status}
            id={this.state.id}
            email={this.state.email}
            name={this.state.name}
            updFn={this.updateUser.bind(this)}
            showJobFn={this.openJobs.bind(this)}
            closeJobFn={this.closeJobs.bind(this)}
            colors={this.state.colors}
            baseHours={this.baseHours}
            overtimeHours={this.overtimeHours}
            totalHours={this.totalHours}
            payRate={this.state.payRate}
            multiplier={this.state.multiplier}
            daySelect={daySelect}
            setJob={this.setJob.bind(this)}
            currJob={this.state.currJob}
            messageColor={this.state.messageColor}
            bannerMessage={this.state.bannerMessage}
            fontSize={this.cardWidth}
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
          <br />
          {payPeriod}
        </div>

        <div
          class="footer"
          style={{
            color: this.state.colors[0],
            background: this.state.colors[1]
          }}
        >
          <a
            href="https://jax-apps.com/otime_app/tm"
            target="_blank"
            style={{
              color: this.state.colors[0],
              background: this.state.colors[1]
            }}
          >
            Terms & Conditions
          </a>
          <a
            href="https://jax-apps.com/otime_app/privacy"
            target="_blank"
            style={{
              color: this.state.colors[0],
              background: this.state.colors[1]
            }}
          >
            Privacy Policy
          </a>
          <a
            href="https://jax-apps.com/"
            target="_blank"
            style={{
              color: this.state.colors[0],
              background: this.state.colors[1]
            }}
          >
            Send Ticket
          </a>
          <br />© 2021 JAX-APPS
        </div>
      </div>
    );
  }
  async componentDidMount() {
    this.setState({ hasData: true });
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
