// src/App.jsx
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Video from './pages/Video/Video';
import SearchResults from './Components/SearchResults/SearchResults';
import Navbar from './Components/Navbar/Navbar.jsx';

const App = () => {
  const [sidebar, setSidebar] = useState(true);

  return (
    <div>
      <Navbar setSidebar={setSidebar} />
      <Routes>
        <Route path='/' element={<Home sidebar={sidebar} />} />
        <Route path='/video/:categoryId/:videoId' element={<Video />} />
        <Route path='/search' element={<SearchResults />} />
      </Routes>
    </div>
  )
}

export default App