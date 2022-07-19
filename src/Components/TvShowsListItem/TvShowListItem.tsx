import { IMAGES_BASE_URL, IMAGE_DEFAULT_SIZE } from '../../constants'
import { TvShow } from '../../interfaces';

export const TvShowListItem = (tvShow: TvShow) => {

    return (
        <div key={tvShow.id}>   
          <div className='h-[450px] w-[300px] hover:scale-105 hover:duration-200'>
            <img className='w-full h-full' src={tvShow.poster_path ? IMAGES_BASE_URL + IMAGE_DEFAULT_SIZE + tvShow.poster_path : "https://via.placeholder.com/400"} alt={tvShow.name} />
          </div>
        </div>
      );
}