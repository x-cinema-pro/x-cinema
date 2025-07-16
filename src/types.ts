export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  first_air_date: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  air_date: string;
  runtime: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  season_number: number;
  episodes: Episode[];
}

interface BaseDetails {
  id: number;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  genres: Genre[];
  videos: {
    results: Video[];
  };
  credits: {
    cast: Cast[];
  };
}

export interface MovieDetails extends BaseDetails {
  title: string;
  release_date: string;
  runtime: number;
}

export interface TVShowDetails extends BaseDetails {
  name: string;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: Season[];
}

export interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  added_date: string;
}