import React from "react";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const HeadingStyled = styled.h1``;

const ContentDiv = styled.div`
  width: 100%;
  display: flex;

`;

const LeftPane = styled.div`
  max-width: 400px;
`;

const RightPane = styled.div`
width: 100%;
max-width: 300px;
`

const PageDiv = styled.div`
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;
const Home = (props) => (
  <PageDiv>
    <HeadingStyled>Find a Ride</HeadingStyled>
    <ContentDiv>
      <LeftPane>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Source</Form.Label>
            <Form.Control type="address" placeholder="123 Source Avenue" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Destination</Form.Label>
            <Form.Control type="address" placeholder="456 Destination Drive" />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </LeftPane>
      <RightPane>
          <img src='https://www.howtogeek.com/wp-content/uploads/2021/01/google-maps-satellite.png' width="300px"/>
          {/* <iframe src="https://www.google.com/maps/embed/v1/place?key=***&q=Space+Needle,Seattle+WA" width="300px" height="700px"/> */}
      </RightPane>
    </ContentDiv>
  </PageDiv>
);

export default Home;
