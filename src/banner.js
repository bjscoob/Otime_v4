import React from "react";
import sha256 from "crypto-js/sha256";
import Select from "react-select";
import StaggeredMotion from "react-motion";

export default class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
      id: this.props.id,
      count: 0,
      messageColor: this.props.messageColor,
      bannerMessage: this.props.bannerMessage
    };
    this.name = this.props.name;
    this.email = this.props.email;
    this.psswd = "";
  }
  pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  async login() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        email: this.email,
        pswd: this.pswd
      })
    };
    var response = await fetch(
      "https://jax-apps.com/otime_app/api/login.php",
      requestOptions
    );
    var dataTEXT = await response.text();
    try {
      var data = JSON.parse(dataTEXT);

      this.goToHome(data);
      this.setMessage("Logged In", "green");
      this.name = data.name;
      this.email = data.email;
      this.psswd = "";
    } catch (e) {
      this.setMessage(dataTEXT, "red");
    }
  }
  async register() {
    if (this.email == "" || this.name == "" || this.pswd == "") {
      this.setMessage("Please enter all fields.", "red");
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        email: this.email,
        name: this.name,
        pswd: sha256(this.state.pswd).toString()
      })
    };
    var response = await fetch(
      "https://jax-apps.com/otime_app/api/register.php",
      requestOptions
    );
    var text = await response.text();
    var c = "red";
    if (text == "Success! Email has been sent.") {
      c = "green";
    }
    this.setMessage(text, c);
  }
  async forgot() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        email: this.email
      })
    };
    var response = await fetch(
      "https://jax-apps.com/otime_app/api/forgot.php",
      requestOptions
    );
    var text = await response.text();
    var c = "red";
    if (text == "Success! Email has been sent.") {
      c = "green";
    }
    this.setMessage(text, c);
  }

  goToLogin = (event) => {
    this.props.updFn(undefined, 0);
  };
  goToHome(data) {
    this.props.updFn(data, 1);
  }
  goToRegister = (event) => {
    this.email = "";
    this.name = "";
    this.psswd = "";
    this.setState({ status: 2 });
  };
  goToForgot = (event) => {
    this.setState({ status: 9 });
  };
  setName = (event) => {
    this.name = event.target.value;
  };
  setEmail = (event) => {
    this.email = event.target.value;
  };
  setPassword = (event) => {
    this.pswd = event.target.value;
  };
  setMessage(m, c) {
    this.setState({ messageColor: c, bannerMessage: m });
  }
  clearMessage() {
    this.setState({ messageColor: "white", bannerMessage: "Welcome Back" });
  }
  resetMessage() {
    this.setState({
      messageColor: "white",
      bannerMessage: "Welcome"
    });
  }
  getClock(s) {
    return (
      <div style={{ transform: "scale(" + s + ")" }}>
        <div id="logo">
          <div id="imgCont">
            <img
              style={{ zIndex: "100", position: "absolute" }}
              src="https://jax-apps.com/otime_app/pics/clock_bg.svg"
              alt="Clock BG"
              width="100"
              height="100"
            />
            <img
              class="redDollar"
              style={{ zIndex: "200", position: "absolute" }}
              src="https://jax-apps.com/otime_app/pics/yellow_dollar.svg"
              alt="Clock BG"
              width="25"
              height="25"
            />
            <img
              class="greenDollar"
              style={{ zIndex: "300", position: "absolute" }}
              src="https://jax-apps.com/otime_app/pics/gold_dollar.svg"
              alt="Clock BG"
              width="35"
              height="35"
            />
          </div>
          <br />
          Time
        </div>
      </div>
    );
  }
  getBannerContent(statusCode) {
    var fontSize = (this.props.fontSize == 40 ? "15" : "20") + "px";
    var defaultBanner = <div>Unable to Render Banner</div>;
    this.overtime = this.props.overtimeHours * this.props.multiplier;
    var loginBanner = (
      <div>
        {this.getClock(1)}
        <div class="loginFormContainer">
          <form>
            <input
              onChange={this.setEmail.bind(this)}
              class="loginLabel"
              type="email"
              placeholder="email"
            />
            <br />
            <input
              onChange={this.setPassword.bind(this)}
              class="loginLabel"
              type="password"
              placeholder="password"
            />
            <br />
          </form>
        </div>
        <div class="btnContainer">
          <button class="loginSubmit" onClick={this.login.bind(this)}>
            Login
          </button>
          <br />
        </div>
        <div class="forgregCont">
          <br />
          <button class="forgReg" onClick={this.goToForgot.bind(this)}>
            Forgot Password{" "}
          </button>
          <button class="forgReg" onClick={this.goToRegister.bind(this)}>
            Register{" "}
          </button>
        </div>
      </div>
    );

    var registerBanner = (
      <div>
        <h1 id="welcome_banner" class={this.state.messageColor}>
          {this.state.bannerMessage}
        </h1>
        {this.state.bannerMessage != "Welcome " ? (
          <button class="okBtn" onClick={this.resetMessage.bind(this)}>
            OK
          </button>
        ) : (
          ""
        )}
        <br />
        <br />
        <div class="loginFormContainer">
          <form>
            <input
              onChange={this.setName.bind(this)}
              class="loginLabel"
              type="text"
              placeholder="name*"
            />
            <br />
            <input
              onChange={this.setEmail.bind(this)}
              class="loginLabel"
              type="email"
              placeholder="email*"
            />
            <br />
            <input
              onChange={this.setPassword.bind(this)}
              class="loginLabel"
              type="password"
              placeholder="password*"
            />
            <br />
          </form>
          <br />
        </div>
        <div class="btnContainer">
          <button class="loginSubmit" onClick={this.register.bind(this)}>
            Register
          </button>
          <br />
        </div>
        <div class="forgregCont">
          <br />
          <button class="forgReg" onClick={this.goToForgot.bind(this)}>
            Forgot Password{" "}
          </button>
          <button class="forgReg" onClick={this.goToLogin}>
            Login
          </button>
        </div>
      </div>
    );
    var forgotBanner = (
      <div>
        <h1 id="welcome_banner" class={this.state.messageColor}>
          {this.state.bannerMessage}
        </h1>
        {this.state.bannerMessage != "Welcome" ? (
          <button class="okBtn" onClick={this.resetMessage.bind(this)}>
            OK
          </button>
        ) : (
          ""
        )}
        <br />
        <br />
        <div class="loginFormContainer">
          <form>
            <input
              onChange={this.setEmail.bind(this)}
              class="loginLabel"
              type="email"
              placeholder="email*"
            />
            <br />
          </form>
          <br />
        </div>
        <div class="btnContainer">
          <button
            style={{ width: "150px" }}
            class="loginSubmit"
            onClick={this.forgot.bind(this)}
          >
            Send Recovery Email
          </button>
          <br />
        </div>
        <div class="forgregCont">
          <br />
          <button class="forgReg" onClick={this.goToLogin}>
            Login
          </button>
          <button class="forgReg" onClick={this.goToRegister.bind(this)}>
            Register{" "}
          </button>
        </div>
      </div>
    );
    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        borderBottom: "1px dotted pink",
        color: state.isSelected ? "red" : "blue",
        padding: 20
      }),
      control: () => ({
        // none of react-select's styles are passed to <Control />
        width: 200
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = "opacity 300ms";

        return { ...provided, opacity, transition };
      }
    };
    var homeBanner = (
      <div>
        <div class="row">
          <div class="column3">{this.getClock(0.5)}</div>
          <div class="column2">
            <div class="msgCont">
              {" "}
              <h1 id="welcome_banner" class={this.state.messageColor}>
                {this.state.bannerMessage}
              </h1>
              {this.state.bannerMessage != "Welcome Back" ? (
                <button class="okBtn" onClick={this.clearMessage.bind(this)}>
                  OK
                </button>
              ) : (
                ""
              )}
              <h2 id="name_label">{this.name}</h2>
            </div>
          </div>
          <div class="column2"></div>
          <div class="row" style={{ fontSize: fontSize }}>
            <div class="column4">
              <h4>Pay Rate: ${this.props.payRate.toFixed(2)}</h4>
              <Select
                id="sbSearch"
                style={customStyles}
                options={this.props.daySelect}
                onChange={this.props.setJob.bind(this)}
                placeholder="Job..."
              />
              <button
                class="menuItem"
                onClick={() => this.props.showJobFn(this.state.id)}
              >
                Jobs
              </button>
              <br />
              <button class="menuItem" onClick={this.goToLogin}>
                Settings
              </button>
              <br />
              <button class="menuItem" onClick={this.goToLogin}>
                Logout
              </button>
              <br />
            </div>

            <div class="column1">
              <h3
                style={{
                  background: this.props.colors[0],
                  fontSize: fontSize
                }}
              >
                Base Time:{" "}
              </h3>
              <br />
              <p className="timelabel1">
                {this.props.baseHours.toFixed(2) + " hours "}
              </p>
              <br />
              <h3
                style={{
                  background: this.props.colors[0],
                  fontSize: fontSize
                }}
              >
                Over Time:{" "}
              </h3>
              <br />
              <p className="timelabel2">
                {this.pad(this.props.overtimeHours.toFixed(2), 5) + " hours "}
              </p>
              <br />
              <h3
                style={{
                  background: this.props.colors[1],
                  fontSize: fontSize
                }}
              >
                Total Time:{" "}
              </h3>
              <br />
              <p className="timelabel3">
                {this.props.totalHours.toFixed(2) + " hours "}
              </p>
            </div>
            <div class="column1">
              <h3
                style={{
                  background: this.props.colors[0],
                  fontSize: fontSize
                }}
              >
                Base Pay:{" "}
              </h3>
              <br />
              <p className="payLabel1">
                {"$" + (this.props.baseHours * this.props.payRate).toFixed(2)}
              </p>
              <br />
              <h3
                class="olabel"
                style={{
                  background: this.props.colors[0],
                  fontSize: fontSize
                }}
              >
                O-time Pay:{" "}
              </h3>
              <br />
              <p className="payLabel2">
                {"$" + (this.overtime * this.props.payRate).toFixed(2)}
              </p>
              <br />
              <h3
                style={{
                  background: this.props.colors[1],
                  fontSize: fontSize
                }}
              >
                Total Pay:{" "}
              </h3>
              <br />
              <p className="payLabel3">
                {"$" +
                  (
                    (this.props.baseHours + this.overtime) *
                    this.props.payRate
                  ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
    var jobsBanner = (
      <div>
        <h1 id="welcome_banner">Welcome Back</h1>
        <h2 id="name_label">{this.name}</h2>
        <div class="forgregCont">
          <button class="forgReg" onClick={() => this.props.closeJobFn()}>
            Home...
          </button>
          <button class="forgReg" onClick={this.goToLogin}>
            Settings...
          </button>
          <button class="forgReg" onClick={this.goToLogin}>
            Logout
          </button>
        </div>
      </div>
    );
    switch (statusCode) {
      case 0:
        return loginBanner;
      case 1:
        return homeBanner;
      case 2:
        return registerBanner;
      case 3:
        return jobsBanner;
      case 9:
        return forgotBanner;
      default:
        return defaultBanner;
    }
  }
  render() {
    return this.getBannerContent(this.state.status);
  }
  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        status: this.props.status,
        id: this.props.id,
        email: this.props.email,
        name: this.props.name,
        count: this.state.count + 1
      });
    }
  }
}
