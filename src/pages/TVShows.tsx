import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getByGenre, getGenres, getTrending } from '../api/tmdb';
import Hero from '../components/Hero';
import MediaGrid from '../components/MediaGrid';


export default function TVShows() {
  const [] = useState<number | null>(null);

  const { data: genres } = useQuery({
    queryKey: ['genres', 'tv'],
    queryFn: () => getGenres('tv'),
  });

  const { data: trendingShows } = useQuery({
    queryKey: ['trending', 'tv'],
    queryFn: () => getTrending('tv'),
  });

  const { data: dramaShows } = useQuery({
    queryKey: ['tv', 'drama'],
    queryFn: () => getByGenre('tv', 18), // 18 is Drama genre ID
  });

  const { data: comedyShows } = useQuery({
    queryKey: ['tv', 'comedy'],
    queryFn: () => getByGenre('tv', 35), // 35 is Comedy genre ID
  });

  if (!trendingShows || !genres || !dramaShows || !comedyShows) return null;
  const randomShowIndex = Math.floor(Math.random() * Math.min(trendingShows.length, 20));
  const randomShow = trendingShows[randomShowIndex];
  return (
    <div>
      <Hero media={randomShow} type="tv" />
      <div className="container mx-auto px-4">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top 10 TV Shows Today</h2>
          <MediaGrid items={trendingShows.slice(0, 10)} type="tv" />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Drama Series</h2>
          <MediaGrid items={dramaShows.slice(0, 5)} type="tv" />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top Comedy Shows</h2>
          <MediaGrid items={comedyShows.slice(0, 5)} type="tv" />
        </section>
      </div>
    </div>
  );
}