import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import axios from "axios";

// page showing an individual dream
const DreamPage = () => {

  const { dreamID } = useParams();
  console.log(dreamID, typeof(dreamID));

  const [dream, setDream] = React.useState<Dream>({title: "", content: "", dateCreated: "", dateEdited: null, username: ""});
  const [errorText, setErrorText] = React.useState<string>("");

  const navigate = useNavigate();

  // define Dream object property types
  interface Dream {
    title: string;
    content: string;
    dateCreated: string;
    dateEdited: string | null;
    username: string;
  };

  // make api call once (twice in dev mode) when page first renders
  React.useEffect(() => {

    // get dream data from server
    const getDreamAPIRequest = async () => {
      
      const { data } = await axios.post<Dream>('/dream/' + dreamID + '/getDream');
      console.log(data);

      setDream(data);
    };

    // if an error occurs, show error message
    getDreamAPIRequest().catch((error) => {
      // if the server sends error information
      if (error.response) {
        console.log(error.response.data);
        setErrorText(error.response.data.error);

      } else {
        setErrorText("something went wrong...");
      }
    });

  }, []);

  const onEditClick = () => {
    // navigate to edit dream page
    navigate('/edit-dream/' + dreamID);
  };

  const onDeleteClick = () => {
    // navigate to deletion confirmation page
    navigate('/confirm-delete/' + dreamID);
  };

  return (
    <>
      <Header/>
      <div className="dream">
        {/* ////////////////////////////////////////////////////////////// maybe add a back button or left right buttons */}
        <h1>{dream.title}</h1>
        <p className="metadata">{dream.dateCreated ? "created on " + new Date(dream.dateCreated).toDateString() + " at " + new Date(dream.dateCreated).toLocaleTimeString() : ""}</p>
        <p className="metadata">{dream.dateEdited ? "edited on " + new Date(dream.dateCreated).toDateString() + " at " + new Date(dream.dateEdited).toLocaleTimeString() : ""}</p>
        <p>{dream.content}</p>
        {/* /////////////////////////////////////////////// how do i hide buttons when there is an error?? */}
        {!errorText ? (
          <>
            <button onClick={onEditClick}>edit</button>
            <button onClick={onDeleteClick}>delete</button>
          </>
        ) : ( <></> )}
        <p className="error-text">{errorText}</p>
      </div>
    </>
  );
};


export default DreamPage;
