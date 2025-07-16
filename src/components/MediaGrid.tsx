import { Link } from 'react-router-dom';
import { Movie, TVShow } from '../types';
import { getImageUrl } from '../api/tmdb';
import { Info } from 'lucide-react';

interface MediaGridProps {
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
}

export default function MediaGrid({ items, type }: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {items.map((item) => {
        const title = 'title' in item ? item.title : item.name;
        return (
          <div key={item.id} className="relative group">
            <Link
              to={`/details/${type}/${item.id}`}
              className="relative block overflow-hidden rounded-lg transition-transform hover:scale-105 active:scale-100"
            >
              <img
                src={getImageUrl(item.poster_path)}
                alt={title}
                className="w-full aspect-[2/3] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Info size={30} className="text-white" />
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}