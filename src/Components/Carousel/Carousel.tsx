import { useState, useRef, useEffect } from 'react';
import { IMAGES_BASE_URL, IMAGE_DEFAULT_SIZE } from '../../constants';
import { TVShow } from '../../validators';


interface CarouselProps {
    tvShows: TVShow[]
    setTVShow: (tvShow: TVShow) => any;
  }
  

const Carousel = ({ tvShows, setTVShow }: CarouselProps) => {
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carousel: any = useRef(null);

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const handleClick = (tvShow: TVShow) => {
    setTVShow(tvShow)
  };

  const isDisabled = (direction: string) => {
    if (direction === 'prev') {
      return currentIndex <= 0;
    }

    if (direction === 'next' && carousel.current !== null) {
      return (
        carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
      );
    }

    return false;
  };

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  useEffect(() => {
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0;
  }, []);

  return (
    <div className="carousel mx-auto max-w-xs sm:max-w-xl md:max-w-2xl">
      
      <div className="relative overflow-hidden">
        <div className="flex justify-between absolute top left w-full h-full">
          <button
            onClick={movePrev}
            className="hover:bg-blue-900/75 text-white w-10 h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-2 p-0 m-0 transition-all ease-in-out duration-300"
            disabled={isDisabled('prev')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-20 -ml-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="sr-only">Prev</span>
          </button>
          <button
            onClick={moveNext}
            className="hover:bg-blue-900/75 text-white w-10 h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
            disabled={isDisabled('next')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-20 -ml-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="sr-only">Next</span>
          </button>
        </div>
        <div
          ref={carousel}
          className="carousel-container relative flex gap-1 overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0"
        >
          {tvShows.map((tvShow: TVShow, index: any) => {
            return (
              <div
                key={index}
                className="carousel-item text-center relative h-72 w-48 snap-start"
              >
                <button
                  onClick={() => handleClick(tvShow)}
                  className="h-full w-full aspect-square block bg-origin-padding bg-left-top bg-cover bg-no-repeat z-0"
                  style={{ backgroundImage: `url(${IMAGES_BASE_URL + IMAGE_DEFAULT_SIZE + tvShow.poster_path || 'https://via.placeholder.com/400'})` }}
                >
                  <img
                    src={IMAGES_BASE_URL + IMAGE_DEFAULT_SIZE + tvShow.poster_path || 'https://via.placeholder.com/400'}
                    alt={tvShow.name}
                    className="w-full aspect-square hidden"
                  />
                </button>
                <button
                  onClick={() => handleClick(tvShow)}
                  className="h-full w-full aspect-square block absolute top-0 left-0 transition-opacity duration-300 opacity-0 hover:opacity-100 bg-blue-800/75 z-2"
                >
                  <h3 className="text-white py-6 px-3 mx-auto text-xl">
                    {tvShow.name}
                  </h3>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Carousel;