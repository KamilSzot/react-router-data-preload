import React, { Component, FunctionComponent } from 'react';
import { Url } from './DeferNavigation';


const NavBar:FunctionComponent<{}> = () => (
  <ul className="App-Navbar">
    <li>
      <Url exact to="/">Home</Url>
    </li>
    <li>
      <Url to="/offer/scotty">Offer</Url>
    </li>
    <li>
      <Url to="/offer/nanuk">Offer</Url>
    </li>
    <li>
      <Url to="/offer/mjackson">Offer</Url>
    </li>
    <li>
      <Url to="/about">About</Url>
    </li>
    <li>
      <Url to="/contact">Contact</Url>
    </li>
  </ul>
);

export default NavBar;