import './Messages.css';

function Messages () {

    const messages = [{
        id: 1,
        senderId: "Tom",
        text: 'Meow'
    },{
        id: 2,
        senderId: "You",
        text: 'Meow back at ya'
    },{
        id: 3,
        senderId: "Tom",
        text: 'Meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow'
    },{
        id: 4,
        senderId: "You",
        text: 'Wow tom i cant believe you would say that. that is horrible, i dont know how we go forward from here. This is the worst thing you have ever said!'
    },{
        id: 5,
        senderId: "Tom",
        text: 'Meow'
    },{
        id: 6,
        senderId: "You",
        text: 'Love you too bud'
    }]
    return (
        <ul className="messageList">                 
          {/* {this.props.messages.map(message => { */}
          {messages.map(message => {
            return (
             <li key={message.id} className={message.senderId == 'You' ? "sentLI" : "recievedLI"}>
               <div className={message.senderId == 'You' ? "" : ""}>
                 {message.senderId}
               </div>
               <div className='messageCont' >
                    {message.senderId == 'You' ?<div className="sentPadd"></div> : null}
                    <span className={"message " + (message.senderId == 'You' ? "sentMessage" : "recievedMessage")}>{message.text}</span>
                    {message.senderId != 'You' ?<div className="recievedPadd"></div> : null}
               </div>
             </li>
           )
         })}
       </ul>
    )

}
export default Messages;