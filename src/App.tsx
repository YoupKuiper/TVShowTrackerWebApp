import axios from 'axios';
import { decodeToken } from "react-jwt";
import { useEffect, useState } from "react";
import CreateAccountFormModal from './Components/CreateAccountFormModal/CreateAccountFormModal';
import LoginFormModal from './Components/LoginFormModal/LoginFormModal';
import { NavBar } from './Components/NavBar/NavBar';
import SearchBar from './Components/SearchBar/SearchBar';
import TVShowsListView from './Components/TVShowsListView/TVShowsListView';
import { DARK_MODE_KEY, DEFAULT_TOKEN, DEFAULT_TV_SHOW, DEFAULT_USER, JWT_TOKEN_KEY, PAGE_NAME_SEARCH, PAGE_NAME_TRACKED_TV_SHOWS, TRACKED_TV_SHOWS_KEY } from './constants';
import { LoginResponse, TVShow, User, UserObject } from './validators';
import { TVShowsDetailsModal } from './Components/TVShowDetailsModal/TVShowDetailsModal';


const getTrackedShowsFromLocalStorage = ():TVShow[] => {
  try {
    const trackedTVShows = JSON.parse(localStorage.getItem(TRACKED_TV_SHOWS_KEY) || '[]')
    return trackedTVShows
  } catch (error) {
    return []
  }
}

const getDarkModeStateFromLocalStorage = () => {
  try {
    return !!JSON.parse(localStorage.getItem(DARK_MODE_KEY) || '')
  } catch (error) {
    return false
  }
}

