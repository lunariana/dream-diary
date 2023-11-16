import React from 'react';
// import { Outlet } from "react-router-dom";
import Header from '../components/header';

const HomePage = () => {
  return (
    <>
      <div className="home">
        <Header/>
        <h1>hello</h1>
        <p>world</p>
        <p>add short intro text body</p>
        <p>add button for new dream entry</p>
        <p>add navigation bar?</p>
        <p>add button to view old entries</p>
        <p>how do i integrate login/signup system??</p>
        <p>say hello name</p>
        <p>show different pages for authenticated users & unauthenticated users</p>
        <p>sweet dreams!</p>
      </div>
      {/* <Outlet /> */}
    </>
  );
};

export default HomePage;
