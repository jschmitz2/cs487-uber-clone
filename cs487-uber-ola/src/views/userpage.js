import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import keys from "../keys";
import Login from "../components/login";
import Cookies from "js-cookie";

const HeadingStyled = styled.h1``;

const ContentDiv = styled.div`
  width: 100%;
  display: flex;
  padding: 20px;
  flex-direction: column;
`;

const Pane = styled.div`
  max-width: 400px;
  min-width: 300px;
  padding-left: 20px;
`;

const PageDiv = styled.div`
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.userType = Cookies.get("userType");
    this.token = Cookies.get("token");
    this.fname = Cookies.get("fname");
    this.state = {
      tripData: null,
      driver: null,
      rider: null,
    };
  }

  buildUserInfo(user, tripData) {
    if (user == null) {
      return null;
    }
    return (
      <div>
        <div>
          <h3>Your Stats</h3>
        <p>
          Your name: {user.fname} {user.lname}.
        </p>
        <p>Your email: {user.email}</p>
        <p>Your phone number: {user.email}</p>
        <p>Total rides taken: {tripData.numTrips}.</p>
        <p>Total spent: ${tripData.totalSpend.toFixed(2)}.</p>
        <p>Average price: ${tripData.avgPrice.toFixed(2)}.</p>
        </div>

        <div>
          <h3>Purchase History By Card</h3>
          {tripData.trips.map((x) => <p>{(new Date(x.timestamp)).toLocaleString()} - {x.distance} for {x.price.toFixed(2)} on card {x.card.number.substring(x.card.number.length - 4)}</p>)}
        </div>
      </div>
    );
  }

  buildDriverInfo(user, tripData) {
    if (user == null) {
      return null;
    }

    return (
      <div>
        <div>
        <p>
          Your name: {user.fname} {user.lname}.
        </p>
        <p>Your email: {user.email}</p>
        <p>Your car's carrying capacity: {user.numSeats}</p>
        <p>Your car: {user.carColor} {user.carMake}, with plate {user.licensePlate}.</p>
        <p>Total rides : {tripData.numTrips}.</p>
        <p>Total rides driven: {tripData.numTrips}.</p>
        <p>Total earnings: ${tripData.totalSpend.toFixed(2)}.</p>
        <p>Average income per ride: ${tripData.avgPrice.toFixed(2)}.</p>
        </div>

        <div>
          <h3>Rider History</h3>
          {tripData.trips.map((x) => <p>{(new Date(x.timestamp)).toLocaleString()} - {x.distance} for {x.price.toFixed(2)} for user {x.rider.fname}</p>)}
        </div>
      </div>
    );
  }

  componentDidMount() {
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/summary?token=" +
        this.token +
        "&mode=" +
        this.userType
    )
      .then((res) => res.json())
      .then((json) => this.setState({ tripData: json }));

    if (this.userType == "driver") {
      fetch(
        "http://" +
          window.location.hostname +
          ":8000/driver/get?token=" +
          this.token
      )
        .then((res) => res.json())
        .then((json) => this.setState({ driver: json }));
    }

    if (this.userType == "rider") {
      fetch(
        "http://" +
          window.location.hostname +
          ":8000/rider/get?token=" +
          this.token
      )
        .then((res) => res.json())
        .then((json) => this.setState({ rider: json }));
    }
  }

  render() {
    let content = null;
    if (this.state.tripData == null) {
      return null;
    }
    return (
      <PageDiv>
        <ContentDiv>
          <h1>Your Account</h1>
          {this.buildDriverInfo(this.state.driver, this.state.tripData)}
          {this.buildUserInfo(this.state.rider, this.state.tripData)}
          <button
            onClick={() => {
              Cookies.remove("fname");
              Cookies.remove("token");
              Cookies.remove("userType");
              document.location.replace("/landing");
            }}
          >
            Click here to log out
          </button>
        </ContentDiv>
      </PageDiv>
    );
  }
}

export default UserPage;
