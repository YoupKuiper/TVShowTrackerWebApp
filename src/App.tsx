
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Cookies from 'universal-cookie';
import CreateAccountFormModal from './Components/CreateAccountFormModal/CreateAccountFormModal';
import LoginFormModal from './Components/LoginFormModal/LoginFormModal';
import { NavBar } from './Components/NavBar/NavBar';
import ResetPasswordModal from './Components/ResetPasswordModal/ResetPasswordModal';
import SearchBar from './Components/SearchBar/SearchBar';
import { TVShowsDetailsModal } from './Components/TVShowDetailsModal/TVShowDetailsModal';
import TVShowsListView from './Components/TVShowsListView/TVShowsListView';
import UnsubscribeEmailModal from './Components/UnsubscribeEmailModal/UnsubscribeEmailModal';
import { CURRENT_PAGE_KEY, DARK_MODE_KEY,  DEFAULT_TV_SHOW, DEFAULT_USER, JWT_TOKEN_KEY, PAGE_NAME_SEARCH, PAGE_NAME_TRACKED_TV_SHOWS, USER_KEY } from './constants';
import { useStickyState } from './hooks';
import { LoginResponse, TVShow, User } from './validators';

const getDarkModeStateFromLocalStorage = () => {
  try {
    return !!JSON.parse(localStorage.getItem(DARK_MODE_KEY) || '')
  } catch (error) {
    return false
  }
}


