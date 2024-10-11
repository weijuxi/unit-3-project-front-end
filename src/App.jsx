import { useState, createContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar.jsx';
import Landing from './components/Landing/Landing.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import SignupForm from './components/SignupForm/SignupForm.jsx';
import SigninForm from './components/SigninForm/SigninForm.jsx';

import MovieList from './components/MovieList/MovieList.jsx';
import MovieDetails from './components/MovieDetails/MovieDetails.jsx';

import * as authService from '../src/services/authService.js'; // import the authservice
import * as movieService from '../src/services/movieService.js'


export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser()); // using the method from authservice
  const [movies, setMovies] = useState([])

  useEffect(() => {
    async function fetchAllMovie(){
     const movieData = await movieService.index()
      setMovies(movieData)
      console.log(movieData)
    }

    if(user){
      fetchAllMovie()
    }

  }, [user])

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };


  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {user ? (
            <>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/movies" element={<MovieList movies={movies} />} />
            <Route path="/movies/:movieId" element={<MovieDetails />} />
            </>
          ) : (
            <Route path="/" element={<Landing />} />
          )}
          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;