import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from '../components/header';

// landing page for authenticated users
const HomePage = () => {

  // const [authStatus, setAuthStatus] = React.useState<boolean>(false);
  const [errorText, setErrorText] = React.useState<string>("");

  const navigate = useNavigate();

  // make api call once (twice in dev mode) when page first renders
  React.useEffect(() => {

    // get user auth status from server
    const getAuthStatusAPIRequest = async () => {

      const { data } = await axios.post<boolean>('/user/getAuthStatus');
      console.log(data, typeof(data));

      // if user is not logged in, navigate to default page
      if (!data) {
        navigate("/", { replace: true });
      }
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

  return (
    <>
      <Header/>
      <div className="home">
        <h1>Dream Diary</h1>
        <p>hello [name]!</p>  {/* ////////////////////////// todo: get user's name in here */}
        <p>welcome to your dream diary!</p>
        <button onClick={() => { navigate('/new-dream') }}>Record a New Dream</button>
        <br/>
        <button onClick={() => { navigate('/dream-archive') }}>View Past Dreams</button>
        <p>sweet dreams!</p>
        <br/>
        <br/>
        <p>say hello name (and/or say name's dream diary)</p>
        <p>add short intro text body</p>
        <p>if time permits, create an user/account settings page</p>
        <p>also: change favicon and page name thingy</p>
      </div>
    </>
  );
};

export default HomePage;