const App = () => {

  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [trackedTVShows, setTrackedTVShows] = useState<TVShow[]>(getTrackedShowsFromLocalStorage);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [tvShowDetailsToShow, setTVShowDetailsToShow] = useState<TVShow>(DEFAULT_TV_SHOW);
  const [loggedInUser, setLoggedInUser] = useState<User>(DEFAULT_USER);
  const [currentPage, setCurrentPage] = useState(PAGE_NAME_SEARCH)
  const [showSpinner, setShowSpinner] = useState(false)
  const [darkMode, setDarkMode] = useState(getDarkModeStateFromLocalStorage)
  const [searchTerm, setSearchTerm] = useState('');
  const showTrackedTVShows = currentPage === PAGE_NAME_TRACKED_TV_SHOWS
  const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  const showTVShowDetailsModal = tvShowDetailsToShow && tvShowDetailsToShow.id !== DEFAULT_TV_SHOW.id
  const isLoggedIn = !!loggedInUser.emailAddress

  useEffect(() => {
    try {
      const token = localStorage.getItem(JWT_TOKEN_KEY)
      if (token && token !== DEFAULT_TOKEN) {
        const decodedToken: any = decodeToken(token);
        const loggedInUser = UserObject.parse(decodedToken.data);
        setLoggedInUser(loggedInUser);
      }

      
      const fetchPopularTVShows = async () => {
        await getPopularTVShows()
      }

      fetchPopularTVShows();

    } catch (error) {
      console.log(error)
      logoutUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkMode));
  }, [darkMode]);

  const getPopularTVShows = async () => {
    try {
      setShowSpinner(true)
      const { data } = await axios.post<any>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/SearchTVShows`,
        { searchString: '' }
      );
      console.log('Response status is: ', data);
      setShowSpinner(false)
      setTvShows(data);

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

  const searchAllTVShows = async (title: string) => {
    const { data } = await axios.post<any>(
      `${TV_SHOW_TRACKER_API_BASE_URL}/SearchTVShows`,
      { searchString: title }
    );
    console.log('Response status is: ', data);
    setTvShows(data);
  }

  const searchTrackedTVShows = async (title: string) => {
    setTrackedTVShows(getTrackedShowsFromLocalStorage().filter((tvShow) => tvShow.name.toLowerCase().includes(title.toLowerCase())))
  }

  const searchTvShow = async (title: string) => {
    try {
      setShowSpinner(true)
      if(currentPage === PAGE_NAME_SEARCH){
        await searchAllTVShows(title)
      }else if(currentPage === PAGE_NAME_TRACKED_TV_SHOWS){
        await searchTrackedTVShows(title)
      }
      setShowSpinner(false)

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
    setSearchTerm('')
    if (newPage === PAGE_NAME_TRACKED_TV_SHOWS) {
      try {
        setShowSpinner(true)
        const { data } = await axios.post<TVShow[]>(
          `${TV_SHOW_TRACKER_API_BASE_URL}/GetTrackedTVShows`,
          { token: localStorage.getItem(JWT_TOKEN_KEY) }
        );

        setShowSpinner(false)
        setTrackedTVShows(data);
        localStorage.setItem(TRACKED_TV_SHOWS_KEY, JSON.stringify(data));

      } catch (error) {
        setShowSpinner(false)
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
          // request failed, relog user in
          setShowLoginModal(true)
        } else {
          console.log('unexpected error: ', error);
        }
      }
    }

    setCurrentPage(newPage)
  }

  const createUserAccount = async (emailAddress: string, password: string) => {
    try {
      const { status } = await axios.post<any>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/CreateAccount`,
        { emailAddress, password }
      );

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
    const { data, status } = await axios.post<LoginResponse>(
      `${TV_SHOW_TRACKER_API_BASE_URL}/Login`,
      { emailAddress, password }
    );

    console.log('response status is: ', status);

    setLoggedInUser(data.user);
    localStorage.setItem(JWT_TOKEN_KEY, data.token);

    updateCurrentPage(PAGE_NAME_TRACKED_TV_SHOWS);
  }

  const logoutUser = () => {
    // Delete jwt token
    localStorage.setItem(JWT_TOKEN_KEY, DEFAULT_TOKEN);
    setTrackedTVShows([])
    localStorage.setItem(TRACKED_TV_SHOWS_KEY, '');

    // Update state
    setLoggedInUser(DEFAULT_USER);
  }

  const addTrackedTVShow = async (tvShow: TVShow) => {
    console.log(`Adding: ${tvShow.id}`)
    
    await updateTrackedTvShows(tvShow, false)
  }

  const removeTrackedTVShow = async (tvShow: TVShow) => {
    console.log(`Removing: ${tvShow.id}`)
    await updateTrackedTvShows(tvShow, true)
  }

  const updateTrackedTvShows = async (tvShow: TVShow, toRemove: boolean) => {
    try {
      const token = localStorage.getItem(JWT_TOKEN_KEY);
      if (!token) {
        console.error('No token found')
        return;
      }

      console.log(`TV show id: ${tvShow.id}`)
      const { data: updatedTrackedTVShows} = await axios.post<TVShow[]>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/GetTrackedTVShows`,
        { token: localStorage.getItem(JWT_TOKEN_KEY) }
      );
      let newTrackedTvShowsList = [];
      if (toRemove) {
        newTrackedTvShowsList = updatedTrackedTVShows.filter(trackedTVShow => trackedTVShow.id !== tvShow.id)
      } else {
        // TODO: Prevent duplicates
        newTrackedTvShowsList = updatedTrackedTVShows.concat(tvShow)
      }

      const { data, status } = await axios.post<any>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/UpdateUser`,
        { token, updateObject: {trackedTVShows: newTrackedTvShowsList }}
      );

      console.log('response status is: ', status);
      setTrackedTVShows(data.trackedTVShows)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error);
        setShowLoginModal(true)
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  const openCreateAccountModalFromLogin = () => {
    setShowLoginModal(false);
    setShowCreateAccountModal(true)
  }

  return (
    <div className={darkMode ? 'dark bg-gray-800 w-full h-screen text-white' : ''}>
      <NavBar
        setCurrentPage={updateCurrentPage}
        currentPage={currentPage}
        darkMode={darkMode}
        isLoggedIn={isLoggedIn}
        emailAddress={loggedInUser.emailAddress}
        setShowLoginModal={setShowLoginModal}
        setShowCreateAccountModal={setShowCreateAccountModal}
        logout={logoutUser}
        setDarkMode={setDarkMode} />
      {!isLoggedIn && <div className='container mx-auto text-center py-5'>
        <div className='text-4xl pb-5'>Welcome to TVTracker</div>
        <div className='text-lg'>Add shows to your list and get email notifications when episodes air!</div>
        <div className='text-lg'><button onClick={() => setShowCreateAccountModal(true)} className='underline'>Create an account</button> or <button onClick={() => setShowLoginModal(true)} className='underline'>Login</button> to get started</div>
      </div>}
      <SearchBar search={searchTvShow} setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>
      <TVShowsListView
        isTrackedList={showTrackedTVShows}
        tvShows={tvShows}
        trackedTVShows={trackedTVShows}
        showSpinner={showSpinner}
        setShowDetails={setTVShowDetailsToShow}
        handleButtonClick={showTrackedTVShows ? removeTrackedTVShow : addTrackedTVShow}
        isLoggedIn={isLoggedIn}
        getPopular={getPopularTVShows} />
      {showTVShowDetailsModal && <TVShowsDetailsModal tvShow={tvShowDetailsToShow} setTVShow={setTVShowDetailsToShow} darkMode={darkMode} />}
      {showLoginModal && <LoginFormModal setShowLoginModal={setShowLoginModal} loginUser={loginUser} createAccount={openCreateAccountModalFromLogin}/>}
      {showCreateAccountModal && <CreateAccountFormModal setShowCreateAccountModal={setShowCreateAccountModal} createUserAccount={createUserAccount} />}
      <div className='border-t dark:border-gray-600'>
          <p className='text-center py-3 text-xs'> Made by Youp Kuiper</p>
      </div>
    </div>
  )
}

export default App;
