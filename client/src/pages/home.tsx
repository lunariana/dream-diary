import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from '../components/header';

const HomePage = () => {

  const [authStatus, setAuthStatus] = React.useState<boolean>(false);
  const [errorText, setErrorText] = React.useState<string>("");

  const navigate = useNavigate();

  // make api call once (twice in dev mode) when page first renders
  React.useEffect(() => {

    // get user auth status from server
    const getAuthStatusAPIRequest = async () => {

      const { data } = await axios.post<boolean>('/user/getAuthStatus');
      console.log(data, typeof(data));

      setAuthStatus(data);
    };

    // if an error occurs, show error message
    getAuthStatusAPIRequest().catch((error) => {
      // if the server sends error information
      if (error.response) {
        console.log(error.response.data);
        setErrorText(error.response.data.error);

      } else {
        setErrorText("Something went wrong...");
      }
    });
  }, []);

  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////// BUG: CLICKING LOGOUT IN HEADER WHILE IN HOME DOES NOT RERENDER HOME PAGE (try using useisfocused?)
  return (
    <>
      <div className="home">
        <Header/>
        <h1>Dream Diary</h1>
        {authStatus ? (
          <>
            <p>hello [name]!</p>  {/* ////////////////////////// todo: get user's name in here */}
            <p>welcome to your dream diary!</p>
            <button onClick={() => { navigate('/new-dream') }}>Add a New Dream</button>
            <br/>
            <button onClick={() => { navigate('/dream-archive') }}>View Past Dreams</button>
          </>
        ) : (
          <>
            <p>hello!</p>
            <p>please log in or sign up to access your dream diary</p>
            <button onClick={() => { navigate('/login') }}>Log In</button>
            <p>or</p>
            <button onClick={() => { navigate('/signup') }}>Sign Up</button>
          </>
        )}
        <p>sweet dreams!</p>
        <br/>
        <br/>
        <p>say hello name (or say name's dream diary)</p>
        <p>add short intro text body</p>
        <p>add button for new dream entry</p>
        <p>add button to view old entries</p>
        <p>show different pages for authenticated users & unauthenticated users</p>
        <p>if time permits, create an user/account settings page</p>
        <p>sweet dreams!</p>
        <p>also: change favicon and page name thingy</p>
      </div>
      {/* <Outlet /> */}
    </>
  );
};

export default HomePage;
