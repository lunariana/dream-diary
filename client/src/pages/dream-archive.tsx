import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import axios from "axios";
// import { SAPIBase } from "../tools/api";

// page showing a list of the user's past dreams
const DreamArchivePage = () => {

  const [dreams, setDreams] = React.useState<Dream[]>([]);
  const [errorText, setErrorText] = React.useState<string>("");

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
        setErrorText("Something went wrong...");
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
        {/* //////////////////////////////////////////////////////////////////////// add link to new dream page */}
        <h1>My Dream Archive</h1>
        <div className="dreams">
          {dreams.map((dream) => (
            <div className="dream-item" key={dream.dreamID} onClick={() => onDreamItemClick(dream.dreamID)}>
              <h3>{dream.title}</h3>
              <p>{dream.dateCreated.slice(0, 10)} {dream.dateEdited ? "(" + dream.dateEdited?.slice(0, 10) + ")" : ""}</p>
              <p>{dream.content.slice(0, 40)}</p>    {/* show only the first 40 characters */}
            </div>
          ))}
        </div>
        <span className="error-text">{errorText}</span>
      </div>
    </>
  );
};

export default DreamArchivePage;
