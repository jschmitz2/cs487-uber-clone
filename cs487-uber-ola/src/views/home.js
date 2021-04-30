import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import keys from "../keys";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Cookies from "js-cookie";

const HeadingStyled = styled.h1``;

const ContentDiv = styled.div`
  width: 100%;
  display: flex;
  padding: 20px;
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
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

const RouteInfoDiv = styled.div`
  background: white;
  padding: 5px;
  margin: 10px;
  border-radius: 10px;
`;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: "",
      dest: "",
      routed: -1,
      userRouted: false,
      userRouteId: null,
      userRoutePrice: null,
      userRouteDist: null,
      card: "new",
      ride: null,
      enterSrc: "enter",
      enterDest: "enter",
      user: null
    };
    this.map = null;
    this.token = Cookies.get("token");
    this.renderMap = this.renderMap.bind(this);
    this.getRouteInfo = this.getRouteInfo.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
  }

  componentDidMount() {
    fetch("http://" + window.location.hostname + ":8000/rider/get?token=" + this.token)
    .then((res) => res.json())
    .then((json) => {
      this.setState({ user: json });
      if(json.cards.length > 0) {
        this.setState({ card: json.cards[0].id });
      }
    })
  }

  getRouteInfo() {
    fetch("http://" + window.location.hostname + ":8000/rides/add?token=" + this.token + "&src=" + this.state.src + "&dest=" + this.state.dest + "&riders=" + this.state.numRiders, {
      "method": "POST"
    })
    .then((res) => res.json())
    .then((json) => this.setState({ ride: json }));
  }

  renderMap() {
    if (this.state.routed == -1) {
      this.map = (
        <iframe
          src={
            "https://www.google.com/maps/embed/v1/place?key=" +
            keys.gmaps +
            "&q=" +
            "Chicago, IL"
          }
          width="500px"
          height="700px"
        />
      );
    }

    if(this.state.ride != null) {
      if (this.state.routed == 1) {
        this.setState({ routed: 2 });
        this.map = (
          <iframe
            src={
              "https://www.google.com/maps/embed/v1/directions?key=" +
              keys.gmaps +
              "&origin=" + this.state.ride.sourceLat + "," + this.state.ride.sourceLong + 
              "&destination=" + this.state.ride.destLat + "," + this.state.ride.destLong
            }
            width="500px"
            height="700px"
          />
        );
      }
    }

    if (this.state.src != "" && this.state.dst != "") {
      if (this.state.routed == 1) {
        this.setState({ routed: 2 });
        this.map = (
          <iframe
            src={
              "https://www.google.com/maps/embed/v1/directions?key=" +
              keys.gmaps +
              "&origin=" +
              this.state.src +
              "&destination=" +
              this.state.dest
            }
            width="500px"
            height="700px"
          />
        );
      }
    }
  }

  getUserRouteInfo() {
    if (this.state.ride != null) {
      return (
        <RouteInfoDiv>
          <h3>Route Info</h3>
          <p>Price: ${this.state.ride.price.toFixed(2)}</p>
          <p>Distance: {this.state.ride.distance}</p>
          <p>Time: {this.state.ride.time}</p>
        </RouteInfoDiv>
      );
    }
  }

  addToFavorites(newLoc) {
    fetch("http://" + window.location.hostname + ":8000/rider/fav_loc/add?token=" + this.token + "&newLoc=" + newLoc,
    {
      "method": "POST"
    })
    .then((res) => res.json())
    .then((json) => {
      this.setState({ user: json });
      alert("Location added to favorites!");
    });
  }

  addNewCard() {
    fetch("http://" + window.location.hostname + ":8000/rider/cards/add",
    {
      "method": "POST",
      "body": JSON.stringify({
        number: this.state.newCardNumber,
        expiration: this.state.newCardExp,
        cvc: this.state.newCardCVC,
        token: this.token
      })
    })
    .then((res) => res.json())
    .then((json) => {
      this.setState({ user: json, card: json.cards[json.cards.length - 1].id});
      alert("New card added!");
    });
  }

  render() {
    this.renderMap();
    if(this.state.user == null) {
      return null;
    }
    return (
      <PageDiv>
        <ContentDiv>
          <Pane>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <ButtonGroup aria-label="Basic example">
                  <Button
                    variant={
                      this.state.enterSrc == "enter" ? "primary" : "secondary"
                    }
                    onClick={() => this.setState({ enterSrc: "enter" })}
                  >
                    Enter Source
                  </Button>
                  <Button
                    variant={
                      this.state.enterSrc == "select" ? "primary" : "secondary"
                    }
                    onClick={() => this.setState({ enterSrc: "select" })}
                  >
                    Choose from Favorites
                  </Button>
                </ButtonGroup>
                <Form.Group hidden={this.state.enterSrc != "enter"}>
                  <Form.Label>Enter Source</Form.Label>
                  <Form.Control
                    type="address"
                    placeholder="123 Source Avenue"
                    onChange={(event) =>
                      this.setState({ src: event.target.value })
                    }
                  />
                  <ButtonDiv>
                    <Button onClick={() => this.addToFavorites(this.state.src)}>Add to favorites</Button>
                  </ButtonDiv>
                </Form.Group>
                <Form.Group hidden={this.state.enterSrc != "select"}>
                  <Form.Label>Enter Source</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(event) =>
                      this.setState({ src: event.target.value })
                    }
                  >
                    <option>Please Select...</option>
                    {this.state.user.favSpots.map((x) => (
                      <option value={x.location}>{x.location}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <ButtonGroup aria-label="Basic example">
                  <Button
                    variant={
                      this.state.enterDest == "enter" ? "primary" : "secondary"
                    }
                    onClick={() => this.setState({ enterDest: "enter" })}
                  >
                    Enter Destination
                  </Button>
                  <Button
                    variant={
                      this.state.enterDest == "select" ? "primary" : "secondary"
                    }
                    onClick={() => this.setState({ enterDest: "select" })}
                  >
                    Choose from Favorites
                  </Button>
                </ButtonGroup>
                <Form.Group hidden={this.state.enterDest != "enter"}>
                  <Form.Label>Enter Destination</Form.Label>
                  <Form.Control
                    type="address"
                    placeholder="123 Source Avenue"
                    onChange={(event) =>
                      this.setState({ dest: event.target.value })
                    }
                  />
                  <ButtonDiv>
                    <Button onClick={() => this.addToFavorites(this.state.dest)}>Add to favorites</Button>
                  </ButtonDiv>
                </Form.Group>
                <Form.Group hidden={this.state.enterDest != "select"}>
                  <Form.Label>Enter Destination</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(event) =>
                      this.setState({ dest: event.target.value })
                    }
                  >
                    <option>Please Select...</option>

                    {this.state.user.favSpots.map((x) => (
                      <option value={x.location}>{x.location}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form.Group>
              <Form.Group controlId="formBasicRiders">
                <Form.Label>Number of riders</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) =>
                    this.setState({ numRiders: event.target.value })
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
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Credit Card</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) =>
                    this.setState({ card: event.target.value })
                  }
                >
                  {this.state.user.cards.map((x) => (
                    <option value={x.id}>
                      Card ending in {x.number.substr(-4)}
                    </option>
                  ))}
                  <option value="new">Add New</option>
                </Form.Control>
              </Form.Group>
              <Form.Group
                hidden={this.state.card != "new"}
                as="row"
                controlId="formNewCard"
              >
                <Form.Label>New Card Number</Form.Label>
                <Form.Control as="input" onChange={(e) => this.setState({ newCardNumber: e.target.value})} placeholder="1123 4567 8910 1112" />
                <Form.Row>
                  <Col>
                    <Form.Label>Expiration Date</Form.Label>
                    <Form.Control
                      as="input"
                      maxLength={5}
                      placeholder="05/21"
                      onChange={(e) => this.setState({ newCardExp: e.target.value})}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Security Code</Form.Label>
                    <Form.Control as="input" maxLength={3} placeholder="543" onChange={(e) => this.setState({ newCardCVC: e.target.value })}/>
                  </Col>
                </Form.Row>
                <ButtonDiv>
                  <Button onClick={this.addNewCard} variant="primary">Add Card</Button>
                </ButtonDiv>
              </Form.Group>

              <ButtonDiv>
                <Button
                  variant="secondary"
                  type="submit"
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState({ routed: 1 });
                    this.getRouteInfo();
                  }}
                >
                  View Route
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!this.state.userRouted}
                  onClick={(event) => {
                    event.preventDefault();
                    document.location.replace(
                      "/user/route?userRouteId=" + this.state.userRouteId
                    );
                  }}
                >
                  Request Ride
                </Button>
              </ButtonDiv>
            </Form>
            {this.getUserRouteInfo()}
          </Pane>
          <Pane>{this.map}</Pane>
        </ContentDiv>
      </PageDiv>
    );
  }
}

export default Home;
