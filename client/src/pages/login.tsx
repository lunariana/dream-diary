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

    ////////////////////////////////////////////////////////////// could add feature that informs user of password length requirements
  };

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();  // prevent the page from reloading

    // console.log(event.currentTarget.username.value);
    // console.log(event.currentTarget.password.value);
    // console.log(username);
    // console.log(password);

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
        setErrorText("Something went wrong...");
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
        <h1>Login</h1>
        <div className='form'>
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor='username'>Username </label>
            <input 
              type='text' 
              id='username' 
              value={username} 
              required 
              placeholder='Enter username' 
              onChange={onUsernameChange}
            />
            <br/>
            <label htmlFor='password'>Password </label>
            <input 
              type='password' 
              id='password' 
              value={password} 
              required 
              placeholder='Enter password' 
              onChange={onPasswordChange}
            />
            <br/>
            <input type='submit' value='Log In'/>
          </form>
        </div>
        <br/>
        <span>or</span>
        <br/>
        <button onClick={() => { navigate('/signup') }}>Sign Up</button>
        <br/>
        <span className="error-text">{errorText}</span>
      </div>
    </>
  );
};

export default LoginPage;
