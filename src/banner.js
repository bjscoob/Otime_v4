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
      email: this.props.email,
      name: this.props.name,
      count: 0,
      errColor: "green",
      errorMsg: "Success!"
    };
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
        email: this.state.email,
        pswd: sha256(this.state.pswd).toString()
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
    } catch (e) {
      this.flagError(dataTEXT);
    }
  }
  async register() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        email: this.state.email,
        name: this.state.name,
        pswd: sha256(this.state.pswd).toString()
      })
    };
    fetch(
      "https://jax-apps.com/otime_app/api/register.php",
      requestOptions
    ).then((response) => response.data);
  }
  async forgot() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        email: this.state.email
      })
    };
    console.log(requestOptions);
    var response = await fetch(
      "https://jax-apps.com/otime_app/api/forgot.php",
      requestOptions
    );
    console.log(await response.text());
  }
  flagError(isError, t) {
    this.errorColor = isError ? "red" : "green";
    this.errorMsg = t;
  }

  goToLogin = (event) => {
    this.props.updFn(undefined, 0);
  };
  goToHome(data) {
    this.props.updFn(data, 1);
  }
  goToRegister = (event) => {
    this.setState({ status: 2 });
  };
  goToForgot = (event) => {
    this.setState({ status: 9 });
  };
  setName = (event) => {
    this.setState({ name: event.target.value });
  };
  setEmail = (event) => {
    this.setState({ email: event.target.value });
  };
  setPassword = (event) => {
    this.setState({ pswd: event.target.value });
  };
  getBannerContent(statusCode) {
    var defaultBanner = <div>Unable to Render Banner</div>;
    this.overtime = this.props.overtimeHours * this.props.multiplier;
    var loginBanner = (
      <div>
        <p class="error" style={{ color: this.props.errorColor }}>
          {this.props.errorMsg}
        </p>
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
    var homeBanner = (
      <div>
        <div class="row">
          <div class="column3">
            <h4>Pay Rate: ${this.props.payRate.toFixed(2)}</h4>
            <Select
              id="sbSearch"
              options={this.props.daySelect}
              onChange={this.props.setJob.bind(this)}
              placeholder="Job..."
            />
          </div>
          <div class="column2">
            <p class={this.props.errorColor} style={{ marginBottom: "-30px" }}>
              {this.props.errorMessage}
            </p>
            <h1 id="welcome_banner">Welcome Back</h1>
            <h2 id="name_label">{this.state.name}</h2>
          </div>
          <div class="row">
            <div class="column1">
              <h3
                style={{
                  background: this.props.colors[0]
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
                  background: this.props.colors[0]
                }}
              >
                Over Time:{" "}
              </h3>
              <br />
              <p className="timelabel2">
                {this.pad(this.props.overtimeHours.toFixed(2), 5) + " hours "}
              </p>
              <br />
              <hr class="leftHr" />
              <h3
                style={{
                  background: this.props.colors[1]
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
                  background: this.props.colors[0]
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
                  background: this.props.colors[0]
                }}
              >
                O-time Pay:{" "}
              </h3>
              <br />
              <p className="payLabel2">
                {"$" + (this.overtime * this.props.payRate).toFixed(2)}
              </p>
              <br />
              <hr class="rightHr" />
              <h3
                style={{
                  background: this.props.colors[1]
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
            <div class="forgregCont">
              <button
                class="menuItem"
                onClick={() => this.props.showJobFn(this.state.id)}
              >
                Jobs
              </button>
              <button class="menuItem" onClick={this.goToLogin}>
                Settings
              </button>
              <button class="menuItem" onClick={this.goToLogin}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
    var jobsBanner = (
      <div>
        <h1 id="welcome_banner">Welcome Back</h1>
        <h2 id="name_label">{this.state.name}</h2>
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
