import React from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Cookies from "js-cookie";

const ReqContainer = styled.div`
  border-radius: 5px;
  background: #b6f7b2;
  padding: 10px;
  margin: 5px;
`;

const RowFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

class RideRequest extends React.Component {
  constructor(props) {
    super(props);
    this.req = props.req;
    this.previewFunc = props.previewFunc;
    this.claimFunc = props.claimFunc;
  }

  render() {
    return (
      <ReqContainer>
        <h2>Ride Request</h2>
        <RowFlex>
          <p>{this.req.dist_trip.toFixed(2)} miles</p>
          <p>Pay: ${this.req.price.toFixed(2)}</p>
        </RowFlex>
        <p>{this.req.dist_src.toFixed(2)} miles to the start</p>
        <RowFlex>
        <button onClick={this.claimFunc}>Drive</button>
        <button onClick={this.previewFunc}>See Route Info</button>
        </RowFlex>
      </ReqContainer>
    );
  }
}
export default RideRequest;
