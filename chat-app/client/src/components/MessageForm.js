import './MessageForm.css';
import { IoIosSend } from "react-icons/io";
import * as AiIcons from 'react-icons/ai';
import { GrAttachment } from "react-icons/gr";
import { useEffect, useRef, useState } from 'react';

function MessageForm ({socket, user}) {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState('');
  const fileInputRef=useRef();

  const handleSendMessage = (e) => {
    //stops the default of an action happening - stops disconnect on message send
    e.preventDefault();
    // if (message.trim() && localStorage.getItem('userName')) {
      socket.emit('message', {
        text: message,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        senderId:user['_id'],
        senderName: user['name'],
        sentTime: new Date(),
        file: file
      });
    // }
    setMessage('');
    setFile('')
  };
  
  
  function handleAddFile(event) {
    //Get the first file added
    const file = event.target.files[0];
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    //Wait for reader to have loaded
    reader.onload = () => {
      //Make object for file
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: reader.result //Send all results - mime and Base64
      };
      //Set new file
      setFile(fileData);
      
    }
  }
  
  function handleRemoveFile () {
    setFile('');
  }
    console.log('thge file is, ',file)
    console.log('thge file length is, ',file.length)
  return (
    <div className='messageFormCont'>
      <form className="messageForm" onSubmit={handleSendMessage}>
        <button className='attachBtn' onClick={()=>fileInputRef.current.click()}> <GrAttachment className='largeIcon'/></button>
        <input  multiple={false} ref={fileInputRef} type='file' hidden onChange={(e)=>handleAddFile(e)}/>
          <div className='messageArea'>
            <textarea 
              required={true}
              className='messageBox'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              type="text"
              style={{height: file ? '50%': '100%'}}
            />
            {
              file ?
              <div style={{ display: 'flex', alignItems: 'center', height: '45%', textAlign: 'center' }}>
                <span>{file.name.length > 30 ? file.name.slice(0,30)+'...' : file.name}</span>
                <AiIcons.AiOutlineClose className='largeIcon' onClick={()=>handleRemoveFile()}/> 
              </div>:
              null
            }
            
          </div>
        <button className='sendBtn' type='submit'> <IoIosSend className='largeIcon'/></button>
      </form>
    </div>
  )

}
export default MessageForm;