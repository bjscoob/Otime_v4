import React from "react";
import sha256 from "crypto-js/sha256";

export default class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
      id: this.props.id,
      email: this.props.email,
      name: this.props.name,
      count: 0,
      errOn: "none",
      errorMsg: ""
    };
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
  flagError(t) {
    this.setState({
      errOn: "block",
      errorMsg: t
    });
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
    var loginBanner = (
      <div>
        <p class="error" style={{ display: this.state.errOn }}>
          {this.state.errorMsg}
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
          <button class="forgReg">Forgot Password </button>
          <button class="forgReg" onClick={this.goToRegister}>
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
          <button class="forgReg">Forgot Password </button>
          <button class="forgReg" onClick={this.goToLogin}>
            Login
          </button>
        </div>
      </div>
    );
    var homeBanner = (
      <div>
        <h1 id="welcome_banner">Welcome Back</h1>
        <h2 id="name_label">{this.state.name}</h2>
        <div class="forgregCont">
          <button
            class="forgReg"
            onClick={() => this.props.showJobFn(this.state.id)}
          >
            Manage Jobs...
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
      default:
        return defaultBanner;
    }
  }
  render() {
    return this.getBannerContent(this.state.status);
  }
  componentDidUpdate(prevProps) {
    if (this.props.status !== prevProps.status) {
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
