import { IMAGES_BASE_URL, IMAGE_DEFAULT_SIZE } from '../../constants'
import { PlusIcon } from '@heroicons/react/solid'
import { XIcon } from '@heroicons/react/solid'
import { TvShow } from '../../validators';

interface TvShowsListItemProps {
  tvShow: TvShow;
  isTrackedListItem: boolean;
  shouldShowButton: boolean;
  handleClick: (tvShow: TvShow) => any;
}

export const TVShowListItem = ({ tvShow, isTrackedListItem, shouldShowButton, handleClick }: TvShowsListItemProps) => {
  const buttonClass = isTrackedListItem ? `h-[50px] w-[50px] bg-red-500 hover:opacity-100 text-white font-bold rounded-md absolute top-0 right-0 text-center opacity-70` :
  `h-[50px] w-[50px] bg-blue-500 hover:opacity-100 text-white font-bold rounded-md absolute top-0 right-0 text-center opacity-70`;
  
    return (
        <div key={tvShow.id}>   
          <div className='h-[450px] w-[300px] hover:scale-105 hover:duration-200 relative'>
            <img className='w-full h-full' src={tvShow.poster_path ? IMAGES_BASE_URL + IMAGE_DEFAULT_SIZE + tvShow.poster_path : "https://via.placeholder.com/400"} alt={tvShow.name} />
            {shouldShowButton && <button className={buttonClass} onClick={() => handleClick(tvShow)} >{isTrackedListItem ? <XIcon/> : <PlusIcon/>}</button>}
          </div>
        </div>
      );
}