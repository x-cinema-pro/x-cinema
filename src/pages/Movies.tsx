import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getByGenre, getGenres, getTrending } from '../api/tmdb';
import Hero from '../components/Hero';
import MediaGrid from '../components/MediaGrid';

export default function Movies() {
  const [] = useState<number | null>(null);

  const { data: genres } = useQuery({
    queryKey: ['genres', 'movie'],
    queryFn: () => getGenres('movie'),
  });

  const { data: trendingMovies } = useQuery({
    queryKey: ['trending', 'movie'],
    queryFn: () => getTrending('movie'),
  });

  const { data: actionMovies } = useQuery({
    queryKey: ['movies', 'action'],
    queryFn: () => getByGenre('movie', 28),
  });

  const { data: dramaMovies } = useQuery({
    queryKey: ['movies', 'drama'],
    queryFn: () => getByGenre('movie', 18),
  });

  if (!trendingMovies || !genres || !actionMovies || !dramaMovies) return null;
  const randomMovieIndex = Math.floor(Math.random() * Math.min(trendingMovies.length, 20));
  const randomMovie = trendingMovies[randomMovieIndex];
  return (
    <div>
      <Hero media={randomMovie} type="movie" />
      <div className="container mx-auto px-4">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top 10 Today</h2>
          <MediaGrid items={trendingMovies.slice(0, 10)} type="movie" />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Action Movies</h2>
          <MediaGrid items={actionMovies.slice(0, 5)} type="movie" />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Critically Acclaimed Dramas</h2>
          <MediaGrid items={dramaMovies.slice(0, 5)} type="movie" />
        </section>
      </div>
    </div>
  );
}