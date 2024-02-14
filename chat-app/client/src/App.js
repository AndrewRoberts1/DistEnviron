import './App.css';
import ChatPage from './components/ChatPage';
import Login from './components/Login';
import { HashRouter, Route, Routes } from "react-router-dom";

//Server imports
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:4000');

function App() {

  return (
    <HashRouter>
        <Routes>
          <Route path="/" element={<Login socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
        </Routes>
    </HashRouter>
  );
}

export default App;
