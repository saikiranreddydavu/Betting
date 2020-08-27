import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

import "./MainNavigation.css";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import BackDrop from "../UIElements/Backdrop/Backdrop";
const MainNavigation = (props) => {
  const [sideDrawerIsOpen, setSideDrawer] = useState(false);

  const openDrawerHandler = () => {
    setSideDrawer(true);
  };

  const closeDrawerHandler = () => {
    setSideDrawer(false);
  };
  return (
    <React.Fragment>
      {sideDrawerIsOpen && <BackDrop onClick={closeDrawerHandler} />}
      <SideDrawer show={sideDrawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks accounts={props.accounts} />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h3 className="main-navigation__title">
          <Link to="/">Betting Dapp</Link>
        </h3>
        <nav className="main-navigation__header-nav">
          <NavLinks accounts={props.accounts} />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};
export default MainNavigation;
