import React from 'react';
import { useNavigate } from "react-router-dom";
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
        setErrorText("something went wrong...");
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
        setErrorText("something went wrong...");
      }
    });
  };

  return (
    <>
      <div className='header'>
        <button className="left" onClick={onBackClick}>back</button> {/* just to remember that this is possible */}
        <button className='menu' onClick={ () => { navigate('/'); }} >home</button>
        <button className='menu' onClick={ () => { navigate('/dream-archive'); } }>dream archive</button>
        <button className='menu' onClick={ () => { navigate('/new-dream'); } }>new dream</button>
        <button className='menu' onClick={ () => { navigate('/about'); } }>about</button>
        {authStatus ? (
          <button className="right" onClick={handleLogoutClick}>log out</button>
        ) : (
          <button className="right" onClick={handleLoginClick}>log in</button>
        )}
      </div>
      <p className="error-text">{errorText}</p>
    </>
  );
};

export default Header;
