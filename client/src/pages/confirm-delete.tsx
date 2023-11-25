import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import axios from "axios";

// confirm dream deletion
const ConfirmDeletePage = () => {

  const { dreamID } = useParams();

  const [errorText, setErrorText] = React.useState<string>("");

  const navigate = useNavigate();

  const onDeleteClick = () => {

    // define Dream object property types
    interface Dream {
      title: string;
      content: string;
      dateCreated: string;
      dateEdited: string | null;
      username: string;
    };

    // delete dream from database
    const deleteDreamAPIRequest = async () => {
      const { data } = await axios.post<Dream>('/dream/' + dreamID + '/deleteDream');
      console.log(data);

      // navigate back to dream archive page, replacing the last page (deletion confirmation)
      // navigate(-2);
      navigate('/dream-archive', { replace: true });
    };

    // if an error occurs, show error message
    deleteDreamAPIRequest().catch((error) => {
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
      <Header/>
      <div className="confirm-delete">
        <h1>delete dream</h1>
        <p>warning: this action can <strong>never ever</strong> be undone!</p>
        <p>once you do this, your dream will be gone <strong>forever</strong>!</p>
        <p>if you want it back, you'll have to rack your brain and hope for the best cause the diary certainly won't remember it for you anymore!</p>
        <p>think long and hard before you make this decision...</p>
        <br/>
        <p className="error-text">are you sure you want to delete this dream?</p>
        <button onClick={ () => { navigate(-1); } }>no, go back!</button>
        <button onClick={onDeleteClick}>yes, delete dream</button>
        <p className="error-text">{errorText}</p>
      </div>
    </>
  );
};


export default ConfirmDeletePage;
