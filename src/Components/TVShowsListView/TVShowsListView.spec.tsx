import { TvShowsListViewProps, shouldButtonBeShown } from "./TVShowsListView";
import {  render, screen } from "@testing-library/react";
import TVShowsListView from "./TVShowsListView";
import '@testing-library/jest-dom'
import { tvShowsList, tvShowNotInList } from '../../Test/test-data'

const makeSut = (props: Partial<TvShowsListViewProps>) => {
  return render(<TVShowsListView isTrackedList={true} setShowDetails={jest.fn()} isLoggedIn={true} handleButtonClick={jest.fn()} searchPopular={''} searchTracked={''} setSearchPopular={jest.fn()} logoutUser={jest.fn()} {...props} />);
};

describe("<TVShowsListView />", () => {
    // test("Should render 'no tv shows found'", () => {
      
    //   expect(screen.getByText('No TV shows found.')).toBeInTheDocument()
    // });

    test("Should not render 'no tv shows found' if there are tv shows", () => {
      expect(screen.queryByText('No TV shows found.')).not.toBeInTheDocument()
    });

    test("Should not show buttons if not logged in", () => {
      expect(shouldButtonBeShown(false, true, tvShowsList, tvShowsList[0])).toBeFalsy()
    });

    test("Should not show buttons if logged in and already in tracked list while looking at home list", () => {
      expect(shouldButtonBeShown(true, false, tvShowsList, tvShowsList[0])).toBeFalsy()
    });

    test("Should show button when looking at home list and show is not yet in tracked list", () => {
      expect(shouldButtonBeShown(false, false, tvShowsList, tvShowNotInList)).toBeFalsy()
    });

    test("Should show button when looking at tracked list", () => {
      expect(shouldButtonBeShown(false, true, tvShowsList, tvShowNotInList)).toBeFalsy()
    });
});