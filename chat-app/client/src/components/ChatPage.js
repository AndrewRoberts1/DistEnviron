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
    if (!user) {
      navigate('/');
    } else {
      //If user is found on start up then send to socket
      socket.emit('newUser', {name: user.name, userId: user._id, socketId: socket.id});
    }
  }, [user])

  return (
    <div className="App">
      <Navbar socket={socket} activeChatId={activeChatId} setActiveChatId={setActiveChatId} user={user} />
      <Messages socket={socket} user={user} />
      <MessageForm socket={socket} user={user} />
    </div>
    
  );
}

export default ChatPage;