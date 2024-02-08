import './App.css';
import Navbar from './components/NavBar';
import Messages from './components/Messages';
import MessageForm from './components/MessageForm';
import { useState } from 'react';

//Server imports
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000');

function App() {
  const [activeChatId, setActiveChatId] = useState();
  return (
    <div className="App">
      <Navbar activeChatId={activeChatId} setActiveChatId={setActiveChatId}></Navbar>
      <Messages></Messages>
      <MessageForm></MessageForm>
    </div>
  );
}

export default App;
