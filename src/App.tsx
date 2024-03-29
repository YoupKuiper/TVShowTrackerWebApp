import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "universal-cookie";
import CreateAccountFormModal from "./Components/CreateAccountFormModal/CreateAccountFormModal";
import LoginFormModal from "./Components/LoginFormModal/LoginFormModal";
import { NavBar } from "./Components/NavBar/NavBar";
import PrivacyPolicy from "./Components/PrivacyPolicy/PrivacyPolicy";
import ResetPasswordModal from "./Components/ResetPasswordModal/ResetPasswordModal";
import SearchBar from "./Components/SearchBar/SearchBar";
import { TVShowsDetailsModal } from "./Components/TVShowDetailsModal/TVShowDetailsModal";
import TVShowsListView, { getTrackedTVShows } from "./Components/TVShowsListView/TVShowsListView";
import UnsubscribeEmailModal from "./Components/UnsubscribeEmailModal/UnsubscribeEmailModal";
import VerifyEmailAddressView from "./Components/VerifyEmailAddressView/VerifyEmailAddressView";
import {
	CURRENT_PAGE_KEY,
	DARK_MODE_KEY,
	DEFAULT_TV_SHOW,
	DEFAULT_USER,
	JWT_TOKEN_KEY,
	PAGE_NAME_SEARCH,
	PAGE_NAME_TRACKED_TV_SHOWS,
	USER_KEY,
} from "./constants";
import { useStickyState } from "./hooks";
import { LoginResponse, TVShow, UpdateUserResponse, User } from "./validators";

