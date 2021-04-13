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

  processLogin(json) {
    Cookies.set("token", json.token.val, { expires: 15 });
    Cookies.set("fname", json.user.fname, { expires: 15 });
    document.location.replace("/");
    return;
  }

  submitLogin(event) {
    event.preventDefault();

    // ** PLACEHOLDER ** 

    Cookies.set("token", (new Date().toLocaleDateString()), { expires: 15 });
    Cookies.set("fname", this.state.email, { expires: 15 });
    Cookies.set("userType", this.state.loginType, { expires: 15 });

    if(this.state.loginType == "Driver") {
      document.location.replace("/drive");
    } else {
      document.location.replace("/ride")
    }

    // ** PLACEHOLDER ** 


    console.log(this.state);
    fetch("http://" + window.location.hostname + ":8000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: this.state.password,
        email: this.state.email,
        loginType: this.state.loginType,
      }),
    })
      .then((res) => res.json())
      .then((json) => this.processLogin(json))
      .catch((err) => {
        console.error(err);
      });
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
            <Form.Text className="text-muted" style={{"padding-bottom": "10px"}}>
              Don't have an account? <a href="/register">Click here</a> to register.
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
