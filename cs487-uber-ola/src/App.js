import React, { Component } from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./views/home";
import NewUser from "./components/newUser";
import Login from "./components/login";
import styled from "styled-components";
import Navbar from "./components/navbar"
import 'bootstrap/dist/css/bootstrap.min.css';
const BackgroundGrey = styled.div`
  background-color: #f0f0f0;
`;

class App extends Component {
  render() {
    return (
      <BackgroundGrey>
          <Navbar />
          <Router>
            <div>
              <Route exact path="/" component={Home} />
              <Route exact path="/newuser" component={NewUser} />
              <Route exact path="/login" component={Login} />
            </div>
          </Router>
      </BackgroundGrey>
    );
  }
}

export default App;
