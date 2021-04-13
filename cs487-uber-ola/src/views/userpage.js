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
  }
  render() {
    return (
      <PageDiv>
        <ContentDiv>
            <h1>Your Account</h1>
            <p>Your name is {Cookies.get("fname")}. You're a {Cookies.get("userType")}. That's all I know!</p>
            <button onClick={() => {Cookies.remove("fname"); Cookies.remove("token"); Cookies.remove("userType"); document.location.replace("/landing")}}>Click here to log out</button>
        </ContentDiv>
      </PageDiv>
    );
  }
}

export default UserPage;
