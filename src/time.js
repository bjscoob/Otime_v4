import React from "react";

export default class Time extends React.Component {
  constructor(id, date, isStartPunch, isComplete) {
    super();
    this.id = id;
    this.isComplete = isComplete;
    if (date.length == 11) {
      this.date = date.toString().substring(0, 5);
      this.time = date.toString().substring(6, 11);
    } else {
      this.date = date.toString().substring(5, 10).replace("-", "/");
      this.time = date.toString().substring(11, 16);
    }
    this.isStartPunch = isStartPunch;
    this.hasStop = false;
  }

  getClass() {
    if (this.isStartPunch === 2) {
      return "midPunch";
    }
    if (this.isStartPunch) {
      return "startPunch";
    }
    return "endPunch";
  }
  getText() {
    if (this.isStartPunch === 2) {
      return "";
    }
    if (this.isStartPunch) {
      return "IN :";
    }
    return " : OUT";
  }
  render() {
    return (
      <li>
        {this.getClass() == "startPunch" && (
          <label class={this.getClass()} background="#f6f6f6">
            {this.getText()}
          </label>
        )}
        <input
          class={this.getClass()}
          type="text"
          maxLength="5"
          id={this.time + "|" + this.id}
          placeholder={this.time}
          onFocus={this.toggleOn.bind(this)}
          onBlur={this.toggleOff.bind(this)}
          onChange={this.updText.bind(this)}
        />
        {this.getClass() == "endPunch" && (
          <label class={this.getClass()}>{this.getText()}</label>
        )}
        <hr class={this.getClass()} />
        <br />
      </li>
    );
  }
}
