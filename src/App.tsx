import axios from 'axios';
import { useState } from "react";
import LoginFormModal from './Components/LoginFormModal/LoginFormModal';
import { NavBar } from './Components/NavBar/NavBar';
import SearchBar from './Components/SearchBar/SearchBar';
import TvShowsListView from './Components/TvShowsListView/TvShowsListView';
import { DEFAULT_TOKEN, DEFAULT_USER, JWT_TOKEN_KEY, MOVIEDB_API_BASE_URL, PAGE_NAME_SEARCH, PAGE_NAME_TRACKED_TV_SHOWS, TV_SHOW_TRACKER_API_BASE_URL } from './constants';
import { LoginResponse, User } from './validators';

const App = () => {

  const [tvShows, setTvShows] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User>(DEFAULT_USER);
  const [currentPage, setCurrentPage] = useState(PAGE_NAME_SEARCH)

  const isLoggedIn = !!loggedInUser.emailAddress;
  const showTrackedTvShows = currentPage === PAGE_NAME_TRACKED_TV_SHOWS

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
      const { data, status } = await axios.post<LoginResponse>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/Login`,
        { emailAddress, password }
      );

      console.log(`Data: ${JSON.stringify(data, null, 4)}`);
      console.log('response status is: ', status);

      setLoggedInUser(data.user);
      localStorage.setItem(JWT_TOKEN_KEY, data.token);
        
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('error message: ', error);
        return error.message;
      } else {
        console.error('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  const logoutUser = () => {
    // Delete jwt token
    localStorage.setItem(JWT_TOKEN_KEY, DEFAULT_TOKEN);

    // Update state
    setLoggedInUser(DEFAULT_USER);
  }

  const addTrackedTVShow = async (id: number) => {
    console.log(`Adding: ${id}`)
    
    await updateUser(id)
  }

  const removeTrackedTVShow = async (id: number) => {
    console.log(`Removing: ${id}`)
    await updateUser(id)
  }

  const updateUser = async (params: any) => {
    try {
      const token = localStorage.getItem(JWT_TOKEN_KEY);
      if(!token){
        console.error('No token found')
        return;
      }

      const { data, status } = await axios.post<any>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/UpdateUser`,
        { token, settings: { trackedTvShows: params } }
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

  return (
    <div>
      <NavBar setCurrentPage={setCurrentPage} currentPage={currentPage} isLoggedIn={isLoggedIn} setShowLoginModal={setShowLoginModal} logout={logoutUser} />
      <SearchBar search={searchTvShow} />
      <TvShowsListView isTrackedList={showTrackedTvShows} tvShows={isLoggedIn && showTrackedTvShows ? loggedInUser.settings.trackedTVShows : tvShows} handleClick={showTrackedTvShows ? removeTrackedTVShow : addTrackedTVShow} />
      {showLoginModal && <LoginFormModal setShowLoginModal={setShowLoginModal} loginUser={loginUser}  />}
    </div>
  )
}

export default App;
