import { Genre } from '../types';

interface GenreSelectProps {
  genres: Genre[];
  selectedGenre: number | null;
  onSelectGenre: (genreId: number | null) => void;
}

export default function GenreSelect({ genres, selectedGenre, onSelectGenre }: GenreSelectProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-4 sm:mb-6">
      <button
        onClick={() => onSelectGenre(null)}
        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full ${
          selectedGenre === null
            ? 'bg-purple-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelectGenre(genre.id)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full ${
            selectedGenre === genre.id
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}