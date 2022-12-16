import axios, { AxiosError } from "axios";
import { useQuery } from '@tanstack/react-query';
import { JWT_TOKEN_KEY } from "../../constants";
import { TVShow } from "../../validators";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { TVShowListItem } from "../TVShowsListItem/TVShowListItem";
import Cookies from "universal-cookie";
import { toast } from 'react-toastify';

export interface TvShowsListViewProps {
    isTrackedList: boolean;
    isLoggedIn: boolean;
    setShowDetails: (tvShow: TVShow) => void;
    handleButtonClick: (tvShow: TVShow) => void;
    setSearchPopular: (title: string) => void;
    searchPopular: string;
    searchTracked: string;
    logoutUser: () => Promise<void>;
}

const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const getPopularTVShows = async (title: string = ''): Promise<TVShow[]> => {
    // If title is empty, all popular shows will be fetched
    try {
        const { data } = await axios.post<TVShow[]>(
            `${TV_SHOW_TRACKER_API_BASE_URL}/SearchTVShows`,
            { searchString: title }
        );

        return data;
    } catch (error) {
        throw error
    }
}

export const getTrackedTVShows = async (searchString: string): Promise<TVShow[]> => {
    try {
        const cookies = new Cookies()
        const { data } = await axios.post<TVShow[]>(
            `${TV_SHOW_TRACKER_API_BASE_URL}/GetTrackedTVShows`,
            { token: cookies.get(JWT_TOKEN_KEY), searchString }
        );

        return data;
    } catch (error) {
        throw error
    }
}

export const isAlreadyInTrackedList = (tvShow: TVShow, trackedTVShows: TVShow[]) => {
    if (trackedTVShows) {
        return trackedTVShows.some((trackedShow) => trackedShow.id === tvShow.id)
    }
    return false
}

export const shouldButtonBeShown = (isLoggedIn: boolean, isTrackedList: boolean, trackedTVShows: TVShow[], tvShow: TVShow): boolean => {
    if (!isLoggedIn) return false

    if (isTrackedList) return true;

    if (!trackedTVShows) return true;

    return !isAlreadyInTrackedList(tvShow, trackedTVShows)
}

const TVShowsListView = ({ isTrackedList, setShowDetails, isLoggedIn, handleButtonClick, searchPopular, searchTracked, setSearchPopular, logoutUser }: TvShowsListViewProps) => {

    const queryPopularTVShows = useQuery(['popular', searchPopular], () => getPopularTVShows(searchPopular), {
        enabled: !isTrackedList, staleTime: 60000, onError: (error) => {
            toast.error('Failed to get popular TV Shows, please retry later', {
                position: "top-center",
                theme: "light",
            });
        }
    })
    const queryTrackedTVShows = useQuery(['tracked', searchTracked], () => getTrackedTVShows(searchTracked), {
        enabled: isLoggedIn, staleTime: 60000, onError: async (error: AxiosError) => {
            if(error?.response?.status === 400){
                await logoutUser()
                toast.error('Token expired, please log in again.', {
                    position: "top-center",
                    theme: "light",
                });
            }else{
                toast.error('Failed to get tracked TV Shows, please retry later', {
                    position: "top-center",
                    theme: "light",
                });
            }
        }
    })

    const renderListViewWithData = (listOfTVShows: TVShow[], isLoggedIn: boolean, isTrackedList: boolean) => {
        return (
            <div className="min-h-full">
                {listOfTVShows.length > 0 ? (
                    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-items-center dark:bg-gray-800 pb-5">
                        {listOfTVShows.map((tvShow: TVShow) => {
                            const shouldShowButton = shouldButtonBeShown(isLoggedIn, isTrackedList, queryTrackedTVShows.data || [], tvShow)
                            return (
                                <TVShowListItem
                                    key={tvShow.id}
                                    tvShow={tvShow}
                                    isTrackedListItem={isAlreadyInTrackedList(tvShow, queryTrackedTVShows.data || [])}
                                    shouldShowButton={shouldShowButton}
                                    setShowDetails={setShowDetails}
                                    handleButtonClick={handleButtonClick} />
                            )
                        })}
                    </div>
                ) : (
                    <div className="container mx-auto content-center dark:text-white">
                        <h2>No TV shows found. {!isTrackedList && <button onClick={() => setSearchPopular('')} className='underline'>Show popular TV Shows</button>}</h2>
                    </div>
                )}
            </div>
        )
    }

    if (isTrackedList) {
        if (queryTrackedTVShows.isLoading && queryTrackedTVShows.isFetching) return (<div className="inline-flex justify-center w-full min-h-full">
            <LoadingSpinner />
        </div>)
        if (queryTrackedTVShows.isSuccess) {
            return renderListViewWithData(queryTrackedTVShows.data, isLoggedIn, isTrackedList)
        }
    } else {
        if (queryPopularTVShows.isLoading) return (<div className="inline-flex justify-center w-full min-h-full"><LoadingSpinner /></div>)
        if (queryPopularTVShows.isSuccess) {
            return renderListViewWithData(queryPopularTVShows.data, isLoggedIn, isTrackedList)
        }
    }


    return (<div />)
}

export default TVShowsListView;