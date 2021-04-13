import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import keys from "../keys";

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
  display: flex;
  justify-content: space-between;
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
      userRouteDist: null
    };
    this.map = null;
    this.renderMap = this.renderMap.bind(this);
    this.getRouteInfo = this.getRouteInfo.bind(this);
  }

  getRouteInfo() {
    // fetch() and get data
    // .then((res) => res.json)
    // .then((json) => { 
    this.setState({
      userRouted: true,
      userRouteId: Math.floor(Math.random() * 100),
      userRoutePrice: Math.random() * 40,
      userRouteDist: Math.random() * 20
    })
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
    if(this.state.userRouted) {
      return <div>
        <h3>Route Info</h3>
        <p>Price: {this.state.userRoutePrice}</p>
        <p>Distance: {this.state.userRouteDist}</p>
      </div>
    }
  }

  render() {
    this.renderMap();
    return (
      <PageDiv>
        <ContentDiv>
          <Pane>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Source</Form.Label>
                <Form.Control
                  type="address"
                  placeholder="123 Source Avenue"
                  onChange={(event) =>
                    this.setState({ src: event.target.value })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Destination</Form.Label>
                <Form.Control
                  type="address"
                  placeholder="456 Destination Drive"
                  onChange={(event) =>
                    this.setState({ dest: event.target.value })
                  }
                />
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
                    document.location.replace("/user/route?userRouteId=" + this.state.userRouteId)
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
