import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getByGenre, getGenres } from '../api/tmdb';
import MediaGrid from '../components/MediaGrid';
import { Film, Tv } from 'lucide-react';
import type { Genre } from '../types';

type MediaType = 'movie' | 'tv';

export default function Genres() {
  const [mediaType, setMediaType] = useState<MediaType>('movie');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: genres } = useQuery({
    queryKey: ['genres', mediaType],
    queryFn: () => getGenres(mediaType),
  });

  const { data: mediaItems } = useQuery({
    queryKey: ['byGenre', mediaType, selectedGenre],
    queryFn: () => selectedGenre ? getByGenre(mediaType, selectedGenre) : null,
    enabled: !!selectedGenre,
  });

  if (!genres) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Media Type Selection */}
        <div className="flex gap-4">
          <button
            onClick={() => setMediaType('movie')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              mediaType === 'movie'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Film size={20} />
            Movies
          </button>
          <button
            onClick={() => setMediaType('tv')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              mediaType === 'tv'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Tv size={20} />
            TV Shows
          </button>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre: Genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`p-6 rounded-lg text-left transition-colors ${
                selectedGenre === genre.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <h3 className="text-lg font-semibold">{genre.name}</h3>
            </button>
          ))}
        </div>

        {/* Results */}
        {selectedGenre && mediaItems && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {genres.find((g: Genre) => g.id === selectedGenre)?.name} {mediaType === 'movie' ? 'Movies' : 'TV Shows'}
            </h2>
            <MediaGrid items={mediaItems} type={mediaType} />
          </div>
        )}
      </div>
    </div>
  );
}