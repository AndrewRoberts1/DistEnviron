import { useEffect, useState, useRef } from 'react';
import './Messages.css';
import { TbDownload } from "react-icons/tb";
const API_URL = 'http://localhost:4000/api';

function Messages ({socket, user}) {
   const [messages, setMessages] = useState([]);
   const lastMessageRef = useRef(null);

    //when message response is sent add to messages json
    useEffect(() => {
      socket.on('messageResponse', (data) => setMessages([...messages, data]));
    }, [socket, messages]);

    useEffect(() => {
      //Scroll to bottom every time messages change
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });

      //Get messages from data base
      if (messages.length == 0){
        getMessages();
      }
    }, [messages]);

    async function getMessages() {
      return await fetch(`${API_URL}/getMsgs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to create user');
        }
        return response.json(); // Parse the response body as JSON
      })
      //Successful response
      .then(response => {
        console.log('response: ', response)
        setMessages(response);
      })
      //Handle errors
      .catch(error => {
        console.error('Error getting messages:', error);
      });
    }


    async function handleDownload(file) {
      // Create a temporary URL for the Blob from the file data
      const url = URL.createObjectURL(dataURItoBlob(file.data));
      
      // Create a download link
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;

      // Append the link to the document body
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link from the document body
      document.body.removeChild(link);

      // Revoke the temporary URL to free up memory
      URL.revokeObjectURL(url);
    }

    //Covert the file data from dataURI to a Blob
    function dataURItoBlob(dataURI) {
      //Get the mime
      var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
      //Decode the base64 from the data
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
         array.push(binary.charCodeAt(i));
      }
      //Return the new blob from the file data
      return new Blob([new Uint8Array(array)], {type: mime});
    }


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
               {
                message.file ? 
                  <div className='messageCont' >
                      {message.senderId == user['_id'] ?<div className="sentPadd"></div> : null}
                      <span className={"message " + (message.senderId == user['_id'] ? "sentMessage" : "recievedMessage")}>
                        <div className="message-content" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                          <div style={{width:'85%'}}>{message.file.name}</div>
                          {/* Divider line */}
                          <div className="vertical-line" ></div>
                          <div style={{width:'15% '}} className='downloadBtn'><TbDownload onClick={()=> handleDownload(message.file)} className='largeIcon'/></div>
                        </div>
                      </span>
                      {message.senderId != user['_id'] ?<div className="recievedPadd"></div> : null}
                  </div>

                :
                null
               }
               {/* Ref item for the screen to scroll to */}
               <div ref={lastMessageRef} />
               
             </li>
           )
         })}
       </ul>
    )

}
export default Messages;