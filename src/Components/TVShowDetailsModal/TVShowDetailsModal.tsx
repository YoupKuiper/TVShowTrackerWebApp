import React from "react"
import { DEFAULT_TV_SHOW, IMAGES_BASE_URL, IMAGE_DEFAULT_SIZE } from "../../constants";
import { TVShow } from "../../validators";

interface showTVShowDetailsModalProps {
    tvShow: TVShow
    setTVShow: (tvShow: TVShow) => any;
    darkMode: boolean
}

export const TVShowsDetailsModal = ({ tvShow, setTVShow, darkMode }: showTVShowDetailsModalProps) => {

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
                    <div className="inline-block mr-1 align-middle">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 7.91677H12.4167L10 0.416763L7.58333 7.91677H0L6.18335 12.3168L3.81668 19.5834L10 15.0834L16.1834 19.5834L13.8167 12.3168L20 7.91677Z" fill="#FFCB00"></path>
                        </svg>
                    </div>)
            } else {
                elements.push(
                    <div className={darkMode ? "inline-block text-gray-200 align-middle": 'inline-block text-gray-500 align-middle'}>
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
        flex justify-center items-center">
        <div className="bg-white relative max-w-3xl w-full h-full sm:h-auto space-y-8 p-10 sm:rounded-md overflow-auto dark:bg-gray-700 dark:text-white">
            <div className="justify-between items-start rounded-t border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white inline-block">
                    {tvShow.name}
                </h3>
                <button id='closebutton' type="button" onClick={handleOnClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-block float-right items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                    <svg aria-hidden="true" className="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only pointer-events-none">Close modal</span>
                </button>
                <div className="block">
                    <div className="inline-block">
                        {renderStars(tvShow.vote_average)}
                    </div>
                    <div className="text-sm inline-block pl-1">{tvShow.vote_average/2}</div>
                    <div className={darkMode ? "text-sm text-gray-300 inline-block" : "text-sm text-gray-500 inline-block"}>/5</div>
                    <div className={darkMode ? "text-sm text-gray-300 inline-block pl-1" : "text-sm text-gray-500 inline-block pl-1"}>({formatter.format(tvShow.vote_count)} reviews)</div>
                </div>

            </div>

            <div className='h-[360px] w-[240px] relative'>
                <img className='w-full h-full' src={tvShow.poster_path ? IMAGES_BASE_URL + IMAGE_DEFAULT_SIZE + tvShow.poster_path : "https://via.placeholder.com/400"} alt={tvShow.name} />
            </div>
            <div>
                <h1 className='font-bold'>Overview</h1>
                <div className="pt-4">{tvShow.overview}</div>
            </div>
        </div>
    </div>
)
}
