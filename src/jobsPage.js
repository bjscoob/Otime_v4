import React from "react";
import JobBtn from "./jobBtn";
import Select from "react-select";
import DatePicker from "react-datepicker";
require("react-datepicker/dist/react-datepicker.css");

export default class JobsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      payrate: "",
      isWeekly: "",
      day: "",
      time: "",
      aOrP: "",
      startDate: "",
      endDate: "",
      formVisible: "none"
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
      id: job.id,
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
  }
  setName = (event) => {
    this.setState({ name: event.target.value });
  };
  setPayrate = (event) => {
    this.setState({ payrate: event.target.value });
  };
  setWeekly = (event) => {
    this.setState({ isWeekly: event.target.value });
  };
  setDay(selectedDay) {
    this.setState({ day: selectedDay.value });
  }
  setTime = (event) => {
    this.setState({ time: event.target.value });
  };
  setAorP(AorP) {
    this.setState({ aOrp: AorP.value });
  }
  getPeriod() {
    return this.state.day + " " + this.state.time + " " + this.state.aOrp;
  }
  setStartDate(date) {
    this.setState({ startDate: date.toString() });
  }
  setEndDate(date) {
    this.setState({ endDate: date.toString() });
  }
  async createJob() {
    var postData = {
      jobAction: "1",
      userId: this.props.id,
      name: this.state.name,
      payrate: this.state.payrate,
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
          onClick={() => this.setState({ formVisible: "block" })}
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
            <label class="container">
              Weekly
              <input
                type="radio"
                name="Weekly"
                checked={this.state.isWeekly == 1}
                value="1"
                onChange={this.setWeekly.bind(this)}
              />
              <span class="checkmark"></span>
            </label>
            <label class="container">
              Bi-Weekly
              <input
                type="radio"
                name="Bi-Weekly"
                checked={this.state.isWeekly == 0}
                value="0"
                onChange={this.setWeekly.bind(this)}
              />
              <span class="checkmark"></span>
            </label>
            <p class="dateLabel"> Start Date:</p>
            <div class="dateCont">
              <DatePicker
                onChange={(date) => this.setStartDate(date)}
                placeholderText={this.state.startDate}
              />
            </div>
            <p class="dateLabel">End Date:</p>
            <div class="dateCont">
              <DatePicker
                onChange={(date) => this.setEndDate(date)}
                placeholderText={this.state.endDate}
              />
            </div>
            <button onClick={this.createJob.bind(this)} class="saveJobBtn">
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
