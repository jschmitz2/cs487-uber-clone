import React from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Cookies from "js-cookie";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      loginType: "Driver",
    };
    this.submitLogin = this.submitLogin.bind(this);
  }

  processLogin(json, mode) {
    Cookies.set("token", json.token.val, { expires: 15 });
    Cookies.set("fname", json.user.fname, { expires: 15 });
    if (mode == "driver") {
      document.location.replace("/drive");
    } else {
      document.location.replace("/ride");
    }
  }

  submitLogin(event) {
    event.preventDefault();

    // ** PLACEHOLDER **

    if (this.state.loginType == "Driver") {
      fetch("http://" + window.location.hostname + ":8000/driver/login", {
        method: "POST",
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      })
        .then((res) => res.json())
        .then((json) => this.processLogin(json, "driver"));
    } else {
      fetch("http://" + window.location.hostname + ":8000/rider/login", {
        method: "POST",
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      })
        .then((res) => res.json())
        .then((json) => this.processLogin(json, "rider"));
    }
  }

  loginForm() {
    return (
      <div>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                onChange={(event) =>
                  this.setState({ email: event.target.value })
                }
                placeholder="jbiden@whitehouse.gov"
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Enter password</Form.Label>
              <Form.Control
                required
                type="password"
                onChange={(event) =>
                  this.setState({ password: event.target.value })
                }
                placeholder=""
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group controlId="formBasicRange">
              <Form.Control
                onClick={(event) =>
                  this.setState({ loginType: event.target.value })
                }
                as="select"
                custom
              >
                <option>Driver</option>
                <option>Rider</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Text
              className="text-muted"
              style={{ "padding-bottom": "10px" }}
            >
              Don't have an account? <a href="/register">Click here</a> to
              register.
            </Form.Text>
          </Form.Row>
          <Button variant="primary" type="submit" onClick={this.submitLogin}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  render() {
    return this.loginForm();
  }
}

export default Login;
