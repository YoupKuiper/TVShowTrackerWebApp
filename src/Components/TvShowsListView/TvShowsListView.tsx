import { TvShow } from "../../validators";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { TvShowListItem } from "../TvShowsListItem/TvShowListItem";

interface TvShowsListViewProps {
    tvShows: TvShow[];
    isTrackedList: boolean;
    showSpinner: boolean;
    handleClick: (tvShow: TvShow) => any;
}


const TvShowsListView = ({ tvShows, isTrackedList, showSpinner, handleClick }: TvShowsListViewProps) => {
 return(
    <>
    {showSpinner ? (<LoadingSpinner/>) : tvShows.length > 0 ? (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-4 justify-items-center">
        {tvShows.map((tvShow: TvShow) => (
            <TvShowListItem key={tvShow.id} tvShow={tvShow} isTrackedListItem={isTrackedList} handleClick={handleClick}  />
        ))}
    </div>
    ) : (
    <div className="container mx-auto content-center">
        <h2>No TV shows found</h2>
    </div>
    )}
    </>
 )
}

export default TvShowsListView;