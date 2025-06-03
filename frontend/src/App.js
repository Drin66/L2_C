import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './layout/Footer';
import NavBar from './layout/NavBar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import { isLoggedIn, login, logout } from './utils/Auth';
import User from './pages/User.jsx';
import Update from './pages/Update.jsx';
import Signup from './pages/Signup.jsx';
import ActorMovies from './pages/ActorMovies';
import MovieChatbot from './components/MovieChatbot'; 

function App() {
  const [searchText, setSearchText] = useState('');
  const [user, setUser] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const loggedInUser = isLoggedIn();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleSearch = (searchQuery) => {
    setSearchText(searchQuery);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    login(userData);
  };

  const handleLogout = () => {
    setUser(null);
    logout();
  };

  return (
    <div className='App'>
      <BrowserRouter>
        <NavBar
          user={user}
          onSearch={handleSearch}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <Routes>
          <Route
            path='/'
            element={<Home searchText={searchText} user={user} />}
          />
          <Route path='/movie/:id' element={<MovieDetails />} />
          <Route path="/user" element={<User />} />
          <Route path="/update/:id" element={<Update />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/actor/:actorId" element={<ActorMovies />} />


        </Routes>
        <Footer />
        <MovieChatbot />
      </BrowserRouter>
    </div>
  );
}

export default App;
