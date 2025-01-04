import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Intro from './Intro';
import { MainGame } from './MainGame';

export const App = () => {
  const [username, setUsername] = useState<string>("");
  const [allUsernames, setAllUsernames] = useState<string[]>([]);

  
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro username={username} setUsername={setUsername} 
          allUsernames={allUsernames} setAllUsernames={setAllUsernames} />} />

          <Route path="/game" element={<MainGame username={username}/>}/> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
