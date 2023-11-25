import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import axios from 'axios';
// import { SAPIBase } from '../tools/api';

const SignupPage = () => {

  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [errorText, setErrorText] = React.useState<string>("");
  const [signupSuccess, setSignupSuccess] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)

    //////////////////////////////////////////////////////////// could add feature that informs user of username requirements (length, uniqueness, etc)
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);

    ////////////////////////////////////////////////////////////// could add feature that informs user of password length requirements
  };

  const onFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const onLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleSignupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();  // prevent the page from reloading

    // console.log(event.currentTarget.username.value);
    // console.log(event.currentTarget.password.value);
    // console.log(username);
    // console.log(password);

    // check if input values meet requirements
    if (!username) {
      setErrorText("please enter a username");
      return;
    } else if (!password) {
      setErrorText("please enter a password");
      return;
    } else if (username.length < 3 || username.length > 20) {
      setErrorText("your username must be 3 to 20 characters long");
      return;
    } else if (password.length < 8 || password.length > 20) {
      setErrorText("your password must be 8 to 20 characters long");
      return;
    } else if (!firstName) {
      setErrorText("please enter your first name");
      return;
    }

    const signupAPIRequest = async() => {

      // basically defines the types of data that a UserInfo object has; not necessary but ig it helps with type clarity
      interface UserInfo {
        username: string;
        firstName: string;
        lastName: string;
      };

      const { data } = await axios.post<UserInfo>('/user/signup', { username: username, password: password, firstName: firstName, lastName: lastName });
      console.log(data);

      setErrorText("");
      setSignupSuccess(true);
    };
    
    // if an error occurs, show error message
    signupAPIRequest().catch((error) => {
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
    if (signupSuccess) {
      // redirect user to home page
      navigate("/home");
    }
  }, [signupSuccess]);

  return (
    <>
      <Header/>
      <div className='signup'>
        <h1>sign up</h1>
        <div className='form'>
          <form onSubmit={handleSignupSubmit}>
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
            <label htmlFor='firstname'>first name </label>
            <input 
              type='text' 
              id='firstname' 
              value={firstName} 
              // required 
              placeholder='enter your first name' 
              onChange={onFirstNameChange}
            />
            <span className='error-text'>*</span>
            <br/>
            <label htmlFor='lastname'>last name </label>
            <input 
              type='text' 
              id='lastname' 
              value={lastName} 
              placeholder='enter your last name' 
              onChange={onLastNameChange}
            />
            <br/>
            <input type='submit' value='sign up'/>
          </form>
        </div>
        <span className="error-text">{errorText}</span>
        <br/>
        <br/>
        <span>or</span>
        <br/>
        <button onClick={() => { navigate('/login') }}>log in</button>
        <br/>
      </div>
    </>
  );
};

export default SignupPage;
