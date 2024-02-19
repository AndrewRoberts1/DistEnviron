import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { RxExit } from "react-icons/rx";
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';

function Navbar({activeChatId, setActiveChatId, socket, user}) {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const [users, setUsers] = useState([]);
  const showSidebar = () => setSidebar(!sidebar);

  
  useEffect(() => {
    //When new user list sent out set to data
    socket.on('userList', (data) => setUsers(data));
  }, [socket, users]);

  function handleLogOut() {
    //remove current user from local storage
    localStorage.removeItem('user');
    //emit change to socket so user can be removed from the active users list
    socket.emit('removeUser', {name: user.name, userId: user._id, socketId: socket.id});
    //Navigate to login page
    navigate('/');
  }

  console.log('users arr' ,users)

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar navText'>
          <FaIcons.FaBars onClick={showSidebar}  className='largeIcon'/>
          <div className="flex-grow"></div>

          <p>{activeChatId}</p>
          <div className="flex-grow"></div>
          <RxExit onClick={()=> handleLogOut()} className='largeIcon mx-auto mr-20'/>
            
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle navText'>
                <AiIcons.AiOutlineClose className='largeIcon' />
            </li>
            {SidebarData.map((item, index) => {
              return (
                <div key={'div'+index}>
                    <li key={index} className={"navText " + (item.chatId == activeChatId ? "activeChat" : "")} onClick={() => {setActiveChatId(item.chatId)}}>
                        {/* <button className='chatBtn' onClick={() => {setActiveChatId(item.chatId)}}> */}
                            {item.icon}
                            <span key={'title'+index}>{item.title}</span>
                        {/* </button> */}
                        
                    </li>
                    <hr key={'divider'+index}/>
                </div>
              );
            })}
          </ul>

          {/* current user list */}
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle navText'>
                <AiIcons.AiOutlineClose className='largeIcon' />
            </li>
            {users.length > 0 ? users.map((item, index) => {
              return (
                <div key={'div'+index}>
                    <li key={index} >
                        {/* <button className='chatBtn' onClick={() => {setActiveChatId(item.chatId)}}> */}
                            {/* {item.icon} */}
                            <span key={'title'+index}>{item.name}</span>
                        {/* </button> */}
                        
                    </li>
                    <hr key={'divider'+index}/>
                </div>
              );
            })
          :null}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;