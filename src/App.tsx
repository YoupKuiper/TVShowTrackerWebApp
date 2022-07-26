import axios from 'axios';
import { useState } from "react";
import CreateAccountFormModal from './Components/CreateAccountFormModal/CreateAccountFormModal';
import LoginFormModal from './Components/LoginFormModal/LoginFormModal';
import { NavBar } from './Components/NavBar/NavBar';
import SearchBar from './Components/SearchBar/SearchBar';
import TVShowsListView from './Components/TVShowsListView/TVShowsListView';
import { DEFAULT_TOKEN, DEFAULT_USER, JWT_TOKEN_KEY, MOVIEDB_API_BASE_URL, PAGE_NAME_SEARCH, PAGE_NAME_TRACKED_TV_SHOWS } from './constants';
import { LoginResponse, TvShow, User } from './validators';

const App = () => {

  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [trackedTVShows, setTrackedTVShows] = useState<TvShow[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User>(DEFAULT_USER);
  const [currentPage, setCurrentPage] = useState(PAGE_NAME_SEARCH)
  const [showSpinner, setShowSpinner] = useState(false)
  const isLoggedIn = localStorage.getItem(JWT_TOKEN_KEY) !== DEFAULT_TOKEN;
  const showTrackedTVShows = currentPage === PAGE_NAME_TRACKED_TV_SHOWS
  const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL

  const searchTvShow = async (title: string) => {
    try {
      setShowSpinner(true)
      const { data, status } = await axios.get<any>(
        `${MOVIEDB_API_BASE_URL}/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${encodeURIComponent(title)}&include_adult=true`
      );
      console.log('Response status is: ', status);
      setShowSpinner(false)
      setTvShows(data.results);

    } catch (error) {
      setShowSpinner(false)
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
    if (newPage === PAGE_NAME_TRACKED_TV_SHOWS) {
      try {
        setShowSpinner(true)
        const { data, status } = await axios.post<any>(
          `${TV_SHOW_TRACKER_API_BASE_URL}/GetTrackedTVShows`,
          { token: localStorage.getItem(JWT_TOKEN_KEY) }
        );
        console.log('response status is: ', status);
        setShowSpinner(false)
        setTrackedTVShows(data);

      } catch (error) {
        setShowSpinner(false)
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
        } else {
          console.log('unexpected error: ', error);
        }
      }
    }

    setCurrentPage(newPage)
  }

  const createUserAccount = async (emailAddress: string, password: string) => {
    try {
      const { data, status } = await axios.post<any>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/CreateAccount`,
        { emailAddress, password }
      );

      console.log(`Data: ${JSON.stringify(data, null, 4)}`);
      console.log('response status is: ', status);

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
      if (!token) {
        console.error('No token found')
        return;
      }

      console.log(`TV show id: ${tvShow.id}`)
      let newTrackedTvShowsList = [];
      if (toRemove) {
        newTrackedTvShowsList = trackedTVShows.filter(e => e.id !== tvShow.id)
      } else {
        // TODO: Prevent duplicates
        newTrackedTvShowsList = trackedTVShows.concat(tvShow)
      }

      const { data, status } = await axios.post<TvShow[]>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/UpdateTrackedTVShow`,
        { token, tvShowsList: newTrackedTvShowsList }
      );

      console.log(`Data: ${JSON.stringify(data, null, 4)}`);
      console.log('response status is: ', status);
      setTrackedTVShows(data)
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
      <NavBar
        setCurrentPage={updateCurrentPage}
        currentPage={currentPage}
        loggedInUser={loggedInUser}
        setShowLoginModal={setShowLoginModal}
        setShowCreateAccountModal={setShowCreateAccountModal}
        logout={logoutUser} />
      <SearchBar search={searchTvShow} />
      <TVShowsListView
        isTrackedList={showTrackedTVShows}
        tvShows={tvShows}
        trackedTVShows={trackedTVShows}
        showSpinner={showSpinner}
        handleClick={showTrackedTVShows ? removeTrackedTVShow : addTrackedTVShow}
        isLoggedIn={isLoggedIn} />
      {showLoginModal && <LoginFormModal setShowLoginModal={setShowLoginModal} loginUser={loginUser} />}
      {showCreateAccountModal && <CreateAccountFormModal setShowCreateAccountModal={setShowCreateAccountModal} createUserAccount={createUserAccount} />}
    </div>
  )
}

export default App;
