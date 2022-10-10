import axios from 'axios';
import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import CreateAccountFormModal from './Components/CreateAccountFormModal/CreateAccountFormModal';
import LoginFormModal from './Components/LoginFormModal/LoginFormModal';
import { NavBar } from './Components/NavBar/NavBar';
import ResetPasswordModal from './Components/ResetPasswordModal/ResetPasswordModal';
import SearchBar from './Components/SearchBar/SearchBar';
import { TVShowsDetailsModal } from './Components/TVShowDetailsModal/TVShowDetailsModal';
import TVShowsListView from './Components/TVShowsListView/TVShowsListView';
import UnsubscribeEmailModal from './Components/UnsubscribeEmailModal/UnsubscribeEmailModal';
import { DARK_MODE_KEY, DEFAULT_TOKEN, DEFAULT_TV_SHOW, DEFAULT_USER, JWT_TOKEN_KEY, PAGE_NAME_SEARCH, PAGE_NAME_TRACKED_TV_SHOWS, TRACKED_TV_SHOWS_KEY } from './constants';
import { LoginResponse, TVShow, User, UserObject } from './validators';

const getTrackedShowsFromLocalStorage = (): TVShow[] => {
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
  const [wantsEmailNotifications, setWantsEmailNotifications] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [tvShowDetailsToShow, setTVShowDetailsToShow] = useState<TVShow>(DEFAULT_TV_SHOW);
  const [loggedInUser, setLoggedInUser] = useState<User>(DEFAULT_USER);
  const [showSpinner, setShowSpinner] = useState(false)
  const [darkMode, setDarkMode] = useState(getDarkModeStateFromLocalStorage)
  const [searchTerm, setSearchTerm] = useState('');
  const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  const isLoggedIn = !!loggedInUser.emailAddress
  const location = useLocation();
  const navigate = useNavigate();
  const showTVShowDetailsModal = tvShowDetailsToShow && tvShowDetailsToShow.id !== DEFAULT_TV_SHOW.id

  useEffect(() => {
    try {
      const token = localStorage.getItem(JWT_TOKEN_KEY)
      if (token && token !== DEFAULT_TOKEN) {
        const decodedToken: any = decodeToken(token);
        const loggedInUser = UserObject.parse(decodedToken.data);
        setLoggedInUser(loggedInUser);
        setWantsEmailNotifications(loggedInUser.wantsEmailNotifications)
      }

      const fetchTVShows = async () => {
        location.pathname === '/tracked' ? await getTrackedTVShows() : await getPopularTVShows()
      }
      fetchTVShows();

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
      await searchAllTVShows('')
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


  const searchAllTVShows = async (title: string) => {
    const { data } = await axios.post<TVShow[]>(
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
      if (location.pathname === '/') {
        await searchAllTVShows(title)
      } else if (location.pathname === '/tracked') {
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

  const getTrackedTVShows = async () => {
    try {
      setShowSpinner(true)
      const { data } = await axios.post<TVShow[]>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/GetTrackedTVShows`,
        { token: localStorage.getItem(JWT_TOKEN_KEY) }
      );
      console.log(data)
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
        throw(error.response?.data || error.message)
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
    //Navigate to tracked shows page
    setShowLoginModal(false)
    navigate('/tracked')
    await getTrackedTVShows()
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

  const updateWantsNotifications = async (newSetting: boolean) => {
    console.log(`Setting wants notifications to: ${newSetting}`)
    const token = localStorage.getItem(JWT_TOKEN_KEY);
    if (!token) {
      console.error('No token found')
      return;
    }
    const { status } = await axios.post<any>(
      `${TV_SHOW_TRACKER_API_BASE_URL}/UpdateUser`,
      { token, updateObject: { wantsEmailNotifications: newSetting }}
    );
    
    setWantsEmailNotifications(newSetting)
    console.log(`Response status: ${status}`)
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
      const { data: updatedTrackedTVShows } = await axios.post<TVShow[]>(
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
        { token, updateObject: { trackedTVShows: newTrackedTvShowsList } }
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

  const Home = () => {
    const id = useParams();
    console.log(id)
    return (
      <>
        <div className={darkMode ? 'dark bg-gray-800 w-full h-screen text-white' : ''}>
          <NavBar
            currentPage={PAGE_NAME_SEARCH}
            darkMode={darkMode}
            isLoggedIn={isLoggedIn}
            emailAddress={loggedInUser.emailAddress}
            wantsNotifications={wantsEmailNotifications}
            setWantsNotifications={updateWantsNotifications}
            setShowLoginModal={setShowLoginModal}
            setShowCreateAccountModal={setShowCreateAccountModal}
            logout={logoutUser}
            setDarkMode={setDarkMode} />
          {!isLoggedIn && <div className='container mx-auto text-center py-5'>
            <div className='text-4xl pb-5'>Welcome to TVTracker</div>
            <div className='text-lg'>Add shows to your list and get email notifications when episodes air!</div>
            <div className='text-lg'><button onClick={() => setShowCreateAccountModal(true)} className='underline'>Create an account</button> or <button onClick={() => setShowLoginModal(true)} className='underline'>Login</button> to get started</div>
          </div>}
          <SearchBar search={searchTvShow} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
          <TVShowsListView
            isTrackedList={false}
            tvShows={tvShows}
            trackedTVShows={trackedTVShows}
            showSpinner={showSpinner}
            setShowDetails={setTVShowDetailsToShow}
            handleButtonClick={addTrackedTVShow}
            isLoggedIn={isLoggedIn}
            getPopular={getPopularTVShows} />
          {showTVShowDetailsModal && <TVShowsDetailsModal tvShow={tvShowDetailsToShow} setTVShow={setTVShowDetailsToShow} darkMode={darkMode} trackedTVShows={trackedTVShows} updateTrackedTvShows={updateTrackedTvShows} />}
          {showLoginModal && <LoginFormModal setShowLoginModal={setShowLoginModal} loginUser={loginUser} createAccount={openCreateAccountModalFromLogin} />}
          {showCreateAccountModal && <CreateAccountFormModal setShowCreateAccountModal={setShowCreateAccountModal} createUserAccount={createUserAccount} />}
          <div className='border-t dark:border-gray-600'>
            <p className='text-center py-3 text-xs'> Made by Youp Kuiper</p>
          </div>
        </div>
      </>
    );
  }

  const MyTrackedList = () => {
    return (
      <div className={darkMode ? 'dark bg-gray-800 w-full h-screen text-white' : ''}>
        <NavBar
          currentPage={PAGE_NAME_TRACKED_TV_SHOWS}
          darkMode={darkMode}
          isLoggedIn={isLoggedIn}
          emailAddress={loggedInUser.emailAddress}
          wantsNotifications={wantsEmailNotifications}
          setWantsNotifications={updateWantsNotifications}
          setShowLoginModal={setShowLoginModal}
          setShowCreateAccountModal={setShowCreateAccountModal}
          logout={logoutUser}
          setDarkMode={setDarkMode} />
        {!isLoggedIn && <div className='container mx-auto text-center py-5'>
          <div className='text-4xl pb-5'>Welcome to TVTracker</div>
          <div className='text-lg'>Add shows to your list and get email notifications when episodes air!</div>
          <div className='text-lg'><button onClick={() => setShowCreateAccountModal(true)} className='underline'>Create an account</button> or <button onClick={() => setShowLoginModal(true)} className='underline'>Login</button> to get started</div>
        </div>}
        <SearchBar search={searchTvShow} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        <TVShowsListView
          isTrackedList={true}
          tvShows={tvShows}
          trackedTVShows={trackedTVShows}
          showSpinner={showSpinner}
          setShowDetails={setTVShowDetailsToShow}
          handleButtonClick={removeTrackedTVShow}
          isLoggedIn={isLoggedIn}
          getPopular={getPopularTVShows} />
        {showTVShowDetailsModal && <TVShowsDetailsModal tvShow={tvShowDetailsToShow} setTVShow={setTVShowDetailsToShow} darkMode={darkMode} trackedTVShows={trackedTVShows} updateTrackedTvShows={updateTrackedTvShows}/>}
        {showLoginModal && <LoginFormModal setShowLoginModal={setShowLoginModal} loginUser={loginUser} createAccount={openCreateAccountModalFromLogin} />}
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
        <Route path="/" element={Home()} />
        {/* <Route path="/details" element={Home()}>
          <Route path=":tvShowId" element={Home()} />
        </Route> */}
        <Route path="tracked" element={MyTrackedList()} />
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
