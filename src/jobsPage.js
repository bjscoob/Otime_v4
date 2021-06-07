import React from "react";
import JobBtn from "./jobBtn";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";
require("react-datepicker/dist/react-datepicker.css");

export default class JobsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currJobid: "",
      name: "",
      payrate: "",
      isWeekly: "0",
      resetsWeekly: "0",
      day: "",
      time: "",
      aOrP: "AM",
      startDate: "",
      endDate: "",
      formVisible: "none",
      hourCutoff: 40.0,
      jobs: this.props.jobs
    };
    this.days = [
      { value: "Sunday", label: "Sunday" },
      { value: "Monday", label: "Monday" },
      { value: "Tuesday", label: "Tuesday" },
      { value: "Wednesday", label: "Wednesday" },
      { value: "Thursday", label: "Thursday" },
      { value: "Friday", label: "Friday" },
      { value: "Saturday", label: "Saturday" }
    ];
    this.aOrP = [
      { value: "AM", label: "AM" },
      { value: "PM", label: "PM" }
    ];

    this.inputLen = 0;
    this.isWeekly = "0";
  }
  openJob(job) {
    this.inputLen = 0;
    this.isWeekly = job.isWeekly;
    var pArr = job.periodStarts.split(" ");
    //	name	payrate	hourCutoff	isWeekly
    //periodStarts	startDate	endDate id
    this.setState({
      currJobid: job.id,
      name: job.name,
      payrate: job.payrate,
      isWeekly: job.isWeekly,
      hourCutoff: job.hourCutoff,
      resetsWeekly: job.resetsWeekly,
      day: pArr[0],
      time: pArr[1],
      aOrP: pArr[2],
      startDate: job.startDate,
      endDate: job.endDate ? job.endDate : "",
      formVisible: "block"
    });
  }
  setName = (event) => {
    this.setState({ name: event.target.value });
  };
  setPayrate = (e) => {
    var inputText = e.target.value;
    //test the string for numeric
    var lastChar = inputText[inputText.length - 1];
    var oldText = inputText.toString().substring(0, inputText.length - 1);
    if (!this.is_numeric(lastChar) && !(lastChar === ".")) {
      e.target.value = oldText;
    }
    //allow only 1 decimal
    if (oldText.toString().includes(".") && lastChar === ".") {
      e.target.value = oldText;
    }
    this.setState({ payrate: e.target.value });
  };
  sethourCutoff = (e) => {
    var inputText = e.target.value;
    //test the string for numeric
    var lastChar = inputText[inputText.length - 1];
    var oldText = inputText.toString().substring(0, inputText.length - 1);
    if (!this.is_numeric(lastChar) && !(lastChar === ".")) {
      e.target.value = oldText;
    }
    //allow only 1 decimal
    if (oldText.toString().includes(".") && lastChar === ".") {
      e.target.value = oldText;
    }
    if (e.target.value == "") {
      this.setState({ hourCutoff: 40.0 });
    } else {
      this.setState({ hourCutoff: e.target.value });
    }
  };
  setWeekly = (event) => {
    event.preventDefault();
    this.setState({ isWeekly: "1", resetsWeekly: "1" });
  };
  setBiWeekly = (event) => {
    event.preventDefault();
    this.setState({ isWeekly: "0" });
  };
  setResetsWeekly() {
    if (this.state.resetsWeekly == "1") {
      this.setState({ resetsWeekly: "0" });
    } else {
      this.setState({ resetsWeekly: "1" });
    }
  }
  setDay(selectedDay) {
    this.setState({ day: selectedDay.value });
  }
  is_numeric(c) {
    if (c >= "0" && c <= "9") {
      return true;
    } else {
      return false;
    }
  }
  setTime = (e) => {
    var inputText = e.target.value;
    //test the string for numeric
    var lastChar = inputText[inputText.length - 1];
    if (!this.is_numeric(lastChar) && !(lastChar === ":")) {
      e.target.value = inputText.toString().substring(0, inputText.length - 1);
      return;
    }
    if (inputText.length == 2 && this.inputLen != 3) {
      this.inputLen = 3;
      e.target.value = inputText + ":";
    }
    if (inputText.length == 3 && this.inputLen == 4) {
      this.inputLen = 2;
      e.target.value = inputText.toString().substring(0, 2);
    }
    if (inputText.length == 3 && this.is_numeric(lastChar)) {
      e.target.value = inputText.toString().substring(0, 2) + ":" + lastChar;
    }
    this.inputLen = e.target.value.length;
    this.setState({ time: e.target.value });
  };
  setAorP(AorP) {
    this.setState({ aOrp: AorP.value });
  }
  getPeriod() {
    return this.state.day + " " + this.state.time + " " + this.state.aOrP;
  }
  getPeriodAbbr() {
    return (
      this.state.day.substr(0, 3) +
      " " +
      this.state.time +
      " " +
      this.state.aOrP
    );
  }
  setStartDate(date) {
    var dateArr = date.toString().split(" ");
    var dateStr =
      dateArr[1] + " " + dateArr[2] + " " + dateArr[3] + " " + dateArr[4];
    this.setState({ startDate: moment(dateStr).format("YYYY-MM-DD HH:mm:ss") });
  }
  setEndDate(date) {
    var dateArr = date.toString().split(" ");
    var dateStr =
      dateArr[1] + " " + dateArr[2] + " " + dateArr[3] + " " + dateArr[4];
    this.setState({ endDate: moment(dateStr).format("YYYY-MM-DD HH:mm:ss") });
  }
  updText(e) {
    var inputText = e.target.value;
    //test the string for numeric
    var lastChar = inputText[inputText.length - 1];
    if (!this.is_numeric(lastChar) && !(lastChar === ":")) {
      e.target.value = inputText.toString().substring(0, inputText.length - 1);
      return;
    }
    if (inputText.length == 2 && this.inputLen != 3) {
      this.inputLen = 3;
      e.target.value = inputText + ":";
    }
    if (inputText.length == 3 && this.inputLen == 4) {
      this.inputLen = 2;
      e.target.value = inputText.toString().substring(0, 2);
    }
    if (inputText.length == 3 && this.is_numeric(lastChar)) {
      e.target.value = inputText.toString().substring(0, 2) + ":" + lastChar;
    }
    this.inputLen = e.target.value.length;
  }
  updPay(e) {
    var inputText = e.target.value;
    //test the string for numeric
    var lastChar = inputText[inputText.length - 1];
    var oldText = inputText.toString().substring(0, inputText.length - 1);
    if (!this.is_numeric(lastChar) || !(lastChar === ".")) {
      e.target.value = oldText;
      return;
    }
    //allow only 1 decimal
    if (oldText.toString().includes(".") && lastChar === ".") {
      e.target.value = oldText;
      return;
    }
  }
  checkData() {
    if (
      this.state.name == undefined ||
      this.state.payrate == undefined ||
      this.state.hourCutoff == undefined ||
      this.state.isWeekly == undefined ||
      this.state.day == undefined ||
      this.state.time == undefined ||
      this.state.startDate == undefined
    ) {
      console.log("Job Data Incomplete");
      return false;
    }
    return true;
  }
  createJob = async (event) => {
    event.preventDefault();
    if (this.checkData()) {
      var postData = {
        jobAction: "1",
        userId: this.props.id,
        name: this.state.name,
        payrate: this.state.payrate,
        hourCutoff: this.state.hourCutoff,
        isWeekly: this.state.isWeekly,
        resetsWeekly: this.state.resetsWeekly,
        period: this.getPeriod(),
        startDate: this.state.startDate
      };
      if (this.state.endDate) {
        postData = {
          jobAction: "1",
          userId: this.props.id,
          name: this.state.name,
          payrate: this.state.payrate,
          hourCutoff: this.state.hourCutoff,
          isWeekly: this.state.isWeekly,
          resetsWeekly: this.state.resetsWeekly,
          period: this.getPeriod(),
          startDate: this.state.endDate,
          endDate: this.state.endDate
        };
      }

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(postData)
      };
      var response = await fetch(
        "https://jax-apps.com/otime_app/api/job.php",
        requestOptions
      );
      var result = await response.text();
      if (result == -1) {
        console.log("Duplicate Name");
      } else {
        var jobs = this.state.jobs;
        jobs.push({
          id: result,
          userId: this.props.id,
          name: this.state.name,
          payrate: this.state.payrate,
          hourCutoff: this.state.hourCutoff,
          isWeekly: this.state.isWeekly,
          resetsWeekly: this.state.resetsWeekly,
          periodStarts: this.getPeriod(),
          startDate: this.state.endDate,
          endDate: this.state.endDate
        });

        this.setState({ jobs: jobs });
      }
    }
  };
  deleteJob = async (event) => {
    event.preventDefault();
    var postData = {
      jobAction: "5",
      id: this.state.currJobid
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(postData)
    };
    var response = await fetch(
      "https://jax-apps.com/otime_app/api/job.php",
      requestOptions
    );
    var result = await response.text();
    var jobs = this.state.jobs;
    for (var p = 0; p < this.state.jobs.length; p++) {
      var job = this.state.jobs[p];
      if (job.id == this.state.currJobid) {
        jobs.splice(p, 1);
      }
    }
    this.setState({ jobs: jobs, formVisible: "none" });
  };
  saveJob = async (event) => {
    event.preventDefault();
    //	name	payrate	hourCutoff	isWeekly
    //periodStarts	startDate	endDate id
    if (this.checkData()) {
      var postData = {
        jobAction: "4",
        id: this.state.currJobid,
        name: this.state.name,
        endDate: this.state.endDate
      };
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(postData)
      };

      var response = await fetch(
        "https://jax-apps.com/otime_app/api/job.php",
        requestOptions
      );
      var result = await response.text();
      if (result == "Success") {
        var jobs = this.state.jobs;
        for (var p = 0; p < this.state.jobs.length; p++) {
          var job = this.state.jobs[p];
          var uId = job.userId;
          if (job.id == this.state.currJobid) {
            jobs[p] = {
              userId: uId,
              id: this.state.currJobid,
              name: this.state.name,
              hourCutoff: this.state.hourCutoff,
              payrate: this.state.payrate,
              isWeekly: this.state.isWeekly,
              resetsWeekly: this.state.resetsWeekly,
              periodStarts: this.getPeriod(),
              startDate: this.state.startDate,
              endDate: this.state.endDate
            };
          }
        }
        this.setState({ jobs: jobs });
      }
    }
  };
  render() {
    var resetsWeeklyCont =
      this.state.isWeekly == 0 ? (
        <div class="nameLabel">
          <br />
          <input
            type="checkbox"
            class="resetBox"
            defaultChecked={this.state.resetsWeekly == "1" ? true : false}
            onChange={this.setResetsWeekly.bind(this)}
          />{" "}
          O-time Resets Weekly
        </div>
      ) : (
        ""
      );
    var jobForm = (
      <form class="jobForm" style={{ display: this.state.formVisible }}>
        <div class="jobBox">
          <p>Name*:</p>
          <input
            type="text"
            value={this.state.name}
            style={{ textAlign: "center", marginTop: "-20px" }}
            onChange={this.setName.bind(this)}
          />
        </div>
        <br />
        <div class="jobBox">
          Payrate*:
          <br />
          <div
            class="payrateBox"
            style={{ boxShadow: "0px 0px 0px transparent" }}
          >
            $
            <input
              class="payrateBoxInp"
              type="text"
              placeholder={this.state.payrate}
              onChange={this.setPayrate.bind(this)}
              style={{ marginBottom: "-10px" }}
            />{" "}
            /hr
          </div>
        </div>
        <div class="payrateBox" style={{ marginTop: "10px" }}>
          O-time after*:
          <input
            class="payrateBoxInp"
            type="text"
            style={{ width: "40px" }}
            placeholder={Number(this.state.hourCutoff).toFixed(2)}
            onChange={this.sethourCutoff.bind(this)}
          />
          hours
        </div>
        <br />
        <div class="jobBox" style={{ width: "150px" }}>
          Payperiod Starts*:
          <br />
          <div style={{ width: "100%", boxShadow: "0px 0px 5px black" }}>
            <Select
              class="aOrpCont"
              onChange={this.setDay.bind(this)}
              options={this.days}
              placeholder={this.state.day}
            />
          </div>
          <div class="aOrpCont">
            <input
              onChange={this.setTime.bind(this)}
              class="timeBox"
              type="text"
              maxLength="5"
              placeholder={this.state.time}
            />
            <div style={{ width: "100%" }}>
              <Select
                class="aOrp"
                options={this.aOrP}
                placeholder={this.state.aOrP}
                onChange={this.setAorP.bind(this)}
              />
            </div>
          </div>
        </div>
        <br />
        <button
          onClick={this.setWeekly.bind(this)}
          class={
            this.state.isWeekly == "1" ? "weeklyRadioOn" : "weeklyRadioOff"
          }
        >
          Weekly
        </button>
        <button
          onClick={this.setBiWeekly.bind(this)}
          class={
            this.state.isWeekly == "0" ? "weeklyRadioOn" : "weeklyRadioOff"
          }
        >
          Bi-Weekly
        </button>
        {resetsWeeklyCont}
        <p class="dateLabel"> First PayPeriod*:</p>
        <div class="dateCont">
          <DatePicker
            onChange={(date) => this.setStartDate(date)}
            placeholderText={this.state.startDate}
            dateFormat="YYYY-MM-DD HH:mm:ss"
          />
        </div>

        <button
          onClick={
            this.state.currJobid == ""
              ? this.createJob.bind(this)
              : this.saveJob.bind(this)
          }
          class="saveJobBtn"
        >
          {" "}
          Save
        </button>
        <button onClick={this.deleteJob.bind(this)} class="deleteJobBtn">
          {" "}
          Delete
        </button>
      </form>
    );
    var jobView = (
      <form class="jobForm" style={{ display: this.state.formVisible }}>
        <div class="jobBox">
          <p>Name*:</p>
          <input
            type="text"
            value={this.state.name}
            style={{ textAlign: "center", marginTop: "-20px" }}
            onChange={this.setName.bind(this)}
          />
          <div>
            <div class="jobLeftField">
              <b>Pay Rate:</b>
              <div class="jobDatum">
                ${Number(this.state.payrate).toFixed(2)}/hr
              </div>
            </div>
            <div class="jobRightField">
              <b>Overtime Starts:</b>
              <div class="jobDatum">
                {Number(this.state.hourCutoff).toFixed(2)}hr
              </div>
            </div>
            <div class="jobRightField">
              <b>Pay Period:</b>
              <div class="jobDatum">{this.getPeriodAbbr()}</div>
            </div>
            <div class="jobRightField">
              <b>{this.state.isWeekly == "1" ? "Weekly" : "Bi-Weekly"}</b>
              <i class="jobDatum">
                {" "}
                {this.state.resetsWeekly == "1" ? "Resets Weekly" : ""}
              </i>
            </div>
            <div class="jobRightField">
              <b>Start Date:</b>
              <div class="jobDatum">
                {this.state.startDate.toString().split(" ")[0]}
              </div>
            </div>
          </div>
        </div>

        <p class="dateLabel">End Date:</p>
        <div class="dateCont">
          <DatePicker
            onChange={(date) => this.setEndDate(date)}
            placeholderText={this.state.endDate}
          />
        </div>
        <button
          onClick={
            this.state.currJobid == ""
              ? this.createJob.bind(this)
              : this.saveJob.bind(this)
          }
          class="saveJobBtn"
        >
          {" "}
          Save
        </button>
        <button onClick={this.deleteJob.bind(this)} class="deleteJobBtn">
          {" "}
          Delete
        </button>
      </form>
    );
    var jobContent = this.state.currJobid == "" ? jobForm : jobView;
    var listItems = [];
    for (var a = 0; a < this.state.jobs.length; a++) {
      var job = this.state.jobs[a];
      listItems.push(
        <JobBtn
          job={job}
          hasCurr={this.state.currJobid == job.id}
          fontSize={this.props.fontSize}
          setJobData={this.openJob.bind(this)}
        />
      );
    }

    return (
      <div style={{ marginTop: 40 }}>
        <button
          class="newJobBtn"
          onClick={() =>
            this.setState({
              formVisible: "block",
              currJobid: "",
              name: "",
              payrate: "",
              isWeekly: "0",
              resetsWeekly: "0",
              day: "",
              time: "",
              aOrP: "AM",
              startDate: "",
              endDate: "",
              hourCutoff: 40.0
            })
          }
        >
          {" "}
          New Job +
        </button>
        <div class="jobPage">
          <div class="jobsCont">{listItems}</div>
          {jobContent}
        </div>
      </div>
    );
  }
}
