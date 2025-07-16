import { useQuery } from '@tanstack/react-query';
import { getTrending } from '../api/tmdb';
import Hero from '../components/Hero';
import MediaGrid from '../components/MediaGrid';
import SEO from '../components/SEO';

export default function Home() {
  const { data: trendingMovies } = useQuery({
    queryKey: ['trending', 'movie'],
    queryFn: () => getTrending('movie'),
  });

  const { data: trendingTVShows } = useQuery({
    queryKey: ['trending', 'tv'],
    queryFn: () => getTrending('tv'),
  });

  if (!trendingMovies || !trendingTVShows) return null;

  const randomMovieIndex = Math.floor(Math.random() * Math.min(trendingMovies.length, 20));
  const randomMovie = trendingMovies[randomMovieIndex];

  return (
    <>
      <SEO />
      <div>
        <Hero media={randomMovie} type="movie" />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
          <MediaGrid items={trendingMovies.slice(0, 10)} type="movie" />
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Trending TV Shows</h2>
          <MediaGrid items={trendingTVShows.slice(0, 10)} type="tv" />
        </div>
      </div>
    </>
  );
}
