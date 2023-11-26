import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import axios from "axios";
import './css/dream-archive.css';
// import { SAPIBase } from "../tools/api";

// page showing a list of the user's past dreams
const DreamArchivePage = () => {

  const [dreams, setDreams] = React.useState<Dream[]>([]);
  const [errorText, setErrorText] = React.useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  const navigate = useNavigate();

  // define Dream object property types
  interface Dream {
    dreamID: number;
    title: string;
    content: string;
    dateCreated: string;
    dateEdited: string | null;
    username: string;
  };

  // make api call once (twice in dev mode) when page first renders
  React.useEffect(() => {

    // get list of user's dreams from server
    const getDreamsAPIRequest = async () => {

      const { data } = await axios.post<Dream[]>('/dream/getDreams');
      console.log(data);

      setDreams(data);
    };

    // if an error occurs, show error message
    getDreamsAPIRequest().catch((error) => {
      // if the server sends error information
      if (error.response) {
        console.log(error.response.data);
        setErrorText(error.response.data.error);

      } else {
        setErrorText("something went wrong...");
      }
    });

    // check if user is logged in (basically just for error message purposes)
    const getAuthStatusAPIRequest = async () => {

      const { data } = await axios.post<boolean>('/user/getAuthStatus');
      console.log(data, typeof(data));

      setIsLoggedIn(data);
      if (!data) {
        setErrorText("log in to browse your dream archive :)");
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

  }, []);    // empty dependency array

  // when a dream item is clicked, navigate to individual dream page
  const onDreamItemClick = (dreamID: number) => {
    console.log(dreamID);
    navigate("/dream/" + dreamID);
  };

  return (
    <>
      <Header/>
      <div className='dream-archive'>
        <h1>my dream archive</h1>
        <div className="dreams">
          {isLoggedIn && !dreams.length ? (
            <>
              <p>the dream archive is currently empty...</p>
              <p>enjoy staring at this beautiful purple moon instead!</p>
              {/* <br/> */}
              <img className="purple-moon" src='../../img/purple-moon.png' alt="purple moon" onClick={ () => { navigate('/new-dream'); } } />
              <br/>
              <br/>
              <p className="hint">p.s. click on the moon to start filling up your archive :)</p>
            </>
          ) : ( <></> )}
          {dreams.map((dream) => (
            <div className="dream-item" key={dream.dreamID} onClick={() => onDreamItemClick(dream.dreamID)}>
              <h3>{dream.title.length > 33 ? (dream.title.slice(0, 33) + "...") : (dream.title)}</h3>
              <p className="metadata">{new Date(dream.dateCreated).toLocaleDateString()} {dream.dateEdited ? "(" + new Date(dream.dateEdited).toLocaleDateString() + ")" : ""}</p>
              <p>{dream.content.length > 40 ? (dream.content.slice(0, 40) + "...") : (dream.content)}</p>    {/* show only the first 40 characters */}
            </div>
          ))}
        </div>
        {isLoggedIn ? (
          <>
            <p className="error-text">{errorText}</p>
          </>
        ) : (
          <>
            <p>{errorText}</p>
          </>
        )}
      </div>
    </>
  );
};

export default DreamArchivePage;
