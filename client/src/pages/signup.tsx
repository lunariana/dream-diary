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
        setErrorText("Something went wrong...");
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
    <div className='signup'>
      <Header/>
      <h1>Sign Up</h1>
      <div className='form'>
        <form onSubmit={handleSignupSubmit}>
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
          <label htmlFor='firstname'>First Name </label>
          <input 
            type='text' 
            id='firstname' 
            value={firstName} 
            required 
            placeholder='Enter your first name' 
            onChange={onFirstNameChange}
          />
          <br/>
          <label htmlFor='lastname'>Last Name </label>
          <input 
            type='text' 
            id='lastname' 
            value={lastName} 
            placeholder='Enter your last name' 
            onChange={onLastNameChange}
          />
          <br/>
          <input type='submit' value='Sign Up'/>
        </form>
      </div>
      <p>or</p>
      <button onClick={() => { navigate('/login') }}>Log In</button>
      <span>{errorText}</span>
    </div>
  );
};

export default SignupPage;
