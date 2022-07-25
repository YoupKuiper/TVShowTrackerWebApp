import { IMAGES_BASE_URL, IMAGE_DEFAULT_SIZE } from '../../constants'
import { TvShow } from '../../validators';

interface TvShowsListItemProps {
  tvShow: TvShow;
  isTrackedListItem: boolean;
  handleClick: (tvShow: TvShow) => any;
}

export const TVShowListItem = ({ tvShow, isTrackedListItem, handleClick }: TvShowsListItemProps) => {

  const buttonClass = isTrackedListItem ? `h-[50px] w-[300px] bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md` :
  `h-[50px] w-[300px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md`;
  
    return (
        <div key={tvShow.id}>   
          <div className='h-[450px] w-[300px] hover:scale-105 hover:duration-200'>
            <img className='w-full h-full' src={tvShow.poster_path ? IMAGES_BASE_URL + IMAGE_DEFAULT_SIZE + tvShow.poster_path : "https://via.placeholder.com/400"} alt={tvShow.name} />
          </div>
          <button className={buttonClass} onClick={() => handleClick(tvShow)} >{isTrackedListItem ? 'Remove' : 'Add'}</button>
        </div>
      );
}