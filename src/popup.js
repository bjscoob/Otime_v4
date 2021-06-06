import React from "react";
import ReactDOM from "react-dom";
import Time from "./time.js";
import moment from "moment";
//color scheme https://colorpalettes.net/color-palette-4013/

export default class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      punchBtn: "punchIn",
      punchText: "PUNCH IN",
      breakBtn: "break",
      breakText: "START BREAK",
      times: [],
      delActive: false,
      delBtn: "delBtnDis",
      savBtn: "savePopBtn",
      punchId: -1,
      punchTime: "",
      data: this.props.data,
      tempArr: []
    };
    this.inputLen = 0;
    this.timeDiffs = [];
    this.errorColor = "green";
    this.errorMessage = "";
  }
  alert(color, msg) {
    this.errorColor = color;
    this.errorMessage = msg;
  }
  addTime(id, date, isStartPunch) {
    //(id, date, isStartPunch, isComplete)
    var t = new Time(id, date, isStartPunch, false);
    if (!isStartPunch) {
      t.isStartPunch = false;
      t.isComplete = true;
    }
    var a = this.state.data;
    a.push(t);
    this.setState({
      data: a
    });
  }
  timeDiff(before, after, key) {
    var aArr = after.toString().split(":");
    var bArr = before.toString().split(":");
    var aHour = Number(aArr[0]) + Number(aArr[1] / 60);
    var bHour = Number(bArr[0]) + Number(bArr[1] / 60);
    var diff = aHour - bHour;
    var ref = this.timeDiffs.find((x) => x.key == key);
    if (ref == undefined) {
      this.timeDiffs.push({ key: key, value: diff });
    } else {
      ref.value = diff;
    }
    console.log(diff);
  }
  toggleOn(e) {
    this.initTime = e.target.placeholder;
    setTimeout(
      function () {
        //Start the timer
        var id = e.target.id.split("|")[1];
        var time = e.target.id.split("|")[0];
        e.target.placeholder = id;
        e.target.placeholder = "";
        this.setState({
          delActive: false,
          delBtn: "delBtnAbl",
          savBtn: "savePopOff",
          punchId: id,
          punchTime: time,
          timeClass: e.target.className
        });
      }.bind(this),
      150
    );
  }

  toggleOff(e) {
    setTimeout(
      function () {
        var tempArr = this.state.tempArr;
        var id = e.target.id.split("|")[1];
        if (e.target.value.length != 5) {
          e.target.value = "";
          tempArr = tempArr.filter(
            (t) => t.key != id + "|" + e.target.className
          );
        } else {
          var a = e.target.value.toString().split(":");
          if (Number(a[0]) > 23 || Number(a[1]) > 59) {
            e.target.value = "";
            tempArr = tempArr.filter(
              (t) => t.key != id + "|" + e.target.className
            );
          } else {
            tempArr.push({
              key: id + "|" + e.target.className,
              value: id + "|" + e.target.value + ":00|" + e.target.className
            });
            this.timeDiff(
              this.initTime,
              e.target.value,
              id + "|" + e.target.className
            );
            console.log(this.timeDiffs);
          }
        }
        var id = e.target.id.split("|")[0];
        e.target.placeholder = id;
        this.setState({
          delActive: true,
          delBtn: "delBtnDis",
          savBtn: "savePopBtn",
          punchId: -1,
          punchTime: "",
          tempArr: tempArr
        });
      }.bind(this),
      100
    );
  }
  async createPunch() {
    var d = this.props.dt;
    var t = moment().format("HH:mm:ss");
    if (this.props.payPeriod != -1) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          punchAction: "1",
          id: this.props.id,
          dt: d + " " + t
        })
      };
      var response = await fetch(
        "https://jax-apps.com/otime_app/api/punch.php",
        requestOptions
      );
      var dataTEXT = await response.text();
      this.props.liftState();
      this.addTime(dataTEXT, d + " " + t, true);
      try {
        console.log(dataTEXT);
      } catch (e) {}
    }
  }
  async endPunch() {
    var d = this.props.dt;
    var t = moment().format("HH:mm:ss");
    if (this.props.payPeriod != -1) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          punchAction: "2",
          id: this.props.id,
          dt: d + " " + t
        })
      };
      var response = await fetch(
        "https://jax-apps.com/otime_app/api/punch.php",
        requestOptions
      );
      var dataTEXT = await response.text();
      this.props.liftState();
      this.addTime(dataTEXT, d + " " + t, false);
    }
  }
  async delPunch() {
    var tc = this.state.timeClass;
    var id = this.state.punchId;
    var action = tc == "startPunch" ? 4 : 5;
    if (this.props.payPeriod != -1) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          punchAction: action,
          id: id
        })
      };
      var response = await fetch(
        "https://jax-apps.com/otime_app/api/punch.php",
        requestOptions
      );
      var dataTEXT = await response.text();
      this.subtractTime(id, tc);
      this.props.liftState();
      try {
        console.log(dataTEXT);
      } catch (e) {}
    }
  }
  async savePunches() {
    setTimeout(async () => {}, 1000);
    for (var t = 0; t < this.state.tempArr.length; t++) {
      var a = this.state.tempArr[t].value.toString().split("|");
      await this.editPunch(a[0], a[1], a[2]);
    }
    this.props.liftState();
    var diff = 0;
    this.timeDiffs.map((d) => {
      diff = diff + d.value;
    });
    this.props.addFn(diff, false);
  }
  async editPunch(id, time, isStart) {
    var d = this.props.dt;
    var action = isStart == "startPunch" ? 6 : 7;
    if (this.props.payPeriod != -1) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          punchAction: action,
          id: id,
          time: d + " " + time
        })
      };
      var response = await fetch(
        "https://jax-apps.com/otime_app/api/punch.php",
        requestOptions
      );
      var dataTEXT = await response.text();
      this.props.liftState();
      if (dataTEXT == "Success") {
        this.alert("green", dataTEXT);
      } else {
        this.alert("red", dataTEXT);
      }
      setTimeout(() => this.alert("nuetral", ""), 5000);
    }
  }
  subtractTime(id, tc) {
    var arr = this.state.data;
    for (var p = 0; p < this.state.data.length; p++) {
      var punch = this.state.data[p];
      if (punch.id == id && punch.getClass() == tc) {
        arr.splice(p, 1);
      }
    }
    if (tc == "startPunch") {
      for (var m = 0; m < arr.length; m++) {
        var punch = arr[m];
        if (punch.id == id) {
          arr.splice(m, 1);
        }
      }
    }
    try {
      arr.length < 0;
    } catch (e) {
      arr = [];
    }
    this.setState({
      data: arr
    });
  }
  is_numeric(c) {
    if (c >= "0" && c <= "9") {
      return true;
    } else {
      return false;
    }
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
  render() {
    var timeViews = [];
    try {
      for (var l = 0; l < this.state.data.length; l++) {
        var t = this.state.data[l];
        timeViews.push(
          <li>
            {t.getClass() == "startPunch" && (
              <label class={t.getClass()} background="#f6f6f6">
                {t.getText()}
              </label>
            )}
            <input
              class={t.getClass()}
              type="text"
              maxLength="5"
              id={t.time + "|" + t.id}
              placeholder={t.time}
              onFocus={this.toggleOn.bind(this)}
              onBlur={this.toggleOff.bind(this)}
              onChange={this.updText.bind(this)}
            />
            {t.getClass() == "endPunch" && (
              <label class={t.getClass()}>{t.getText()}</label>
            )}
            <hr class={t.getClass()} />
            <br />
          </li>
        );
      }
    } catch (e) {
      console.log("No popup Data");
    }
    return (
      <div className="popup">
        <div className="popup_inner">
          <button className="closeBtn" onClick={this.props.closePopup}>
            x
          </button>
          <h1 id="popBanner">{this.props.day}</h1>
          <p class={this.errorColor}>{this.errorMessage}</p>
          <button class="punchIn" onClick={this.createPunch.bind(this)}>
            punch in
          </button>
          <button class="punchOut" onClick={this.endPunch.bind(this)}>
            punch out
          </button>
          <button
            class={this.state.delBtn}
            disabled={this.state.delActive}
            onClick={this.delPunch.bind(this)}
          >
            delete punch
          </button>
          <div>
            <ul id="popTimes">{timeViews}</ul>
          </div>
          <button
            disabled={!this.state.delActive}
            class={this.state.savBtn}
            onClick={this.savePunches.bind(this)}
          >
            SAVE
          </button>
        </div>
      </div>
    );
  }
}
