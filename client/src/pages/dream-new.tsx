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

  const navigate = useNavigate();

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
        setErrorText("Something went wrong...");
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
    <div className="dream-new">
      <Header/>
      <h1>New Dream</h1>
      <div className="form">
        <form onSubmit={handleNewDreamSubmit}>
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

          <input type="submit" value="Add New Dream"/>
        </form>
      </div>
      <span>{errorText}</span>
    </div>
  );
};


export default NewDreamPage;
