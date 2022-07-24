import axios from 'axios';
import { useState } from "react";
import LoginFormModal from './components/LoginFormModal/LoginFormModal';
import { NavBar } from './components/NavBar/NavBar';
import SearchBar from './components/SearchBar/SearchBar';
import TvShowsListView from './components/TvShowsListView/TvShowsListView';
import { DEFAULT_TOKEN, DEFAULT_USER, JWT_TOKEN_KEY, MOVIEDB_API_BASE_URL, PAGE_NAME_SEARCH, PAGE_NAME_TRACKED_TV_SHOWS, TV_SHOW_TRACKER_API_BASE_URL } from './constants';
import { LoginResponse, TvShow, TvShowList, User } from './validators';

const App = () => {

  const [tvShows, setTvShows] = useState<TvShowList>([]);
  const [trackedTVShows, setTrackedTVShows] = useState<TvShowList>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User>(DEFAULT_USER);
  const [currentPage, setCurrentPage] = useState(PAGE_NAME_SEARCH)

  const isLoggedIn = localStorage.getItem(JWT_TOKEN_KEY) !== DEFAULT_TOKEN;
  const showTrackedTvShows = currentPage === PAGE_NAME_TRACKED_TV_SHOWS

  const searchTvShow = async (title: string) => {
    try {
      const { data, status } = await axios.get<any>(
        `${MOVIEDB_API_BASE_URL}/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${encodeURIComponent(title)}`
      );
      console.log(`Data.results: ${JSON.stringify(data, null, 4)}`);
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

  const updateCurrentPage = async (newPage: string) => {
    if(newPage === PAGE_NAME_TRACKED_TV_SHOWS){
      try {
        const { data, status } = await axios.post<any>(
          `${TV_SHOW_TRACKER_API_BASE_URL}/GetTrackedTVShows`,
          { token: localStorage.getItem(JWT_TOKEN_KEY) }
        );
        console.log(`Data.results: ${JSON.stringify(data, null, 4)}`);
        console.log('response status is: ', status);
  
        setTrackedTVShows(data);
  
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
        } else {
          console.log('unexpected error: ', error);
        }
      }
    }

    setCurrentPage(newPage)
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

  const addTrackedTVShow = async (tvShow: TvShow) => {
    console.log(`Adding: ${tvShow.id}`)
    
    await updateTrackedTvShows(tvShow, false)
  }

  const removeTrackedTVShow = async (tvShow: TvShow) => {
    console.log(`Removing: ${tvShow.id}`)
    await updateTrackedTvShows(tvShow, true)
  }

  const updateTrackedTvShows = async (tvShow: TvShow, toRemove: boolean) => {
    try {
      const token = localStorage.getItem(JWT_TOKEN_KEY);
      if(!token){
        console.error('No token found')
        return;
      }

      console.log(`TV show id: ${tvShow.id}`)
      let newTrackedTvShowsList = [];
      if (toRemove){
        newTrackedTvShowsList = trackedTVShows.filter(e => e.id !== tvShow.id) 
      }else{
        // TODO: Prevent duplicates
        newTrackedTvShowsList = trackedTVShows.concat(tvShow)
      }

      const { data, status } = await axios.post<User>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/UpdateTrackedTVShow`,
        { token, tvShowsList: newTrackedTvShowsList }
      );
      
      console.log(`Data: ${JSON.stringify(data, null, 4)}`);
      console.log('response status is: ', status);
      setLoggedInUser(data)
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
      <NavBar setCurrentPage={updateCurrentPage} currentPage={currentPage} loggedInUser={loggedInUser} setShowLoginModal={setShowLoginModal} logout={logoutUser} />
      <SearchBar search={searchTvShow} />
      <TvShowsListView isTrackedList={showTrackedTvShows} tvShows={isLoggedIn && showTrackedTvShows ? trackedTVShows : tvShows} handleClick={showTrackedTvShows ? removeTrackedTVShow : addTrackedTVShow} />
      {showLoginModal && <LoginFormModal setShowLoginModal={setShowLoginModal} loginUser={loginUser}  />}
    </div>
  )
}

export default App;
