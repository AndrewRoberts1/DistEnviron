import { useEffect, useState } from 'react';
import './Messages.css';

function Messages ({socket, user}) {
   const [messages, setMessages] = useState([]);

    //when message response is sent add to messages json
    useEffect(() => {
      socket.on('messageResponse', (data) => setMessages([...messages, data]));
    }, [socket, messages]);

    return (
        <ul className="messageList">                 
          {/* {this.props.messages.map(message => { */}
          {messages.map(message => {
            return (
             <li key={message.id} className={message.senderId == user['_id'] ? "sentLI" : "recievedLI"}>
               <div className={message.senderId == user['_id'] ? "" : ""}>
                 {message.senderName}<br/>
                 {new Date(message.sentTime).toLocaleString()}
               </div>
               <div className='messageCont' >
                    {message.senderId == user['_id'] ?<div className="sentPadd"></div> : null}
                    <span className={"message " + (message.senderId == user['_id'] ? "sentMessage" : "recievedMessage")}>{message.text}</span>
                    {message.senderId != user['_id'] ?<div className="recievedPadd"></div> : null}
               </div>
             </li>
           )
         })}
       </ul>
    )

}
export default Messages;