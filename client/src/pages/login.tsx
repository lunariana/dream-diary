import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import axios from 'axios';
// import { SAPIBase } from '../tools/api';

const LoginPage = () => {

  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errorText, setErrorText] = React.useState<string>("");
  const [loginSuccess, setLoginSuccess] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)

    //////////////////////////////////////////////////////////// could add feature that informs user of username requirements (length, uniqueness, etc)
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);

    ////////////////////////////////////////////////////////////// could add feature that informs user of password requirements
  };

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();  // prevent the page from reloading

    // console.log(event.currentTarget.username.value);
    // console.log(event.currentTarget.password.value);
    // console.log(username);
    // console.log(password);

    // check if username and password meet requirements
    if (!username) {
      setErrorText("please enter a username");
      return;
    } else if (!password) {
      setErrorText("please enter a password");
      return;
    }

    const loginAPIRequest = async() => {

      // basically defines the types of data that a UserInfo object has; not necessary but ig it helps with type clarity
      interface UserInfo {
        username: string;
        firstName: string;
        lastName: string;
      };

      const { data } = await axios.post<UserInfo>('/user/login', { username: username, password: password });
      console.log(data);

      setErrorText("");
      setLoginSuccess(true);
    };
    
    // if an error occurs, show error message
    loginAPIRequest().catch((error) => {
      // if the server sends error information
      if (error.response) {
        console.log(error.response.data);
        setErrorText(error.response.data.error);

      } else {
        setErrorText("something went wrong...");
      }
    });
  };

  React.useEffect(() => {
    if (loginSuccess) {
      // redirect user to home page
      navigate("/home");
    }
  }, [loginSuccess]);

  return (
    <>
      <Header/>
      <div className='login'>
        <h1>login</h1>
        <div className='form'>
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor='username'>username </label>
            <input 
              type='text' 
              id='username' 
              value={username} 
              // required 
              placeholder='enter username' 
              onChange={onUsernameChange}
            />
            <span className='error-text'>*</span>
            <br/>
            <label htmlFor='password'>password </label>
            <input 
              type='password' 
              id='password' 
              value={password} 
              // required 
              placeholder='enter password' 
              onChange={onPasswordChange}
            />
            <span className='error-text'>*</span>
            <br/>
            <input type='submit' value='log in'/>
          </form>
        </div>
        <span className="error-text">{errorText}</span>
        <br/>
        <br/>
        <span>or</span>
        <br/>
        <button onClick={() => { navigate('/signup') }}>sign up</button>
        <br/>
      </div>
    </>
  );
};

export default LoginPage;
