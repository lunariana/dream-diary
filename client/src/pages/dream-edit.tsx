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

    // check if user is logged in
    const getAuthStatusAPIRequest = async () => {

      const { data } = await axios.post<boolean>('/user/getAuthStatus');
      console.log(data, typeof(data));

      setIsLoggedIn(data);
      // if (!data) {
      //   setErrorText("please log in to edit this dream");
      // }
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
        setErrorText("something went wrong...");
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

    if (!title) {
      setErrorText("you forgot the title...");
      return;
    } else if (title.length > 255) {
      setErrorText("your title is wayyy too long!");
      return;
    } else if (!content) {
      setErrorText("aren't you going to describe your dream?");
      return;
    }
    
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
        setErrorText("something went wrong...");
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
    <>
      <Header/>
      <div className="dream-edit">
        <h1>edit dream</h1>
        {isLoggedIn ? (
          <div className="form">
            <form onSubmit={handleEditDreamSubmit}>
              <label htmlFor="title">dream title </label>
              <br/>
              <input 
                type="text" 
                id="title" 
                value={title} 
                placeholder="enter dream title" 
                size={52}
                // required 
                onChange={onTitleChange}
              />
              <br/>
              <br/>

              <label htmlFor="content">dream content </label>
              <br/>
              <textarea 
                id="content" 
                value={content} 
                placeholder="enter dream content" 
                rows={10}
                cols={50}
                // required 
                onChange={onContentChange}
              />
              <br/>

              <input type="submit" value="edit dream!"/>
            </form>
          </div>
        ) : ( <></> )}
        <p className="error-text">{errorText}</p>
      </div>
    </>
  );
};


export default EditDreamPage;