const App = () => {
	const [darkMode, setDarkMode] = useStickyState(true, DARK_MODE_KEY);
	const [loggedInUser, setLoggedInUser] = useStickyState(DEFAULT_USER, USER_KEY);
	const [currentPage, setCurrentPage] = useStickyState(PAGE_NAME_SEARCH, CURRENT_PAGE_KEY);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
	const [tvShowDetailsToShow, setTVShowDetailsToShow] = useState<TVShow>(DEFAULT_TV_SHOW);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchPopular, setSearchPopular] = useState("");
	const [searchTracked, setSearchTracked] = useState("");

	const cookies = new Cookies();
	const queryClient = useQueryClient();

	const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
	const isLoggedIn = !!cookies.get(JWT_TOKEN_KEY);
	const location = useLocation();
	const showTVShowDetailsModal = tvShowDetailsToShow && tvShowDetailsToShow.id !== DEFAULT_TV_SHOW.id;
	useQuery(["tracked", searchTracked], () => getTrackedTVShows(searchTracked), {
		enabled: isLoggedIn,
		staleTime: 60000,
	});

	useEffect(() => {
		//If user is not logged in and trying to get tracked shows, open login modal
		if (!isLoggedIn && currentPage === PAGE_NAME_TRACKED_TV_SHOWS) {
			setShowLoginModal(true);
		}
	}, [currentPage, isLoggedIn, location.pathname]);

	const createUserAccount = async (emailAddress: string, password: string) => {
		try {
			const { status } = await axios.post<AxiosResponse>(`${TV_SHOW_TRACKER_API_BASE_URL}/CreateAccount`, {
				emailAddress,
				password,
			});

			console.log("response status is: ", status);
		} catch (error) {
			throw error;
		}
	};

	const loginUser = async (emailAddress: string, password: string) => {
		try {
			const { data } = await axios.post<LoginResponse>(`${TV_SHOW_TRACKER_API_BASE_URL}/Login`, {
				emailAddress,
				password,
			});

			cookies.set(JWT_TOKEN_KEY, data.token);
			queryClient.invalidateQueries(["tracked"]);
			setLoggedInUser({
				emailAddress: data.emailAddress,
				wantsEmailNotifications: data.wantsEmailNotifications,
				wantsMobileNotifications: data.wantsMobileNotifications,
			});
			setShowLoginModal(false);
			setCurrentPage(PAGE_NAME_TRACKED_TV_SHOWS);
			return data;
		} catch (error) {
			throw error;
		}
	};

	const logoutUser = async (): Promise<void> => {
		// Delete jwt token
		cookies.remove(JWT_TOKEN_KEY);
		setLoggedInUser(DEFAULT_USER);
		queryClient.resetQueries(["tracked"], { exact: false });
		//Cancel because on logout query seems to want to refetch 4 times
		queryClient.cancelQueries(["tracked"], { exact: false });
		setCurrentPage(PAGE_NAME_SEARCH);
	};

	const addTrackedTVShow = async (tvShow: TVShow) => {
		console.log(`Adding: ${tvShow.id}`);

		await updateTrackedTvShows(tvShow, false);
	};

	const updateWantsNotifications = async (newSetting: boolean) => {
		try {
			await axios.post<AxiosResponse>(`${TV_SHOW_TRACKER_API_BASE_URL}/UpdateUser`, {
				token: cookies.get(JWT_TOKEN_KEY),
				updateObject: { wantsEmailNotifications: newSetting },
			});
			setLoggedInUser((prevUser: User) => {
				return { ...prevUser, wantsEmailNotifications: newSetting };
			});
		} catch (error) {
			toast.error("Failed to update notification setting", {
				position: "top-center",
				theme: "light",
			});
		}
	};

	const removeTrackedTVShow = async (tvShow: TVShow) => {
		console.log(`Removing: ${tvShow.id}`);
		await updateTrackedTvShows(tvShow, true);
	};

	const updateTrackedTvShows = async (tvShow: TVShow, toRemove: boolean) => {
		try {
			const cachedWatchlistShows = queryClient.getQueryData(["tracked", ""]) as TVShow[];
			if (!cachedWatchlistShows) {
				throw new Error("Please log in first to add shows to your Watchlist");
			}

			let newTrackedTvShowsList = new Set<TVShow>();
			if (toRemove) {
				newTrackedTvShowsList = new Set(
					cachedWatchlistShows.filter((trackedTVShow) => trackedTVShow.id !== tvShow.id)
				);
			} else {
				newTrackedTvShowsList = new Set(cachedWatchlistShows.concat(tvShow));
			}

			const { status, data } = await axios.post<UpdateUserResponse>(
				`${TV_SHOW_TRACKER_API_BASE_URL}/UpdateUser`,
				{
					token: cookies.get(JWT_TOKEN_KEY),
					updateObject: { trackedTVShows: [...newTrackedTvShowsList] },
				}
			);

			queryClient.setQueryData(["tracked", ""], data.trackedTVShows);
			queryClient.setQueryData(
				["tracked", searchTracked],
				data.trackedTVShows.filter((tvShow) => tvShow.name.includes(searchTracked))
			);

			console.log("response status is: ", status);
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 400) {
					await logoutUser();
					toast.error("Token expired, please log in again.", {
						position: "top-center",
						theme: "light",
					});
				}
			} else {
				toast.error(error.message, {
					position: "top-center",
					theme: "light",
				});
			}
			setShowLoginModal(true);
			throw error;
		}
	};

	const openCreateAccountModalFromLogin = () => {
		setShowLoginModal(false);
		setShowCreateAccountModal(true);
	};

	const AppView = () => {
		const isTrackedList = currentPage === PAGE_NAME_TRACKED_TV_SHOWS;
		return (
			<div className={darkMode ? "tst-main-div dark bg-gray-800 w-full h-screen text-white" : ""}>
				<ToastContainer />
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
					setCurrentPage={setCurrentPage}
				/>
				{!isLoggedIn && (
					<div className="container mx-auto text-center py-5">
						<div className="text-4xl pb-5">Welcome to TVTracker</div>
						<div className="text-lg">
							Add shows to your Watchlist and get email notifications when episodes air!
						</div>
						<div className="text-lg">
							<button onClick={() => setShowCreateAccountModal(true)} className="underline">
								Create an account
							</button>{" "}
							or{" "}
							<button onClick={() => setShowLoginModal(true)} className="underline">
								Login
							</button>{" "}
							to get started
						</div>
					</div>
				)}
				<SearchBar
					search={isTrackedList ? () => setSearchTracked(searchTerm) : () => setSearchPopular(searchTerm)}
					setSearchTerm={setSearchTerm}
					searchTerm={searchTerm}
				/>
				<TVShowsListView
					isTrackedList={isTrackedList}
					setShowDetails={setTVShowDetailsToShow}
					handleButtonClick={isTrackedList ? removeTrackedTVShow : addTrackedTVShow}
					isLoggedIn={isLoggedIn}
					searchPopular={searchPopular}
					searchTracked={searchTracked}
					setSearchPopular={setSearchPopular}
					logoutUser={logoutUser}
				/>
				{showTVShowDetailsModal && (
					<TVShowsDetailsModal
						tvShow={tvShowDetailsToShow}
						setTVShow={setTVShowDetailsToShow}
						updateTrackedTvShows={updateTrackedTvShows}
					/>
				)}
				{showLoginModal && (
					<LoginFormModal
						setShowLoginModal={setShowLoginModal}
						loginUser={loginUser}
						createAccount={openCreateAccountModalFromLogin}
						setLoggedInUser={setLoggedInUser}
					/>
				)}
				{showCreateAccountModal && (
					<CreateAccountFormModal
						setShowCreateAccountModal={setShowCreateAccountModal}
						createUserAccount={createUserAccount}
					/>
				)}
				<div className="border-t dark:border-gray-600">
					<p className="text-center py-3 text-xs"> Made by Youp Kuiper</p>
				</div>
			</div>
		);
	};

	return (
		<>
			<Routes>
				<Route path="/" element={AppView()} />
				<Route path="/:id" element={AppView()} />
				<Route path="/unsubscribe" element={<UnsubscribeEmailModal />}>
					<Route path=":emailAddress/:token" element={<UnsubscribeEmailModal />} />
				</Route>
				<Route path="/resetpassword" element={<ResetPasswordModal />}>
					<Route path=":emailAddress/:token" element={<ResetPasswordModal />} />
				</Route>
				<Route path="/verifyemailaddress" element={<VerifyEmailAddressView />}>
					<Route path=":emailAddress/:token/:mobileRegistration" element={<VerifyEmailAddressView />} />
				</Route>
				<Route path="/privacy-policy" element={<PrivacyPolicy />} />
				<Route
					path="*"
					element={
						<main className={darkMode ? "tst-main-div dark bg-gray-800 w-full h-screen text-white" : ""}>
							<div className="container mx-auto text-center py-5">
								<p>There's nothing here!</p>
								<p>
									Click{" "}
									<a href="/" className="underline">
										here
									</a>{" "}
									to go back to the main page
								</p>
							</div>
						</main>
					}
				/>
			</Routes>
		</>
	);
};

export default App;
