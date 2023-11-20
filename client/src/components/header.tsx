import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './css/header.css';

const Header = () => {

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

  const onBackClick = () => {
    // go back to previous page
    navigate(-1);
  };

  const handleLoginClick = () => {
    // navigate to login page
    navigate('/login');
  };

  const handleLogoutClick = () => {

    const logoutAPIRequest = async () => {
      // send logout request to server
      await axios.post<boolean>('/user/logout');

      // set auth status to false
      setAuthStatus(false);

      // navigate to default page
      navigate('/');
    };

    // if an error occurs, show error message
    logoutAPIRequest().catch((error) => {
      // if the server sends error information
      if (error.response) {
        console.log(error.response.data);
        setErrorText(error.response.data.error);

      } else {
        setErrorText("Something went wrong...");
      }
    });
  };

  return (
    <div className='header'>
      <button className="left" onClick={onBackClick}>back </button> {/* just to remember that this is possible */}
      <Link className='link' to="/">Home</Link>
      {/* ///////////////////////////////////////////////// temporary links? */}
      <Link className='link' to='/dream-archive'>Dream Archive</Link>
      <Link className='link' to='/new-dream'>New Dream</Link>
      <Link className='link' to="/about">About</Link>
      {authStatus ? (
        <button className="right" onClick={handleLogoutClick}>Log Out</button>
      ) : (
        <button className="right" onClick={handleLoginClick}>Log In</button>
      )}
      <span className="error-text">{errorText}</span>
    </div>
  );
};

export default Header;
