import axios from "axios";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { DEFAULT_TV_SHOW, IMAGES_BASE_URL, IMAGE_DEFAULT_SIZE } from "../../constants";
import { TVShow } from "../../validators";
import Carousel from "../Carousel/Carousel";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { isAlreadyInTrackedList } from '../TVShowsListView/TVShowsListView'

interface showTVShowDetailsModalProps {
    tvShow: TVShow
    setTVShow: (tvShow: TVShow) => any;
    updateTrackedTvShows: (tvShow: TVShow, shouldRemove: boolean) => any;
    trackedTVShows: TVShow[];
}

export const TVShowsDetailsModal = ({ tvShow, setTVShow, trackedTVShows, updateTrackedTvShows }: showTVShowDetailsModalProps) => {
    let params = useParams();
    const [showSpinner, setShowSpinner] = useState(false)
    const [showButtonSpinner, setShowButtonSpinner] = useState(false)
    const isTrackedListItem = isAlreadyInTrackedList(tvShow, trackedTVShows)

    const buttonClicked = async (tvShow: TVShow) => {
        setShowButtonSpinner(true)
        await updateTrackedTvShows(tvShow, isTrackedListItem)
        setShowButtonSpinner(false)
    }

    const buttonClass = isTrackedListItem ? `h-[50px] w-40 bg-red-500 hover:opacity-100 text-white font-bold rounded-md text-center opacity-70 z-11 float-left` :
        `h-[50px] w-40 bg-blue-500 hover:opacity-100 text-white font-bold rounded-md text-center opacity-70 z-11 float-left`;

    const buttonText = isTrackedListItem ? 'Remove from list' : 'Add to list'
    const getTVShowDetails = async () => {
        try {
            let id: number = tvShow.id
            // Maybe can implement routing here
            if (tvShow.id === DEFAULT_TV_SHOW.id) {
                id = parseInt(params.tvShowId!)
            }
            const { data } = await axios.post<any>(
                `${process.env.REACT_APP_API_BASE_URL}/SearchTVShows`,
                { getDetails: true, tvShowsIds: [id] }
            );

            setTVShow(data[0])
        } catch (error) {
            console.log('no tv show found for this id')
        }
    }

    useEffect(() => {
        try {
            setShowSpinner(true)
            const fetchTVShowDetails = async () => {
                await getTVShowDetails();
                setShowSpinner(false)
            }
            fetchTVShowDetails();
        } catch (error) {
            console.log(error)
            setShowSpinner(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tvShow.id]);


    const handleOnClose = (event: any) => {
        // Only close when background is clicked
        if (event.target.id === 'container' || event.target.id === 'closebutton') {
            setTVShow(DEFAULT_TV_SHOW)
        }
    }

    const renderStars = (voteAverageOnScaleToTen: number) => {
        const votesOnScaleToFive = voteAverageOnScaleToTen / 2;
        const votesRounded = Math.round(votesOnScaleToFive)
        const elements = [];
        for (let i = 0; i < 5; i++) {
            if (i < votesRounded) {
                elements.push(
                    <div key={i} className="inline-block mr-1 align-middle">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 7.91677H12.4167L10 0.416763L7.58333 7.91677H0L6.18335 12.3168L3.81668 19.5834L10 15.0834L16.1834 19.5834L13.8167 12.3168L20 7.91677Z" fill="#FFCB00"></path>
                        </svg>
                    </div>)
            } else {
                elements.push(
                    <div key={i} className="inline-block dark:text-gray-200 text-gray-500  align-middle">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 7.91677H12.4167L10 0.416763L7.58333 7.91677H0L6.18335 12.3168L3.81668 19.5834L10 15.0834L16.1834 19.5834L13.8167 12.3168L20 7.91677Z" fill="currentColor"></path>
                        </svg>
                    </div>
                )
            }
        }
        return elements
    }

    const formatter = Intl.NumberFormat('en', { notation: 'compact' });

    return (
        <div id='container' onClick={handleOnClose} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm
        flex justify-center overflow-y-scroll">
            <div className="bg-white grid max-w-3xl w-full h-full sm:h-auto space-y-8 p-8 sm:rounded-md overflow-auto dark:bg-gray-700 dark:text-white">
                <div className="h-fit rounded-t border-b dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white inline-block">
                        {tvShow.name}
                    </h3>
                    <button id='closebutton' type="button" onClick={handleOnClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-block float-right items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                        <svg id='closebutton' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path id='closebutton' strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="sr-only pointer-events-none">Close modal</span>
                    </button>
                    <div className="block pb-2">
                        <div className="inline-block">
                            {renderStars(tvShow.vote_average)}
                        </div>
                        <div className="text-sm inline-block pl-1">{tvShow.vote_average / 2}</div>
                        <div className="text-sm dark:text-gray-300 text-gray-500 inline-block">/5</div>
                        <div className="text-sm dark:text-gray-300 text-gray-500 inline-block pl-1">({formatter.format(tvShow.vote_count)} reviews)</div>
                    </div>

                </div>

                <div className='w-full h-full'>
                    <div className="min-h-[360px] min-w-[240px] w-full md:w-6/12 float-left pr-4 flex-none">
                        <img className='' src={tvShow.poster_path ? IMAGES_BASE_URL + IMAGE_DEFAULT_SIZE + tvShow.poster_path : "https://via.placeholder.com/400"} alt={tvShow.name} />
                    </div>
                    <div className="w-full md:w-6/12 pt-8 md:py-0 flex-none float-left grid">
                        {!showButtonSpinner && <button type="button" className={buttonClass} onClick={() => buttonClicked(tvShow)} > {buttonText}</button>}
                        {showButtonSpinner && <button disabled type="button" className={buttonClass}>
                            <svg role="status" className="inline w-8 h-8 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                        </button>}
                        {showSpinner && <LoadingSpinner />}
                        {tvShow.number_of_episodes && <div>
                            <div>
                                <p>Network: {<img className="inline" src={tvShow.networks ? IMAGES_BASE_URL + IMAGE_DEFAULT_SIZE + tvShow.networks[0].logo_path : ''} alt={tvShow.name} width={40} />}</p>
                                <p>Total Episodes: {tvShow.number_of_episodes ? tvShow.number_of_episodes : ''}</p>
                                <p>Seasons: {tvShow.number_of_seasons ? tvShow.number_of_seasons : ''}</p>
                                <p>Episode duration: {tvShow.episode_run_time && tvShow.episode_run_time.length ? tvShow.episode_run_time[0].toString() + ' minutes' : 'N/A'}</p>
                                <p>Next episode:  {tvShow.next_episode_to_air ? tvShow.next_episode_to_air.air_date : 'N/A'}</p>
                            </div>
                        </div>}
                    </div>
                </div>
                <div>
                    <h1 className='font-bold'>Overview</h1>
                    <div className="pt-4">{tvShow.overview}</div>
                </div>
                {tvShow.recommendations ? <div>
                    <p>Recommended shows: </p>
                    <Carousel tvShows={tvShow.recommendations.results} setTVShow={setTVShow} />
                </div> :
                    <LoadingSpinner />}
            </div>
        </div >
    )
}
