
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'

const API_URL = 'http://localhost:4000/api';

function Login({socket}) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [imageData, setImageData] = useState('');
  //Used to display error on page
  const [showErr, setShowErr] = useState(false);
  //Used to toggle between loggin in and creating account
  const [loginPage, setLoginPage] = useState(true);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    return await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: userName, email:password, password: password })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      return response.json(); // Parse the response body as JSON
    })
    //Successful response
    .then(response => {
      console.log('response: ', response)
      login(response);
    })
    //Handle errors
    .catch(error => {
      console.error('Error logging on user:', error);
      setShowErr(true);
    });
  };

  //Function to log in based on fields
  const handleLogin = async (e) => {
    e.preventDefault();
    
    await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: userName, email:email, password: password })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      return response.json(); // Parse the response body as JSON
    })
    //Successful response
    .then(response => {
      console.log('response: ', response)

      login(response);
    })
    //Handle errors
    .catch(error => {
      console.error('Error logging on user:', error);
      setShowErr(true);
    });
  };

  //Get the base64 of image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageData(reader.result);
      };
    }
  };

  function login(user) {
    //Locally store the current users info
    localStorage.setItem('user', JSON.stringify(user));
    //share current users info with all users
    socket.emit('newUser', {name: user.name, userId: user._id, socketId: socket.id});
    //Go to chat page
    navigate('/chat');
    
  }

  return (
    <div className="loginPage">
      <form onSubmit={loginPage ? handleLogin: handleCreateUser} className='loginForm'>
        <div className='col '>
          <div className='row'>
            <input
              required={true}
              type='text'
              name="userName"
              id="userName"
              value={userName}
              placeholder={"Name"}
              className='loginInput'
              onChange={(e) => setUserName(e.target.value)}
            />
            <hr className='loginDetailsDivider'/>
          </div>
          <div className='row'>
            <input
              required={true}
              type='text'
              name="email"
              id="email"
              value={email}
              placeholder={"Email"}
              className='loginInput'
              onChange={(e) => setEmail(e.target.value)}
            />
            <hr className='loginDetailsDivider'/>
          </div>
          <div className='row'>
            <input
              required={true}
              type='text'
              name="password"
              id="password"
              value={password}
              placeholder={"Password"}
              className='loginInput'
              onChange={(e) => setPassword(e.target.value)}
            />
            <hr className='loginDetailsDivider'/>
          </div>
          {//Show error
            showErr ? <h4 className='errMsg'>There was an error. Please try again</h4> : null
          }
          <div className='row'>
            <button type='submit' className="loginBtn submitBtn">{loginPage ? "Login" : "Create Account"}</button>
          </div>
          <div className='row'>
            <span className='accMsg'>{loginPage ? "Don't have an account yet?" : "Already have an account?"}</span>
          </div>
          <div className='row'>
            <button className="loginBtn registerBtn" onClick={()=> setLoginPage(!loginPage)}>{loginPage ? "Register" : "Login"}</button>
          </div>

        </div>

          
      </form>
      
    </div>
    
  );
}

export default Login;