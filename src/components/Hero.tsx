import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie, TVShow } from '../types';
import { getImageUrl } from '../api/tmdb';

interface HeroProps {
  media: Movie | TVShow;
  type: 'movie' | 'tv';
}

export default function Hero({ media, type }: HeroProps) {
  const title = 'title' in media ? media.title : media.name;
  const date = 'release_date' in media ? media.release_date : media.first_air_date;
  
  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(media.backdrop_path)}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>
        <div className="relative h-full flex flex-col justify-end px-4 sm:px-8 pb-8 sm:pb-16">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4">{title}</h1>
            <p className="text-gray-200 text-sm sm:text-base mb-2">{new Date(date).getFullYear()}</p>
            <p className="text-gray-200 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6">{media.overview}</p>
            <div className="flex gap-3 sm:gap-4">
              <Link
                to={`/watch/${type}/${media.id}`}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
              >
                <Play size={20} />
                Watch Now
              </Link>
              <Link
                to={`/details/${type}/${media.id}`}
                className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}