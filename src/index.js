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
      errorColor: "green",
      errorMessage: "Success!!!"
    };
    this.errorMessage = "Success!!!";
    this.errorColor = "green";
    this.totalHours = 0;
    this.baseHours = 0.0;
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
  addToHours(h, whole) {
    if (whole) {
      this.totalHours = h;
    } else {
      this.totalHours = this.totalHours + h;
    }
    this.getBaseHours();

    this.setState({
      totalHours: h
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
    this.getBaseHours();
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
    //console.log(times);
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
    this.getBaseHours();
    console.log(this.totalHours);
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
    var payPeriod = "";
    if (this.state.status != 0) {
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
            addFn={this.addToHours.bind(this)}
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
            errorColor={this.state.errorColor}
            errorMessage={this.state.errorMessage}
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
      </div>
    );
  }
  async componentDidMount() {
    await this.getData();
    this.setState({ hasData: true });
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
