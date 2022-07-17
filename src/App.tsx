import axios from 'axios';
import React, { useEffect, useState } from "react";
import './App.css';
import { TvShowListItem } from "./Components/TvShowsListItem/TvShowListItem";
import { API_BASE_URL } from './constants';
import SearchIcon from './searchIcon.svg';


const App = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [tvShows, setTvShows] = useState([]);

  const searchTvShow = async (title: string) => {
    try {
      const { data, status } = await axios.get<any>(
        `${API_BASE_URL}/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${encodeURIComponent(title)}`
      );
  
      console.log(`Data.results: ${JSON.stringify(data.results, null, 4)}`);
  
      console.log('response status is: ', status);

      setTvShows(data.results)

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error.message);
        return error.message;
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  useEffect(() => {
    searchTvShow('The Wire')
  }, [])

  return (
    <div className="app">
      <h1>TV Show Tracker</h1>

      <div className="search">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for tv shows"
          onKeyPress={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              searchTvShow(ev.target.value);
            }
          }}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchTvShow(searchTerm)}
        />
      </div>

      {tvShows?.length > 0 ? (
        <div className="container">
          {tvShows.map((tvShow) => (
            <TvShowListItem tvShow={tvShow} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No TV shows found</h2>
        </div>
      )}
    </div>
  );
}

export default App;
