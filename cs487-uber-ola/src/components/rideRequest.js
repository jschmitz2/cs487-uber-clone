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
    this.state = {
      border: false
    }
    this.req = props.req;
    this.previewFunc = props.previewFunc;
    this.claimFunc = props.claimFunc;
    this.borderFunc = props.borderFunc;
  }

  render() {
    return (
      <ReqContainer style={{border: ((this.borderFunc()) ? "solid 1px black" : "")}}>
        <HeaderFlex>
        <RideRequestHeading>Ride Request - {this.req.rider.fname}</RideRequestHeading>
        <RideRequestHeading>{this.req.riders} rider{(this.req.riders != 1) ? "s" : ""}</RideRequestHeading>
        </HeaderFlex>
        <RowFlex>
          <p>Pay: </p>
          <p>${this.req.price}</p>
        </RowFlex>
        <RowFlex>
          <p>Distance: </p>
          <p>{this.req.distance}</p>
        </RowFlex>
        <RowFlex>
          <p>Date and time requested: </p>
          <p style={{whiteSpace: "nowrap"}}>{(new Date(this.req.timestamp)).toLocaleString()}</p>
        </RowFlex>
        <RowFlex>
          <p>Time: </p>
          <p>{this.req.time}</p>
        </RowFlex>
        <RowFlex>
          <p>Distance to Start: </p>
          <p>{this.req.dist_src}</p>
        </RowFlex>
        <RowFlex>
          <p>Time to Start: </p>
          <p>{this.req.time_src}</p>
        </RowFlex>
        <RowFlex>
          <RequestButton onClick={this.claimFunc}>Drive</RequestButton>
          <RequestButton onClick={() => {this.setState({ border: true }); return this.previewFunc()}}>See Route Info</RequestButton>
        </RowFlex>
      </ReqContainer>
    );
  }
}
export default RideRequest;
