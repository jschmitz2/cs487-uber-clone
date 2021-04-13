import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import keys from "../keys";
import Login from "../components/login";

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
class Home extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <PageDiv>
        <ContentDiv>
            <h1>Login</h1>
            <Login/>
        </ContentDiv>
      </PageDiv>
    );
  }
}

export default Home;
