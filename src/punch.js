import React from "react";

export default class Punch extends React.Component {
  constructor(id, start, end) {
    super();
    this.id = id;
    this.elapsedTime = "0.0";
    this.start = start;
    this.end = end;
    try {
      var startArr = start.split(" ");
      this.startDate = startArr[0].toString().substring(0, 10);
      this.startTime = startArr[1];
    } catch (e) {
      this.startTime = "";
      console.log("Empty Punch Id: " + id);
    }
    try {
      var endArr = end.split(" ");
      this.endDate = endArr[0].toString().substring(0, 10);
      this.endTime = endArr[1];
    } catch (e) {
      this.endTime = "";
      console.log("Open Punch Id: " + id);
    }
  }

  render() {
    return null;
  }
}
