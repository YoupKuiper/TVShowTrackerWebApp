import { TvShow } from "../../interfaces";
import { TvShowListItem } from "../TvShowsListItem/TvShowListItem";

interface TvShowsListViewProps {
    tvShows: TvShow[];
    isTrackedList: boolean;
    addTrackedTVShow: (id: number) => any;
    removeTrackedTVShow: (id: number) => any;
}


const TvShowsListView = ({ tvShows, isTrackedList, addTrackedTVShow, removeTrackedTVShow }: TvShowsListViewProps) => {
 return(
    <>
    {tvShows.length > 0 ? (
    <div className="container mx-auto grid grid-cols-5 gap-4 justify-items-center">
        {tvShows.map((tvShow: TvShow) => (
            <TvShowListItem key={tvShow.id} tvShow={tvShow} isTrackedListItem={isTrackedList} handleClick={isTrackedList ? removeTrackedTVShow : addTrackedTVShow}  />
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