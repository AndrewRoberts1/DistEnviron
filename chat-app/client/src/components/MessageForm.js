import './MessageForm.css';
import { IoIosSend } from "react-icons/io";
import { GrAttachment } from "react-icons/gr";

function MessageForm () {

    
    return (
      <div className='messageFormCont'>
        <form className="messageForm">
          <button className='attachBtn'> <GrAttachment className='largeIcon'/></button>
          <textarea 
            className='messageBox'
            // onChange={this.handleChange}
            // value={this.state.message}
            placeholder="Type a message"
            type="text" />
          <button className='sendBtn'> <IoIosSend className='largeIcon'/></button>
        </form>
      </div>
    )

}
export default MessageForm;