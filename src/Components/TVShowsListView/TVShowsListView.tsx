import { TvShow } from "../../validators";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { TVShowListItem } from "../TVShowsListItem/TVShowListItem";

interface TvShowsListViewProps {
    tvShows: TvShow[];
    trackedTVShows: TvShow[];
    isTrackedList: boolean;
    showSpinner: boolean;
    isLoggedIn: boolean;
    handleClick: (tvShow: TvShow) => any;
}

const isAlreadyInTrackedList = (tvShow: TvShow, trackedTVShows: TvShow[]) => {
    return trackedTVShows.some((trackedShow) => trackedShow.id === tvShow.id)
}

const shouldButtonBeShown = (isLoggedIn: boolean, isTrackedList: boolean, trackedTVShows: TvShow[], tvShow: TvShow): boolean => {
    if(!isLoggedIn) return false

    if(isTrackedList) return true;

    if(!trackedTVShows) return true;

    return !isAlreadyInTrackedList(tvShow, trackedTVShows)
}

const TVShowsListView = ({ tvShows, trackedTVShows, isTrackedList, showSpinner, isLoggedIn, handleClick }: TvShowsListViewProps) => {
    const tvShowsToShow = isTrackedList ? trackedTVShows : tvShows
 return(
    <>
    {showSpinner ? (<LoadingSpinner/>) : tvShowsToShow.length > 0 ? (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-items-center">
        {tvShowsToShow.map((tvShow: TvShow) => {
            const shouldShowButton = shouldButtonBeShown(isLoggedIn, isTrackedList, trackedTVShows, tvShow)
            return (
            <TVShowListItem 
                key={tvShow.id} 
                tvShow={tvShow} 
                isTrackedListItem={isTrackedList} 
                shouldShowButton={shouldShowButton}
                handleClick={handleClick} />
        )})}
    </div>
    ) : (
    <div className="container mx-auto content-center">
        <h2>No TV shows found</h2>
    </div>
    )}
    </>
 )
}

export default TVShowsListView;