import './App.css';
import Navbar from './components/NavBar';
import Messages from './components/Messages';
import MessageForm from './components/MessageForm';
import { useState } from 'react';

function App() {
  const [activeChatId, setActiveChatId] = useState()
  return (
    <div className="App">
      <Navbar activeChatId={activeChatId} setActiveChatId={setActiveChatId}></Navbar>
      <Messages></Messages>
      <MessageForm></MessageForm>
    </div>
  );
}

export default App;
