import React from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Cookies from "js-cookie";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: null,
      email: null,
      lname: null,
      password: null,
      pic: null,
      graddate: null,
      city: null,
      state: null,
      newUser: null
    };

    this.submitAddUser = this.submitAddUser.bind(this);
  }

  processNewUser(json) {
    Cookies.set("token", json.token.val, { expires: 15 });
    Cookies.set("fname", json.user.fname, { expires: 15 });
    document.location.replace("/");
    return
  }

  submitAddUser(event) {
    event.preventDefault()
    fetch("http://" + window.location.hostname + ":8000/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: this.state.fname,
        lname: this.state.lname,
        password: this.state.password,
        email: this.state.email,
        graddate: this.state.graddate,
        city: this.state.city,
        state: this.state.state
      })})
    .then((res) => res.json())
    .then((json) => this.processNewUser(json))
    .catch((err) => {
      console.error(err);
      });
  }

  newUserForm() {
    return (
      <div>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>First Name</Form.Label>
              <Form.Control required onChange={(event) => this.setState({ fname: event.target.value })} placeholder="First Name"/>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control required onChange={(event) => this.setState({ lname: event.target.value })} placeholder="Last Name"/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required onChange={(event) => this.setState({ email: event.target.value })} placeholder="jbiden@whitehouse.gov"/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Enter password</Form.Label>
              <Form.Control required type="password" onChange={(event) =>  this.setState({ password: event.target.value })} placeholder=""/>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control required type="password" validator={(event) => (this.state.password === event.target.value)} placeholder="Last Name"/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>City</Form.Label>
              <Form.Control required onChange={(event) => this.setState({ city: event.target.value })} placeholder="Chicago"/>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>State abbreviation</Form.Label>
              <Form.Control required onChange={(event) => this.setState({ state: event.target.value })} pattern="[A-Z]{2}" placeholder="IL"/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>User Type</Form.Label>
              <Form.Control
                  as="select"
                  onChange={(event) =>
                    this.setState({ userType: event.target.value })
                  }
                >
                  <option>Rider</option>
                  <option>Driver</option>
                </Form.Control>
            </Form.Group>
            <Form.Group hidden={this.state.userType != "Driver"} as={Col}>
            <Form.Label>Number of seats</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) =>
                    this.setState({ carCapacity: event.target.value })
                  }
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
          <Form.Text className="text-muted" style={{"padding-bottom": "10px"}}>
              Already have an account? <a href="/login">Click here</a> to login.
            </Form.Text>
          </Form.Row>
          <Button variant="primary" type="submit" onClick={this.submitAddUser}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  render() {
    return this.newUserForm();
  }
}

export default Register;
