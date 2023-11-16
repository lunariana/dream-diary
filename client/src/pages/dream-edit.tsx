import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";

// form to edit a dream
const EditDreamPage = () => {

  const { dreamID } = useParams();
  console.log(dreamID, typeof(dreamID));

  const [title, setTitle] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const [errorText, setErrorText] = React.useState<string>("");
  const [editDreamSuccess, setEditDreamSuccess] = React.useState<boolean>(false);

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

    // get current dream data from server
    const getDreamAPIRequest = async () => {
      
      const { data } = await axios.post<Dream>('/dream/' + dreamID + '/getDream');
      console.log(data);

      // set title and content fields of form to current data
      setTitle(data.title);
      setContent(data.content);
    };

    // if an error occurs, show error message
    getDreamAPIRequest().catch((error) => {
      // if the server sends error information
      if (error.response) {
        console.log(error.response.data);
        setErrorText(error.response.data.error);

      } else {
        setErrorText("Something went wrong...");
      }
    });

  }, []);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleEditDreamSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();  // prevent the page from reloading

    // console.log(event.currentTarget.title);
    // console.log(event.currentTarget.content);
    console.log(title);
    console.log(content);
    
    const editDreamAPIRequest = async () => {

      // edit dream
      const { data } = await axios.post<Dream>('/dream/' + dreamID + '/editDream', { title: title, content: content });
      console.log(data);

      setErrorText("");
      setEditDreamSuccess(true);
    };

    // if an error occurs, show error message
    editDreamAPIRequest().catch((error) => {
      // if the server sends error information
      if (error.response) {
        console.log(error.response.data);
        setErrorText(error.response.data.error);

      } else {
        setErrorText("Something went wrong...");
      }
    });
  };

  // if dream is successfully edited, redirect user to that dream
  React.useEffect(() => {
    if (editDreamSuccess) {
      // redirect user to dream page
      navigate("/dream/" + dreamID);
    }
  }, [editDreamSuccess]);

  return (
    <div className="dream-edit">
      <Header/>
      <h1>Edit Dream</h1>
      <div className="form">
        <form onSubmit={handleEditDreamSubmit}>
          <label htmlFor="title">Dream Title </label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            placeholder="Enter dream title" 
            required 
            onChange={onTitleChange}
          />
          <br/>

          <label htmlFor="content">Dream Content </label><br/>
          <textarea 
            id="content" 
            value={content} 
            placeholder="Enter dream content" 
            rows={5}
            cols={50}
            required 
            onChange={onContentChange}
          />
          <br/>

          <input type="submit" value="Edit Dream"/>
        </form>
      </div>
      <span>{errorText}</span>
    </div>
  );
};


export default EditDreamPage;
