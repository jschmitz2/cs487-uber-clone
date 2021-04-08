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
    };
    this.map = null;
    this.renderMap = this.renderMap.bind(this);
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
                  }}
                >
                  View Route
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState({ routed: 1 });
                  }}
                >
                  Request Ride
                </Button>
              </ButtonDiv>
            </Form>
          </Pane>
          <Pane>{this.map}</Pane>
        </ContentDiv>
      </PageDiv>
    );
  }
}

export default Home;
