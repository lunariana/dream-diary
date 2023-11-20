import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

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
      <nav>
        <button onClick={onBackClick}>back </button> {/* just to remember that this is possible */}
        <Link to="/">Home </Link>
        <Link to="/about">About </Link>
        {/* ///////////////////////////////////////////////// temporary links? */}
        <Link to='/dream-archive'>Dream Archive </Link>
        <Link to='/new-dream'>New Dream </Link>
        {authStatus ? (
          <button onClick={handleLogoutClick}>Log Out</button>
        ) : (
          <button onClick={handleLoginClick}>Log In</button>
        )}
      </nav>
      <span>{errorText}</span>
    </div>
  );
};

export default Header;
