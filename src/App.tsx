import axios from 'axios';
import { useState } from "react";
import LoginFormModal from './Components/LoginFormModal/LoginFormModal';
import { NavBar } from './Components/NavBar/NavBar';
import SearchBar from './Components/SearchBar/SearchBar';
import TvShowsListView from './Components/TvShowsListView/TvShowsListView';
import { MOVIEDB_API_BASE_URL, TV_SHOW_TRACKER_API_BASE_URL } from './constants';

const App = () => {

  const [tvShows, setTvShows] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [trackedTvShows, setTrackedTvShows] = useState([]);

  const searchTvShow = async (title: string) => {
    try {
      const { data, status } = await axios.get<any>(
        `${MOVIEDB_API_BASE_URL}/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${encodeURIComponent(title)}`
      );
  
      console.log(`Data.results: ${JSON.stringify(data.results, null, 4)}`);
      console.log('response status is: ', status);

      setTvShows(data.results)

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
      console.log(`Data.results: ${JSON.stringify(data.results, null, 4)}`);
      console.log('response status is: ', status);
        
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

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} setShowLoginModal={setShowLoginModal} />
      <SearchBar search={searchTvShow} />
      <TvShowsListView tvShows={tvShows}/>
      {showLoginModal && <LoginFormModal setShowLoginModal={setShowLoginModal} loginUser={loginUser}  />}
    </div>
  )
}

export default App;
