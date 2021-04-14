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

const HeaderFlex = styled(RowFlex)`
  border-radius: 5px;
  padding-bottom: 5px;
`

const RideRequestHeading = styled.h2`
  font-size: 1rem;
`;

const RequestButton = styled.button`
border-radius: 5px;

`

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
        <HeaderFlex>
        <RideRequestHeading>Ride Request</RideRequestHeading>
        <RideRequestHeading>{this.req.riders} rider{(this.req.riders != 1) ? "s" : ""}</RideRequestHeading>
        </HeaderFlex>
        <RowFlex>
          <p>Pay: </p>
          <p>${this.req.price.toFixed(2)}</p>
        </RowFlex>
        <RowFlex>
          <p>Distance: </p>
          <p>{this.req.dist_trip.toFixed(2)} miles</p>
        </RowFlex>
        <RowFlex>
          <p>Time: </p>
          <p>{this.req.time_trip.toFixed(2)} miles</p>
        </RowFlex>
        <RowFlex>
          <p>Distance to Start: </p>
          <p>{this.req.dist_src.toFixed(2)} miles</p>
        </RowFlex>
        <RowFlex>
          <p>Time to Start: </p>
          <p>{this.req.time_src.toFixed(2)} mins</p>
        </RowFlex>
        <RowFlex>
          <p>Hourly Pay: </p>
          <p>{(this.req.price.toFixed(2) / (this.req.time_src + this.req.time_trip)).toFixed(2)}$/hr</p>
        </RowFlex>
        <RowFlex>
          <RequestButton onClick={this.claimFunc}>Drive</RequestButton>
          <RequestButton onClick={this.previewFunc}>See Route Info</RequestButton>
        </RowFlex>
      </ReqContainer>
    );
  }
}
export default RideRequest;
