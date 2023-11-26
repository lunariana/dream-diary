import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";

// form to add a new dream
const NewDreamPage = () => {

  const [title, setTitle] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const [errorText, setErrorText] = React.useState<string>("");
  const [newDreamSuccess, setNewDreamSuccess] = React.useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  const navigate = useNavigate();

  // make api call once (twice in dev mode) when page first renders
  React.useEffect(() => {

    // check if user is logged in
    const getAuthStatusAPIRequest = async () => {

      const { data } = await axios.post<boolean>('/user/getAuthStatus');
      console.log(data, typeof(data));

      setIsLoggedIn(data);
      if (!data) {
        setErrorText("please log in to record your dreams :)");
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

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleNewDreamSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    
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
    
    const newDreamAPIRequest = async () => {

      // get next dream id
      const idData = (await axios.get<string>('/dream/nextDreamID')).data;
      console.log(idData);
      const dreamID = Number(idData);

      // define Dream object property types
      interface Dream {
        dreamID: number;
        title: string;
        content: string;
        dateCreated: string;
        dateEdited: string | null;
        username: string;
      };

      // create new dream
      const { data } = await axios.post<Dream>('/dream/newDream', { dreamID: dreamID, title: title, content: content });
      console.log(data);

      setErrorText("");
      setNewDreamSuccess(true);
    };

    // if an error occurs, show error message
    newDreamAPIRequest().catch((error) => {
      // if the server sends error information
      if (error.response) {
        console.log(error.response.data);
        setErrorText(error.response.data.error);

      } else {
        setErrorText("something went wrong...");
      }
    });
  };

  // if dream is successfully created, redirect user to dream archive
  React.useEffect(() => {
    if (newDreamSuccess) {
      // redirect user to dream archive
      navigate("/dream-archive");
    }
  }, [newDreamSuccess]);

  return (
    <>
      <Header/>
      <div className="dream-new">
        <h1>new dream</h1>
        {isLoggedIn ? (
          <>
            <div className="form">
              <form onSubmit={handleNewDreamSubmit}>
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

                <input type="submit" value="add new dream!"/>
              </form>
            </div>
            <p className="error-text">{errorText}</p>
          </>
        ) : ( 
          <>
            <p>{errorText}</p>
          </> )}
      </div>
    </>
  );
};


export default NewDreamPage;