const App = () => {

  const [darkMode, setDarkMode] = useStickyState(getDarkModeStateFromLocalStorage, DARK_MODE_KEY)
  const [loggedInUser, setLoggedInUser] = useStickyState(DEFAULT_USER, USER_KEY);
  const [currentPage, setCurrentPage] = useStickyState(PAGE_NAME_SEARCH, CURRENT_PAGE_KEY)
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [tvShowDetailsToShow, setTVShowDetailsToShow] = useState<TVShow>(DEFAULT_TV_SHOW);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPopular, setSearchPopular] = useState('');
  const [searchTracked, setSearchTracked] = useState('');

  const cookies = new Cookies();
  const queryClient = useQueryClient();

  const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  const isLoggedIn = !!loggedInUser.emailAddress
  const location = useLocation();
  const showTVShowDetailsModal = tvShowDetailsToShow && tvShowDetailsToShow.id !== DEFAULT_TV_SHOW.id


  useEffect(() => {
    //If user is not logged in and trying to get tracked shows, open login modal
    if(!isLoggedIn && currentPage === PAGE_NAME_TRACKED_TV_SHOWS){
      setShowLoginModal(true)
    }
  }, [currentPage, isLoggedIn, location.pathname]); 

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
        throw (error.response?.data || error.message)
      } else {
        console.error('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  const loginUser = async (emailAddress: string, password: string) => {

    try {
      const { data } = await axios.post<LoginResponse>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/Login`,
        { emailAddress, password }
      );
      return data;
    } catch (error) {
      throw error
    }
  }

  const logoutUser = () => {
    // Delete jwt token
    cookies.remove(JWT_TOKEN_KEY)
    setLoggedInUser(DEFAULT_USER)
    queryClient.resetQueries(['tracked'], {exact: false})
    //Cancel because on logout query seems to want to refetch 4 times
    queryClient.cancelQueries(['tracked'], {exact: false})
    setCurrentPage(PAGE_NAME_SEARCH)
  }

  const addTrackedTVShow = async (tvShow: TVShow) => {
    console.log(`Adding: ${tvShow.id}`)

    await updateTrackedTvShows(tvShow, false)
  }

  const updateWantsNotifications = async (newSetting: boolean) => {
    await axios.post<any>(
      `${TV_SHOW_TRACKER_API_BASE_URL}/UpdateUser`,
      { token: cookies.get(JWT_TOKEN_KEY), updateObject: { wantsEmailNotifications: newSetting } }
    );
    setLoggedInUser((prevUser: User) => {
      return {...prevUser, wantsEmailNotifications: newSetting}
    })
  }

  const removeTrackedTVShow = async (tvShow: TVShow) => {
    console.log(`Removing: ${tvShow.id}`)
    await updateTrackedTvShows(tvShow, true)
  }

  const updateTrackedTvShows = async (tvShow: TVShow, toRemove: boolean) => {
    try {
      const trackedTVShows = queryClient.getQueryData(['tracked'], {exact: false}) as TVShow[] || undefined
      if(!trackedTVShows){
        return;
      }
      let newTrackedTvShowsList = [];
      if (toRemove) {
        newTrackedTvShowsList = trackedTVShows.filter((trackedTVShow) => trackedTVShow.id !== tvShow.id)
      } else {
        // TODO: Prevent duplicates
        newTrackedTvShowsList = trackedTVShows.concat(tvShow)
      }

      const { status } = await axios.post<any>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/UpdateUser`,
        { token: cookies.get(JWT_TOKEN_KEY), updateObject: { trackedTVShows: newTrackedTvShowsList } }
      );
      queryClient.invalidateQueries(['tracked'])
      console.log('response status is: ', status);
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

  const AppView = () => {
    const isTrackedList = currentPage === PAGE_NAME_TRACKED_TV_SHOWS
    return (
      <div className={darkMode ? 'dark bg-gray-800 w-full h-screen text-white' : ''}>
        <NavBar
          currentPage={isTrackedList ? PAGE_NAME_TRACKED_TV_SHOWS : PAGE_NAME_SEARCH}
          darkMode={darkMode}
          isLoggedIn={isLoggedIn}
          emailAddress={loggedInUser.emailAddress}
          wantsNotifications={loggedInUser.wantsEmailNotifications}
          setWantsNotifications={updateWantsNotifications}
          setShowLoginModal={setShowLoginModal}
          setShowCreateAccountModal={setShowCreateAccountModal}
          logout={logoutUser}
          setDarkMode={setDarkMode}
          setCurrentPage={setCurrentPage} />
        {!isLoggedIn && <div className='container mx-auto text-center py-5'>
          <div className='text-4xl pb-5'>Welcome to TVTracker</div>
          <div className='text-lg'>Add shows to your list and get email notifications when episodes air!</div>
          <div className='text-lg'><button onClick={() => setShowCreateAccountModal(true)} className='underline'>Create an account</button> or <button onClick={() => setShowLoginModal(true)} className='underline'>Login</button> to get started</div>
        </div>}
        <SearchBar search={isTrackedList ? () => setSearchTracked(searchTerm) : () => setSearchPopular(searchTerm)} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        <TVShowsListView
          isTrackedList={isTrackedList}
          setShowDetails={setTVShowDetailsToShow}
          handleButtonClick={isTrackedList ? removeTrackedTVShow : addTrackedTVShow}
          isLoggedIn={isLoggedIn}
          searchPopular={searchPopular}
          searchTracked={searchTracked} />
        {showTVShowDetailsModal && <TVShowsDetailsModal tvShow={tvShowDetailsToShow} setTVShow={setTVShowDetailsToShow} updateTrackedTvShows={updateTrackedTvShows} />}
        {showLoginModal && <LoginFormModal setShowLoginModal={setShowLoginModal} loginUser={loginUser} createAccount={openCreateAccountModalFromLogin} setLoggedInUser={setLoggedInUser} />}
        {showCreateAccountModal && <CreateAccountFormModal setShowCreateAccountModal={setShowCreateAccountModal} createUserAccount={createUserAccount} />}
        <div className='border-t dark:border-gray-600'>
          <p className='text-center py-3 text-xs'> Made by Youp Kuiper</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={AppView()} />
        <Route path="/unsubscribe" element={<UnsubscribeEmailModal />} >
          <Route path=":emailAddress/:token" element={<UnsubscribeEmailModal />} />
        </Route>
        <Route path="/resetpassword" element={<ResetPasswordModal />} >
          <Route path=":emailAddress/:token" element={<ResetPasswordModal />} />
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </>
  )
}

export default App;
