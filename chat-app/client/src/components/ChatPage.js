import Navbar from './NavBar';
import Messages from './Messages';
import MessageForm from './MessageForm';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatPage({socket}) {
  const navigate = useNavigate();
  const [activeChatId, setActiveChatId] = useState();
  
  //Navigate to log in if no user found in local storage
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(()=>{
    if (!user) navigate('/');
  }, [user])

  return (
    <div className="App">
      <Navbar socket={socket} activeChatId={activeChatId} setActiveChatId={setActiveChatId} />
      <Messages socket={socket} user={user} />
      <MessageForm socket={socket} user={user} />
    </div>
    
  );
}

export default ChatPage;