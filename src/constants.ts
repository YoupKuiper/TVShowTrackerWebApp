export const MOVIEDB_API_BASE_URL = 'https://api.themoviedb.org/3'
// export const TV_SHOW_TRACKER_API_BASE_URL = 'https://mlzikm3ogl.execute-api.eu-west-1.amazonaws.com/prod'
export const TV_SHOW_TRACKER_API_BASE_URL = 'http://localhost:8010/proxy/prod'
export const IMAGES_BASE_URL = 'https://image.tmdb.org/t/p/'
export const IMAGE_DEFAULT_SIZE = 'w300'
export const JWT_TOKEN_KEY = 'jwt-token'
export const DEFAULT_TOKEN = 'no-token'
export const PAGE_NAME_SEARCH = 'Search'
export const PAGE_NAME_TRACKED_TV_SHOWS = 'Tracked Shows List'
export const PAGE_NAME_SETTINGS = 'Settings'
export const DEFAULT_USER = {
    emailAddress: '',
    emailAddressVerified: false,
    settings: {
      wantsEmailNotifications: false,
      trackedTVShows: []
    }
  }
