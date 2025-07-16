import { useQuery } from '@tanstack/react-query';
import { getTrending } from '../api/tmdb';
import Hero from '../components/Hero';
import MediaGrid from '../components/MediaGrid';
import SEO from '../components/SEO';

export default function Home() {
  const { data: trendingMovies, isLoading: isLoadingMovies } = useQuery({
    queryKey: ['trending', 'movie'],
    queryFn: () => getTrending('movie'),
  });

  const { data: trendingTVShows, isLoading: isLoadingTVShows } = useQuery({
    queryKey: ['trending', 'tv'],
    queryFn: () => getTrending('tv'),
  });

  const randomMovie = trendingMovies ? trendingMovies[Math.floor(Math.random() * Math.min(trendingMovies.length, 20))] : null;

  return (
    <>
      <SEO />
      <div>
        {isLoadingMovies || !randomMovie ? (
          <div>Loading Hero...</div>
        ) : (
          <Hero media={randomMovie} type="movie" />
        )}
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
          {isLoadingMovies ? (
            <div>Loading movies...</div>
          ) : (
            <MediaGrid items={trendingMovies.slice(0, 10)} type="movie" />
          )}
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Trending TV Shows</h2>
          {isLoadingTVShows ? (
            <div>Loading TV shows...</div>
          ) : (
            <MediaGrid items={trendingTVShows.slice(0, 10)} type="tv" />
          )}
        </div>
      </div>
    </>
  );
}
