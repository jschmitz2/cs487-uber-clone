import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import keys from "../keys";
import Login from "../components/login";
import RideRequest from "../components/rideRequest";
import ProgressBar from "react-bootstrap/ProgressBar";
import Alert from 'react-bootstrap/Alert'

const HeadingStyled = styled.h1``;

const ContentDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const Pane = styled.div`
  width: 100%;
  min-width: 300px;
  padding-left: 20px;
`;

const PageDiv = styled.div`
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

class UserRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: null
    };

    let urlParams = new URLSearchParams(window.location.search);
    this.userRouteId = urlParams.get("userRouteId");

    this.map = null;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (loc) => this.setState({ location: loc }),
        () => alert("Can't access location!")
      );
    }
    this.updateRouteStatus = this.updateRouteStatus.bind(this);
    this.updateFunc = window.setInterval(this.updateRouteStatus, 4000);
    this.updateRouteStatus();
  }

  updateRouteStatus() {
    // fetch() to get the most updated status
    // in the meantime, hardcode
    let route = this.state.route;
    if (route == null) {
      route = {
        id: this.userRouteId,
        price: Math.random() * 20,
        dist: Math.random() * 14,
        src: "10 W. 31st St., Chicago, IL",
        dest: "Sears Tower",
        dist: Math.random() * 10,
        stage: 0,
      };
      this.setState({ route: route });
    } else {
      route.stage += 1;
      if (route != null && route.stage < 0) {
        window.clearInterval(this.updateFunc);
      }
      this.setState({ route: route });
    }
  }

  renderMap() {
    if (this.state.location == null) {
      return;
    }
    if (this.state.routed != 1) {
      this.setState({ routed: 1 });
      this.map = (
        <iframe
          src={
            "https://www.google.com/maps/embed/v1/place?key=" +
            keys.gmaps +
            "&q=" +
            this.state.location.coords.latitude +
            ", " +
            this.state.location.coords.longitude +
            "&zoom=14"
          }
          width="500px"
          height="700px"
        />
      );
    }
  }

  progressBar(stage) {
    return (
      <ProgressBar>
        <ProgressBar striped variant={(stage >= 1) ? "success" : "info"} now={20} key={1} label="Route Created"/>
        <ProgressBar striped variant={(stage >= 2) ? "success" : "info"} now={(stage >= 1) ? 50 : 0} key={1} label="Finding Driver"/>
        <ProgressBar striped variant={(stage >= 3) ? "success" : "info"} now={(stage >= 2) ? 50 : 0} key={1} label="Driver Arriving"/>
      </ProgressBar>
    );
  }

  render() {
    this.renderMap();
    if (this.state.route == null) {
      return null;
    }
    return (
      <PageDiv>
        <h1>Route Page</h1>
        <ContentDiv>
          <Pane>
            <h2>Your Route</h2>
            <p>Source: {this.state.route.src}</p>
            <p>Destination: {this.state.route.dest}</p>
            <p>Price: {this.state.route.price.toFixed(2)}</p>
            <p>Distance: {this.state.route.dist.toFixed(2)}</p>
            {this.progressBar(this.state.route.stage)}
          </Pane>
          <Pane>
            <h2>Your location</h2>
            {this.map}
          </Pane>
        </ContentDiv>
      </PageDiv>
    );
  }
}

export default UserRoute;
