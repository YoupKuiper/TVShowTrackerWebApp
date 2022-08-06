import React from "react"
import { DEFAULT_TV_SHOW, IMAGES_BASE_URL, IMAGE_DEFAULT_SIZE } from "../../constants";
import { TVShow } from "../../validators";

interface showTVShowDetailsModalProps {
    tvShow: TVShow
    setTVShow: (tvShow: TVShow) => any;
}

export const TVShowsDetailsModal = ({ tvShow, setTVShow }: showTVShowDetailsModalProps) => {

    const handleOnClose = (event: any) => {
        // Only close when background is clicked
        if (event.target.id === 'container' || event.target.id === 'closebutton') {
            setTVShow(DEFAULT_TV_SHOW)
        }
    }

    return (
        <div id='container' onClick={handleOnClose} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm
        flex justify-center items-center">
            <div className="bg-white relative max-w-3xl w-full h-full sm:h-auto space-y-8 p-10 sm:rounded-md overflow-auto">
                <div className="flex justify-between items-start rounded-t border-b dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {tvShow.name}
                    </h3>
                    <button id='closebutton' type="button" onClick={handleOnClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                        <svg aria-hidden="true" className="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only pointer-events-none">Close modal</span>
                    </button>
                </div>

                <div className='h-[360px] w-[240px] relative'>
                    <img className='w-full h-full' src={tvShow.poster_path ? IMAGES_BASE_URL + IMAGE_DEFAULT_SIZE + tvShow.poster_path : "https://via.placeholder.com/400"} alt={tvShow.name} />
                </div>
                <h1 className='font-bold'>Overview</h1>
                <div>{tvShow.overview}</div>
            </div>
        </div>
    )
}
