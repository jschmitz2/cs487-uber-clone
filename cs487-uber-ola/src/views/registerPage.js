import React from "react";
import styled from "styled-components";
import Register from "../components/register";

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

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <PageDiv>
        <ContentDiv>
            <h1>Register</h1>
            <Register/>
        </ContentDiv>
      </PageDiv>
    );
  }
}

export default RegisterPage;
