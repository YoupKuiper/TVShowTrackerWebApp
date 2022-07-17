import React from 'react'
import { IMAGES_BASE_URL, IMAGE_DEFAULT_SIZE } from '../../constants'
import './TvShowListItem.css'

export const TvShowListItem = ({tvShow: { id, name, poster_path, first_air_date }}) => {

    return (
        <div className="tvShow" key={id}>
          <div>
            <p>{first_air_date}</p>
          </div>
    
          <div>
            <img src={poster_path ? IMAGES_BASE_URL + IMAGE_DEFAULT_SIZE + poster_path : "https://via.placeholder.com/400"} alt={name} />
          </div>
    
          <div>
            <h3>{name}</h3>
          </div>
        </div>
      );
}