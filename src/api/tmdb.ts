import axios from 'axios';
import { MovieDetails, TVShowDetails, Season } from '../types';

const TMDB_API_KEY = '8d6d91941230817f7807d643736e8a49';
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string | null): string | undefined => 
  path ? `https://image.tmdb.org/t/p/original${path}` : undefined;

export const getTrending = async (mediaType: 'movie' | 'tv') => {
  const { data } = await tmdbApi.get(`/trending/${mediaType}/week`);
  return data.results;
};

export const getByGenre = async (mediaType: 'movie' | 'tv', genreId: number) => {
  const { data } = await tmdbApi.get(`/discover/${mediaType}`, {
    params: {
      with_genres: genreId,
    },
  });
  return data.results;
};

export const getGenres = async (mediaType: 'movie' | 'tv') => {
  const { data } = await tmdbApi.get(`/genre/${mediaType}/list`);
  return data.genres;
};

export const getDetails = async (mediaType: 'movie' | 'tv', id: string): Promise<MovieDetails | TVShowDetails> => {
  const { data } = await tmdbApi.get(`/${mediaType}/${id}`, {
    params: {
      append_to_response: 'videos,credits',
    },
  });
  return data;
};

export const getSeasonDetails = async (tvId: string, seasonNumber: number): Promise<Season> => {
  const { data } = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
  return data;
};

export const searchMedia = async (query: string) => {
  if (!query) return { movies: [], tvShows: [] };
  
  const [moviesResponse, tvResponse] = await Promise.all([
    tmdbApi.get('/search/movie', { params: { query } }),
    tmdbApi.get('/search/tv', { params: { query } })
  ]);

  return {
    movies: moviesResponse.data.results,
    tvShows: tvResponse.data.results
  };
};