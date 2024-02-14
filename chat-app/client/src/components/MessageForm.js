import './MessageForm.css';
import { IoIosSend } from "react-icons/io";
import { GrAttachment } from "react-icons/gr";
import { useRef, useState } from 'react';

function MessageForm ({socket, user}) {
  const [message, setMessage] = useState('');
  const fileInputRef=useRef();

  const handleSendMessage = (e) => {
    //stops the default of an action happening - stops disconnect on message send
    e.preventDefault();
    // if (message.trim() && localStorage.getItem('userName')) {
      socket.emit('message', {
        text: message,
        // name: localStorage.getItem('userName'),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        senderId:user['_id'],
        senderName: user['name'],
        sentTime: new Date()
      });
    // }
    setMessage('');
  };
    
  return (
    <div className='messageFormCont'>
      <form className="messageForm" onSubmit={handleSendMessage}>
        <button className='attachBtn' onClick={()=>fileInputRef.current.click()}> <GrAttachment className='largeIcon'/></button>
        <input  multiple={false} ref={fileInputRef} type='file'hidden/>
        <textarea 
          required={true}
          className='messageBox'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          type="text" />
        <button className='sendBtn' type='submit'> <IoIosSend className='largeIcon'/></button>
      </form>
    </div>
  )

}
export default MessageForm;