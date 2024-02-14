import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';

function Navbar({activeChatId, setActiveChatId, socket}) {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const [users, setUsers] = useState([]);
  const showSidebar = () => setSidebar(!sidebar);

  
  useEffect(() => {
    //When new user list sent out set to data
    socket.on('userList', (data) => setUsers(data));
  }, [socket, users]);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar navText'>
            <FaIcons.FaBars onClick={showSidebar}  className='largeIcon'/>
            <button onClick={()=> navigate('/')}> logout</button>
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
            {users.map((item, index) => {
              return (
                <div key={'div'+index}>
                    <li key={index} >
                        {/* <button className='chatBtn' onClick={() => {setActiveChatId(item.chatId)}}> */}
                            {item.icon}
                            <span key={'title'+index}>{item.name}</span>
                        {/* </button> */}
                        
                    </li>
                    <hr key={'divider'+index}/>
                </div>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;