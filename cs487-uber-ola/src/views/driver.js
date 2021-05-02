import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import keys from "../keys";
import Login from "../components/login";
import RideRequest from "../components/rideRequest";
import Modal from "react-bootstrap/Modal";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Cookies from "js-cookie";

const HeadingStyled = styled.h1``;

const ContentDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
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
  padding: 20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

class DriverNavInfo extends React.Component {
  constructor(props) {
    super(props);
    this.route = props.route;
  }

  render() {
    if (this.route == null) {
      return null;
    }
    return (
      <div>
        <p>Route price: {this.route.price.toFixed(2)}</p>
        <p>Route time: {this.route.time}</p>
        <p>Time to source: {this.route.time_src}</p>
        <p>Distance to source: {this.route.dist_src}</p>
      </div>
    );
  }
}

class Driver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      routed: -1,
      rides: [],
      showRouteModal: false,
      claimedRoute: {
        src: "10 W. 31st St., Chicago, IL",
        dest: "Sears Tower",
      },
      sort: "price",
    };
    this.map = null;
    this.claimFunc = this.claimFunc.bind(this);
    this.token = Cookies.get("token");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (loc) => this.setState({ location: loc }),
        () => console.error("Error: Can't access user location!")
      );
    }
    this.updateRides = this.updateRides.bind(this);
    this.updateFunc = window.setInterval(this.updateRides, 1000);
    this.updateRides();
  }

  updateRides() {
    if (this.state.location == null) {
      return;
    }
    console.log(this.state.location.coords);
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/driver/routes?token=" +
        this.token +
        "&latititude=" +
        this.state.location.coords.latitude +
        "&longitude=" +
        this.state.location.coords.longitude
    )
      .then((res) => res.json())
      .then((json) => this.setState({ rides: json }));
  }

  renderMap() {
    if (this.state.location == null) {
      return;
    }

    if (this.state.routed != 1) {
      this.setState({ routed: 1 });

      if (this.state.map_type == "route") {
        this.map = (
          <iframe
            src={
              "https://www.google.com/maps/embed/v1/directions?key=" +
              keys.gmaps +
              "&origin=" +
              this.state.route.sourceLat +
              "," +
              this.state.route.sourceLong +
              "&destination=" +
              this.state.route.destLat +
              "," +
              this.state.route.destLong
            }
            width="500px"
            height="700px"
          />
        );
      } else {
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
  }

  claimFunc(route, newStatus) {
    this.setState({ showRouteModal: true, claimedRoute: route });
    fetch(
      "http://" +
        window.location.hostname +
        ":8000/driver/claim?token=" +
        this.token +
        "&userRouteId=" +
        route.id +
        "&newStatus=" +
        newStatus,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((json) => this.setState({ route: json }));
    if (newStatus == 4) {
      this.setState({ showRouteModal: false });
    }
  }

  calc_hourly(ride) {
    return ride.price.toFixed(2) / (ride.time_src + ride.time_trip);
  }

  sortRides(rides, sortBy) {
    console.log(rides);
    if (sortBy == "price") {
      return rides.sort((a, b) => b.price - a.price);
    } else if (sortBy == "time_src") {
      return rides.sort((a, b) => a.time_src - b.time_src);
    } else if (sortBy == "hourly") {
      return rides.sort((a, b) => this.calc_hourly(b) - this.calc_hourly(a));
    }
  }

  render() {
    this.renderMap();
    if (this.state.rides == null) {
      return null;
    }
    let rideRequests = this.state.rides.map((x) => (
      <RideRequest
        key={x.id}
        claimFunc={() => this.claimFunc(x, 2)}
        previewFunc={() =>
          this.setState({ route: x, routed: 0, map_type: "route" })
        }
        req={x}
        borderFunc={() => this.state.route == x}
      />
    ));

    let hideModal = () => {
      if (this.state.route.status == 4) {
        this.setState({ showRouteModal: false });
      }
    };
    let openRouteGoogleMaps = () =>
      window.open(
        "https://www.google.com/maps/dir/?api=1&" +
          "&origin=" +
          this.state.claimedRoute.sourceLat +
          "," +
          this.state.claimedRoute.sourceLong +
          "&destination=" +
          this.state.claimedRoute.destLat +
          "," +
          this.state.claimedRoute.destLong
      );

    let openRouteGoogleMapsSource = () =>
      window.open(
        "https://www.google.com/maps/dir/?api=1&" +
          "&origin=" +
          this.state.location.coords.latitude +
          "," +
          this.state.location.coords.longitude +
          "&destination=" +
          this.state.claimedRoute.sourceLat +
          "," +
          this.state.claimedRoute.sourceLong
      );

    let claimedRideModal =
      this.state.route == null ? null : (
        <Modal show={this.state.showRouteModal} onHide={hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Route Taken!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DriverNavInfo route={this.state.claimedRoute} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={openRouteGoogleMapsSource}>
              Open route to source
            </Button>
            <Button variant="secondary" onClick={openRouteGoogleMaps}>
              Open route from source to destination
            </Button>
            <Button
              onClick={() =>
                this.claimFunc(this.state.route, this.state.route.status + 1)
              }
              variant="primary"
            >
              {this.state.route.status == 2
                ? "Arrived at start location"
                : "Completed route"}
            </Button>
          </Modal.Footer>
        </Modal>
      );

    let rides =
      this.state.rides.length == 0 ? <p>No rides available! </p> : rideRequests;
    return (
      <PageDiv>
        {claimedRideModal}
        <h1>Driver Page</h1>
        <ContentDiv>
          <Pane>
            <h2>Available Rides</h2>
            {/* <ButtonGroup aria-label="Basic example">
              <Button variant={(this.state.sort == "price") ? "primary" : "secondary"} onClick={() => this.setState({ sort: "price"})}>Price</Button>
              <Button variant={(this.state.sort == "time_src") ? "primary" : "secondary"} onClick={() => this.setState({ sort: "time_src"})}>Time to Source</Button>
              <Button variant={(this.state.sort == "hourly") ? "primary" : "secondary"} onClick={() => this.setState({ sort: "hourly"})}>Hourly Pay</Button>
            </ButtonGroup> */}
            <div>{rides}</div>
          </Pane>
          <Pane>
            <h2>
              {this.state.map_type == "route"
                ? "Preview Route"
                : "Your Location"}
            </h2>
            {this.map}
          </Pane>
        </ContentDiv>
      </PageDiv>
    );
  }
}

export default Driver;
