import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from '../components/header';

// landing page for authenticated users
const HomePage = () => {

  // const [authStatus, setAuthStatus] = React.useState<boolean>(false);
  const [errorText, setErrorText] = React.useState<string>("");
  const [firstName, setFirstName] = React.useState<string>("");

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
        setErrorText("something went wrong...");
      }
    });

    const getUserNameAPIRequest = async () => {

      interface Name {
        firstName: string;
        lastName: string;
      };
      
      const { data } = await axios.post<Name>('/user/getName');
      console.log(data);

      setFirstName(data.firstName);
    };

    getUserNameAPIRequest().catch((error) => {
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
      <div className="home">
        <h1>dream diary</h1>
        <p>hello, {firstName}!</p>  {/* ////////////////////////// todo: get user's name in here */}
        <p>welcome back to your dream diary :)</p>
        <button onClick={() => { navigate('/new-dream') }}>record a new dream</button>
        <br/>
        <button onClick={() => { navigate('/dream-archive') }}>revisit past dreams</button>
        <p>sweet dreams!</p>
        <br/>
        <br/>
        <p className="error-text">{errorText}</p>
      </div>
    </>
  );
};

export default HomePage;
