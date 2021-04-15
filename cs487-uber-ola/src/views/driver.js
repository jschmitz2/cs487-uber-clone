import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import keys from "../keys";
import Login from "../components/login";
import RideRequest from "../components/rideRequest";
import Modal from "react-bootstrap/Modal";
import ButtonGroup from 'react-bootstrap/ButtonGroup'

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
        <p>Route source: {this.route.src}</p>
        <p>Route destination: {this.route.dest}</p>
        <p>Route price: {this.route.price.toFixed(2)}</p>
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
      sort: "price"
    };
    this.map = null;
    this.claimFunc = this.claimFunc.bind(this);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (loc) => this.setState({ location: loc }),
        () => alert("Can't access location!")
      );
    }
  }

  componentDidMount() {
    // fetch() to get all routes
    let rides_gen = [];
    for (let i = 0; i < 10; i++) {
      rides_gen.push({
        id: i,
        dist_trip: Math.random() * 5,
        dist_src: Math.random() * 3,
        price: Math.random() * 20,
        time_src: Math.random() * 10,
        time_trip: Math.random() * 20,
        src: "10 W. 31st St., Chicago, IL",
        dest: "Sears Tower",
        riders: Math.floor(Math.random() * 5 + 1)
      });
    }
    this.setState({ rides: rides_gen });
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
              this.state.route.src +
              "&destination=" +
              this.state.route.dest
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

  claimFunc(route) {
    this.setState({ showRouteModal: true, claimedRoute: route });
    // fetch() to tell backend that the route was claimed
  }

  calc_hourly(ride) { 
    return ride.price.toFixed(2) / (ride.time_src + ride.time_trip);
  }

  sortRides(rides, sortBy) {
    if(sortBy == "price") {
      return rides.sort((a, b) => b.price - a.price); 
    } else if (sortBy == "time_src") {
      return rides.sort((a, b) => a.time_src - b.time_src);
    } else if (sortBy == "hourly") {
      return rides.sort((a, b) => this.calc_hourly(b) - this.calc_hourly(a))
    }
  }

  render() {
    this.renderMap();
    if(this.state.rides == null) {
      return null;
    }
    let ridesSorted = this.sortRides(this.state.rides, this.state.sort);
    let rideRequests = ridesSorted.map((x) => (
      <RideRequest
        key={x.id}
        claimFunc={() => this.claimFunc(x)}
        previewFunc={() =>
          this.setState({ route: x, routed: 0, map_type: "route" })
        }
        req={x}
        borderFunc={() => (this.state.route == x)}
      />
    ));

    let hideModal = () => this.setState({ showRouteModal: false });
    let openRouteGoogleMaps = () =>
      window.open(
        "https://www.google.com/maps/dir/?api=1&origin=" +
          this.state.claimedRoute.src +
          "&destination=" +
          this.state.claimedRoute.dest
      );

    let claimedRideModal = (
      <Modal show={this.state.showRouteModal} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Route information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DriverNavInfo route={this.state.claimedRoute} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={openRouteGoogleMaps}>
            Open route in Google Maps
          </Button>
          <Button variant="primary" onClick={hideModal}>
            Route Completed
          </Button>
        </Modal.Footer>
      </Modal>
    );

    return (
      <PageDiv>
        {claimedRideModal}
        <h1>Driver Page</h1>
        <ContentDiv>
          <Pane>
            <h2>Available Rides</h2>
            <ButtonGroup aria-label="Basic example">
              <Button variant={(this.state.sort == "price") ? "primary" : "secondary"} onClick={() => this.setState({ sort: "price"})}>Price</Button>
              <Button variant={(this.state.sort == "time_src") ? "primary" : "secondary"} onClick={() => this.setState({ sort: "time_src"})}>Time to Source</Button>
              <Button variant={(this.state.sort == "hourly") ? "primary" : "secondary"} onClick={() => this.setState({ sort: "hourly"})}>Hourly Pay</Button>
            </ButtonGroup>
            <div>{rideRequests}</div>
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
