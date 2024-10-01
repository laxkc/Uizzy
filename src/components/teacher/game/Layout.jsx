import React, { Component } from "react";
import { Outlet } from "react-router-dom";

export class Layout extends Component {
  render() {
    return (
      <div>
        {/* <h1>Game Management</h1> */}

        {/* Add any common header or navigation for games here */}

        {/* This is where nested routes will render */}
        <Outlet />
      </div>
    );
  }
}

export default Layout;
