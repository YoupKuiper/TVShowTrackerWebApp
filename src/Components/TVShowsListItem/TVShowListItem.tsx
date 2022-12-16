import { PlusIcon } from '@heroicons/react/solid'
import { XIcon } from '@heroicons/react/solid'
import { TVShow } from '../../validators';
import { useState } from 'react';
import { IMAGES_BASE_URL, IMAGE_DEFAULT_SIZE } from '../../constants'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface TvShowsListItemProps {
  tvShow: TVShow;
  isTrackedListItem: boolean;
  shouldShowButton: boolean;
  setShowDetails: (TVShow: TVShow) => void;
  handleButtonClick: (tvShow: TVShow) => void;
}

export const TVShowListItem = ({ tvShow, isTrackedListItem, shouldShowButton, setShowDetails, handleButtonClick }: TvShowsListItemProps) => {

  const [showSpinner, setShowSpinner] = useState(false)

  const buttonClicked = async (tvShow: TVShow) => {
    setShowSpinner(true)
    await handleButtonClick(tvShow)
    setShowSpinner(false)
  }

  const buttonClass = isTrackedListItem ? `tst-remove-button h-[50px] w-[50px] bg-red-500 hover:opacity-100 text-white font-bold rounded-md absolute top-0 right-0 text-center opacity-70 z-11` :
    `tst-add-button h-[50px] w-[50px] bg-blue-500 hover:opacity-100 text-white font-bold rounded-md absolute top-0 right-0 text-center opacity-70 z-11`;

  return (
    <div key={tvShow.id} className='tst-tvshow'>
      <div className='h-[360px] w-[240px] hover:scale-105 hover:duration-200 relative'>
        <button
          onClick={() => setShowDetails({ ...tvShow, isTrackedListItem })}
          className="h-full w-full aspect-square block absolute top-0 left-0 transition-opacity duration-300 opacity-0 hover:opacity-100 bg-blue-800/75 z-2"
        >
          <h3 className="text-white py-6 px-3 mx-auto text-xl">
            {tvShow.name}
          </h3>
        </button>
        <img className='w-full h-full' src={tvShow.poster_path ? IMAGES_BASE_URL + IMAGE_DEFAULT_SIZE + tvShow.poster_path : "https://via.placeholder.com/400"} alt={tvShow.name} />
        {shouldShowButton && !showSpinner && <button className={buttonClass} onClick={() => buttonClicked(tvShow)} >{isTrackedListItem ? <XIcon /> : <PlusIcon />}</button>}
        {showSpinner && <button disabled type="button" className={buttonClass}>
          <div className="inline-flex justify-center w-full"><LoadingSpinner /></div>
        </button>}
      </div>
    </div>
  );
}
