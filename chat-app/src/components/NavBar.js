import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons';

function Navbar({activeChatId, setActiveChatId}) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar navText'>
            <FaIcons.FaBars onClick={showSidebar}  className='largeIcon'/>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle navText'>
                <AiIcons.AiOutlineClose className='largeIcon' />
            </li>
            {SidebarData.map((item, index) => {
              return (
                <>
                    <li key={index} className={"navText " + (item.chatId == activeChatId ? "activeChat" : "")} onClick={() => {setActiveChatId(item.chatId)}}>
                        {/* <button className='chatBtn' onClick={() => {setActiveChatId(item.chatId)}}> */}
                            {item.icon}
                            <span>{item.title}</span>
                        {/* </button> */}
                        
                    </li>
                    <hr/>
                </>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;