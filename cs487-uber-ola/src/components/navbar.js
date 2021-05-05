import React from "react";
import styled from "styled-components";
import Cookies from "js-cookie";

const NavbarDiv = styled.div`
  width: 100%;
  background-color: #7c79a8;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;

const NavbarItemBox = styled.ul`
  display: flex;
  max-width: 300px;
  width: 100%;
  justify-content: space-between;
`;
const NavbarItem = styled.a`
  margin: 0px 5px 0px 5px;
  font-family: "Work-Sans-Light", sans-serif;
  font-size: 30px;
  color: #ffffff;
`;

const BasicLogo = styled.a`
  color: #ffffff;
  display: inline-block;
  margin: 10px;
  font-size: 30px;
  width: 150px;
`;

const LoginButton = styled.a`
border: solid 1px;
padding: 5px 10px 5px 10px;
border-radius: 5px;
margin: 5px;
color: black;
background-color: white;
`
const UserName = styled.a`
  font-size: 30px;
  margin: 5px;
  display: inline-block;
  color: #ffffff;
  font-family: "Work-Sans-Light", sans-serif;
`;

const UserDiv = styled.div`
  white-space: nowrap;
`;

let userName = Cookies.get("fname");
let userType = Cookies.get("userType");

function buildUserInfo() {
  if (userName == null || userName == "") {
    if(["login", "landing", "about", "home", "register"].map((x) => document.location.href.includes(x)).some((x) => x)) {
      return (
        <UserDiv>
          <LoginButton href="/login">Login</LoginButton>
          <LoginButton href="/register">Register</LoginButton>
        </UserDiv>
      );
  } else {
    document.location.replace("/login");
  }
  } else {
    return (
      <UserDiv>
        <UserName href="/user">{userName}</UserName>
      </UserDiv>
    );
  }
}

const getNavbarItem = (obj) => (
  <NavbarItem href={obj.link}>{obj.name}</NavbarItem>
);

// Jank way to stitch the objects together

let names, links;

if(userType == "driver") {
  names = ["Drive"]
  links = ["/drive"]
} else {
  names = ["Find A Ride"]
  links = ["/ride"]
}

names.push("About")
links.push("/about")

let objs = [];
for (let i = 0; i < names.length; i++) {
  objs.push({ link: links[i], name: names[i] });
}

function buildNavbarItems(objs) {
  let outItems = [];
  for (let i = 0; i < objs.length; i++) {
    outItems.push(getNavbarItem(objs[i]));
  }
  return outItems;
}

const Navbar = (props) => (
  <NavbarDiv>
    <BasicLogo href="/landing">TotallyNotUber</BasicLogo>
    <NavbarItemBox>{buildNavbarItems(objs)}</NavbarItemBox>
    {buildUserInfo()}
  </NavbarDiv>
);

export default Navbar;
