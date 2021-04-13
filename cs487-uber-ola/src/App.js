import React, { Component } from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./views/home";
import RegisterPage from "./views/registerPage";
import Login from "./views/loginPage";
import styled from "styled-components";
import Navbar from "./components/navbar"
import 'bootstrap/dist/css/bootstrap.min.css';
import About from "./views/about";
import Landing from "./views/landing";
import Driver from "./views/driver";
import UserPage from "./views/userpage";
import UserRoute from "./views/userRoute";

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
              <Route exact path="/ride" component={Home} />
              <Route exact path="/register" component={RegisterPage} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/about" component={About} />
              <Route exact path="/landing" component={Landing}/>
              <Route exact path="/drive" component={Driver}/>
              <Route exact path="/user" component={UserPage}/>
              <Route exact path="/user/route" component={UserRoute} />
            </div>
          </Router>
      </BackgroundGrey>
    );
  }
}

export default App;
