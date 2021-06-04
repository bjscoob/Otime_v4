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
      isWeekly: "",
      day: "",
      time: "",
      aOrP: "",
      startDate: "",
      endDate: "",
      formVisible: "none",
      hourCutoff: 40.0
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
  }
  openJob(job) {
    var pArr = job.periodStarts.split(" ");
    this.setState({
      currJobid: job.id,
      name: job.name,
      payrate: job.payrate,
      isWeekly: job.isWeekly,
      day: pArr[0],
      time: pArr[1],
      aOrP: pArr[2],
      startDate: job.startDate,
      endDate: job.endDate ? job.endDate : "",
      formVisible: "block"
    });

    this.inputLen = 0;
  }
  setName = (event) => {
    this.setState({ name: event.target.value });
  };
  setPayrate = (event) => {
    this.setState({ payrate: event.target.value });
  };
  sethourCutoff = (event) => {
    if (event.target.value == "") {
      this.setState({ hourCutoff: 40.0 });
    } else {
      this.setState({ hourCutoff: event.target.value });
    }
  };
  setWeekly = (event) => {
    this.setState({ isWeekly: event.target.value });
  };
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
    return this.state.day + " " + this.state.time + " " + this.state.aOrp;
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
  async createJob() {
    var postData = {
      jobAction: "1",
      userId: this.props.id,
      name: this.state.name,
      payrate: this.state.payrate,
      hourCutoff: this.state.hourCutoff,
      isWeekly: this.state.isWeekly,
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
  }
  async saveJob() {
    //	name	payrate	hourCutoff	isWeekly
    //periodStarts	startDate	endDate id
    var postData = {
      jobAction: "4",
      id: this.state.currJobid,
      name: this.state.name,
      hourCutoff: this.state.hourCutoff,
      payrate: this.state.payrate,
      isWeekly: this.state.isWeekly,
      periodStarts: this.getPeriod(),
      startDate: this.state.endDate,
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
    console.log(result);
  }
  render() {
    var listItems = [];
    for (var a = 0; a < this.props.jobs.length; a++) {
      var job = this.props.jobs[a];
      listItems.push(
        <JobBtn
          job={job}
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
              currJobId: "",
              formVisible: "block"
            })
          }
        >
          {" "}
          New Job +
        </button>
        <div class="jobPage">
          <div class="jobsCont">{listItems}</div>
          <form class="jobForm" style={{ display: this.state.formVisible }}>
            <input
              type="text"
              placeholder={this.state.name}
              onChange={this.setName.bind(this)}
            />
            <br />
            <br />
            <div class="payrateBox">
              $
              <input
                class="payrateBox"
                type="text"
                placeholder={this.state.payrate}
                onChange={this.setPayrate.bind(this)}
              />{" "}
              /hr
            </div>
            <div class="payrateBox">
              Overtime After:
              <input
                class="payRateBox"
                type="text"
                placeholder={Number(this.state.hourCutoff).toFixed(2)}
                onChange={this.sethourCutoff.bind(this)}
              />
              hours
            </div>
            Payperiod Starts:
            <br />
            <div style={{ width: "100%" }}>
              <Select
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
            <br />
            <button class="weeklyRadio">Weekly</button>
            <button class="weeklyRadio">Bi-Weekly</button>
            <p class="dateLabel"> Start Date:</p>
            <div class="dateCont">
              <DatePicker
                onChange={(date) => this.setStartDate(date)}
                placeholderText={this.state.startDate}
                dateFormat="YYYY-MM-DD HH:mm:ss"
              />
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
            <button class="deleteJobBtn"> Delete</button>
          </form>
        </div>
      </div>
    );
  }
}
