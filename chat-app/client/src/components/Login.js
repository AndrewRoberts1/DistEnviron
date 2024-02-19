
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [loginPage, setLoginPage] = useState(false);

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
    <div className="App">
      <form onSubmit={loginPage ? handleLogin: handleCreateUser}>
        <label>Name</label>
        <input
          required={true}
          type='text'
          name="userName"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}/>
          <label>Email</label>
          <input
          required={true}
          type='text'
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}/>
          <label>Password</label>
          <input
          required={true}
          type='text'
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
          {/* {!loginPage ?
          <>
            <label >Profile photo</label>
            <input
            required={!loginPage}
            type='file'
            accept="image/*"
            name="image"
            id="image"
            onChange={handleImageChange} />
          </>
          : 
          null} */}
          <button type='submit' className="loginBtn">{loginPage ? "Login In" : "Create Account"}</button>
          {/* let users swap between logging in and creating an account */}
          <button onClick={()=> setLoginPage(!loginPage)}>{loginPage ? "Not have an account? Click here" : "Already have an account? Click here"}</button>

          {//Show error
            showErr ? <h4>error</h4> : null
          }

          
      </form>
      
    </div>
    
  );
}

export default Login;