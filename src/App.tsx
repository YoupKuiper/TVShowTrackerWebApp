import axios from 'axios';
import { useState } from "react";
import LoginFormModal from './Components/LoginFormModal/LoginFormModal';
import { NavBar } from './Components/NavBar/NavBar';
import SearchBar from './Components/SearchBar/SearchBar';
import TvShowsListView from './Components/TvShowsListView/TvShowsListView';
import { DEFAULT_TOKEN, JWT_TOKEN_KEY, MOVIEDB_API_BASE_URL, TV_SHOW_TRACKER_API_BASE_URL } from './constants';

const App = () => {

  const [tvShows, setTvShows] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showTrackedTvShows, setShowTrackedTvShows] = useState(false)

  const isLoggedIn = !!loggedInUser;

  const searchTvShow = async (title: string) => {
    try {
      const { data, status } = await axios.get<any>(
        `${MOVIEDB_API_BASE_URL}/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${encodeURIComponent(title)}`
      );
  
      console.log(`Data.results: ${JSON.stringify(data.results, null, 4)}`);
      console.log('response status is: ', status);

      setTvShows(data.results);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error.message);
        return error.message;
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  const loginUser = async (emailAddress: string, password: string) => {
    try {
      const { data, status } = await axios.post<any>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/Login`,
        { emailAddress, password }
      );
      console.log(`Data: ${JSON.stringify(data, null, 4)}`);
      console.log('response status is: ', status);

      setLoggedInUser(data.parsedUser);
      localStorage.setItem(JWT_TOKEN_KEY, data.token);
        
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error);
        return error.message;
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  const logoutUser = () => {
    // Delete jwt token
    localStorage.setItem(JWT_TOKEN_KEY, DEFAULT_TOKEN);

    // Update state
    setLoggedInUser(null);
  }

  const addTrackedTVShow = (id: number) => {
    return null;
  }

  const removeTrackedTVShow = (id: number) => {
    return null;
  }

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} setShowLoginModal={setShowLoginModal} setShowTrackedTvShows={setShowTrackedTvShows} logout={logoutUser} />
      <SearchBar search={searchTvShow} />
      <TvShowsListView isTrackedList={showTrackedTvShows} tvShows={isLoggedIn && showTrackedTvShows ? loggedInUser : tvShows} addTrackedTVShow={addTrackedTVShow} removeTrackedTVShow={removeTrackedTVShow} />
      {showLoginModal && <LoginFormModal setShowLoginModal={setShowLoginModal} loginUser={loginUser}  />}
    </div>
  )
}

export default App;
