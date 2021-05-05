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
      fname: "",
      lname: "",
      phoneNumber: "",
      password: "",
      email: "",
      vehicle_desc: "",
      plate: "",
      pic: null,
      phoneNumber: "",
      licensePlate: "",
      vehicle_make: "",
      vehicle_color:  "",
      dl_number:  "",
      car_capacity: 1,
      ada: 0
    };

    this.submitAddRider = this.submitAddRider.bind(this);
    this.submitAddDriver = this.submitAddDriver.bind(this);
  }

  processNewUser(json, userType) {
    Cookies.set("token", json.token.val, { expires: 15 });
    Cookies.set("fname", json.user.fname, { expires: 15 });
    Cookies.set("userType", userType, { expires : 15 });

    document.location.replace((userType == "rider" ? "/ride" : "/drive"));
    return;
  }

  submitAddRider(event) {
    event.preventDefault();
    fetch("http://" + window.location.hostname + ":8000/rider/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: this.state.fname,
        lname: this.state.lname,
        phoneNumber: this.state.phone,
        password: this.state.password,
        email: this.state.email,
        pic: null,
        ada: this.state.ada
      }),
    })
      .then((res) => res.json())
      .then((json) => this.processNewUser(json, "rider"))
      .catch((err) => {
        console.error(err);
      });
  }

  submitAddDriver(event) {
    event.preventDefault();
    fetch("http://" + window.location.hostname + ":8000/driver/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: this.state.fname,
        lname: this.state.lname,
        phoneNumber: this.state.phone,
        password: this.state.password,
        email: this.state.email,
        vehicle_desc: this.state.vehicle_desc,
        plate: this.state.plate,
        pic: null,
        phoneNumber: this.state.phone,
        licensePlate: this.state.plate,
        carMake: this.state.vehicle_make,
        carColor:  this.state.vehicle_color,
        driverLicence:  this.state.dl_number,
        numSeats: this.state.car_capacity,
        ada: this.state.ada
      }),
    })
      .then((res) => res.json())
      .then((json) => this.processNewUser(json, "driver"))
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
              <Form.Control
                required
                onChange={(event) =>
                  this.setState({ fname: event.target.value })
                }
                placeholder="First Name"
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                required
                onChange={(event) =>
                  this.setState({ lname: event.target.value })
                }
                placeholder="Last Name"
              />
            </Form.Group>
          </Form.Row>
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
            <Form.Group as={Col}>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="email"
                required
                onChange={(event) =>
                  this.setState({ phone: event.target.value })
                }
                placeholder="(920) 796-3523"
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
            <Form.Group as={Col}>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                required
                type="password"
                validator={(event) =>
                  this.state.password === event.target.value
                }
                placeholder="Last Name"
              />
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
            <Form.Group hidden={this.state.userType == "Driver"} as={Col}>
              <Form.Label>Do you require ADA accomedation?</Form.Label>
              <Form.Control
                as="select"
                onChange={(event) =>
                  this.setState({ ada: event.target.value })
                }
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </Form.Control>
            </Form.Group>
            <Form.Group hidden={this.state.userType != "Driver"} as={Col}>
              <Form.Label>Vehicle Make</Form.Label>
              <Form.Control
                required={this.state.userType == "Driver"}
                onChange={(event) =>
                  this.setState({ vehicle_make: event.target.value })
                }
                placeholder="Honda"
              />
            </Form.Group>
            <Form.Group hidden={this.state.userType != "Driver"} as={Col}>
              <Form.Label>Vehicle Model</Form.Label>
              <Form.Control
                required={this.state.userType == "Driver"}
                onChange={(event) =>
                  this.setState({ vehicle_model: event.target.value })
                }
                placeholder="Accord"
              />
            </Form.Group>
          </Form.Row>
          <Form.Row hidden={this.state.userType != "Driver"}>
            <Form.Group as={Col}>
              <Form.Label>Vehicle Color</Form.Label>
              <Form.Control
                required={this.state.userType == "Driver"}
                onChange={(event) =>
                  this.setState({ vehicle_color: event.target.value })
                }
                placeholder="Grey"
              />
            </Form.Group>

            <Form.Group hidden={this.state.userType != "Driver"} as={Col}>
              <Form.Label>Number of seats</Form.Label>
              <Form.Control
                as="select"
                onChange={(event) =>
                  this.setState({ car_capacity: event.target.value })
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
            <Form.Group as={Col}>
              <Form.Label>License Plate</Form.Label>
              <Form.Control
                required={this.state.userType == "Driver"}
                onChange={(event) =>
                  this.setState({ plate: event.target.value })
                }
                placeholder="F3J-LMA"
              />
            </Form.Group>
            <Form.Group hidden={this.state.userType != "Driver"} as={Col}>
              <Form.Label>ADA Accessible</Form.Label>
              <Form.Control
                as="select"
                onChange={(event) =>
                  this.setState({ ada: event.target.value })
                }
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
          <Form.Group hidden={this.state.userType != "Driver"} as={Col}>
              <Form.Label>Drivers Lisence Number</Form.Label>
              <Form.Control
                required={this.state.userType == "Driver"}
                onChange={(event) =>
                  this.setState({ dl_number: event.target.value })
                }
                placeholder="S532-1533-2535-23"
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Text
              className="text-muted"
              style={{ "padding-bottom": "10px" }}
            >
              Already have an account? <a href="/login">Click here</a> to login.
            </Form.Text>
          </Form.Row>
          <Button variant="primary" type="submit" onClick={(this.state.userType == "Driver" ? this.submitAddDriver : this.submitAddRider)}>
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
