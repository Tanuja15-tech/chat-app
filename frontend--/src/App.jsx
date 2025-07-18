import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import { Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
      <div className="App">
        {/* route for home page and chat page */}
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/chats" element={<ChatPage />} exact />
        </Routes>

      </div>
    </>
  );
}

export default App;
