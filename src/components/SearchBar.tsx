import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { searchMedia, getImageUrl } from '../api/tmdb';
import { Movie, TVShow } from '../types';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchMedia(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleResultClick = (type: 'movie' | 'tv', id: number) => {
    navigate(`/details/${type}/${id}`);
    setIsOpen(false);
    setQuery('');
  };

  const renderResult = (item: Movie | TVShow, type: 'movie' | 'tv') => {
    const title = 'title' in item ? item.title : item.name;
    const date = 'release_date' in item ? item.release_date : item.first_air_date;
    const year = date ? new Date(date).getFullYear() : '';
    const imageUrl = getImageUrl(item.poster_path);

    return (
      <button
        key={item.id}
        onClick={() => handleResultClick(type, item.id)}
        className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors w-full text-left"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-12 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-16 bg-gray-800 rounded flex items-center justify-center">
            <Search size={20} className="text-gray-400" />
          </div>
        )}
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-400">
            {type === 'movie' ? 'Movie' : 'TV Show'} • {year}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search movies & TV shows..."
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          className="w-full sm:w-[300px] bg-gray-800 text-white rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {isOpen && query && (
        <div className="absolute top-full mt-2 w-full sm:w-[300px] bg-gray-900 rounded-lg shadow-xl border border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : data && (data.movies.length > 0 || data.tvShows.length > 0) ? (
            <div className="max-h-[400px] overflow-y-auto">
              {data.movies.length > 0 && (
                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-400 px-2 mb-1">Movies</h3>
                  {data.movies.slice(0, 4).map((movie: Movie) => renderResult(movie, 'movie'))}
                </div>
              )}
              {data.tvShows.length > 0 && (
                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-400 px-2 mb-1">TV Shows</h3>
                  {data.tvShows.slice(0, 4).map((show: TVShow) => renderResult(show, 'tv'))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}