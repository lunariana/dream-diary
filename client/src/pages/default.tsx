import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from '../components/header';

// landing page for unauthenticated users
const DefaultPage = () => {

  const [errorText, setErrorText] = React.useState<string>("");

  const navigate = useNavigate();

  // make api call once (twice in dev mode) when page first renders
  React.useEffect(() => {

    // get user auth status from server
    const getAuthStatusAPIRequest = async () => {

      const { data } = await axios.post<boolean>('/user/getAuthStatus');
      console.log(data, typeof(data));

      // if user is authenticated, navigate to home page
      if (data) {
        navigate('/home', { replace: true });
      }
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

  return (
    <>
      <Header/>
      <div className="default">
        <h1>dream diary</h1>
        <p>hello there!</p>
        <p>please log in or sign up to access your dream diary</p>
        <button onClick={() => { navigate('/login') }}>log in</button>
        <br/>
        <span>or</span>
        <br/>
        <button onClick={() => { navigate('/signup') }}>sign up</button>
        <p>sweet dreams!</p>
        <br/>
        <br/>
        <br/>
        <p className="error-text">{errorText}</p>
      </div>
    </>
  );
};

export default DefaultPage;
