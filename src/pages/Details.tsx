import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDetails, getImageUrl, getSeasonDetails } from '../api/tmdb';
import { Play, Star, Calendar, Clock, Users, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { TVShowDetails, Cast } from '../types';
import SEO from '../components/SEO';

function CastMember({ cast }: { cast: Cast }) {
  const imageUrl = getImageUrl(cast.profile_path);
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mb-2 rounded-full overflow-hidden bg-gray-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={cast.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users size={20} className="text-gray-600" />
          </div>
        )}
      </div>
      <h4 className="font-medium text-sm sm:text-base line-clamp-1">{cast.name}</h4>
      <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">{cast.character}</p>
    </div>
  );
}

export default function Details() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const navigate = useNavigate();

  const { data: details } = useQuery({
    queryKey: ['details', type, id],
    queryFn: () => getDetails(type as 'movie' | 'tv', id as string),
  });

  const { data: seasonDetails } = useQuery({
    queryKey: ['season', id, selectedSeason],
    queryFn: () => getSeasonDetails(id as string, selectedSeason),
    enabled: type === 'tv',
  });

  if (!details) return null;

  const title = 'title' in details ? details.title : details.name;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
  const duration = 'runtime' in details ? details.runtime : undefined;
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  return (
    <>
      <SEO
        title={title}
        description={details.overview}
        image={details.backdrop_path}
        type={type === 'movie' ? 'video.movie' : 'video.episode'}
        video={{
          releaseDate,
          duration,
          rating: details.vote_average,
        }}
      />
      <div className="min-h-screen pt-16">
        {/* Keep the existing JSX structure */}
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px]">
          <button
            onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="absolute inset-0">
          <img
            src={getImageUrl(details.backdrop_path)}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <img
              src={getImageUrl(details.poster_path)}
              alt={title}
              className="hidden sm:block w-48 sm:w-64 rounded-lg shadow-xl self-center sm:self-auto"
            />
            <div className="flex flex-col justify-end text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{title}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-gray-300 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar size={20} />
                  <span>{formatDate(releaseDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={20} />
                  <span>{duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400" size={20} />
                  <span>{details.vote_average.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                {details.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-300 max-w-2xl mb-6">{details.overview}</p>
              
              <Link
                to={`/watch/${type}/${id}`}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors w-fit mx-auto sm:mx-0"
              >
                <Play size={20} />
                Watch Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* TV Show Episodes */}
        {type === 'tv' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Episodes</h2>
            <div className="flex flex-col gap-6">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="w-full max-w-xs px-4 py-2 bg-gray-800 rounded-lg text-white"
              >
                {Array.from(
                  { length: (details as TVShowDetails).number_of_seasons },
                  (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Season {i + 1}
                    </option>
                  )
                )}
              </select>

              {seasonDetails?.episodes.map((episode) => (
                <Link
                  key={episode.id}
                  to={`/watch/tv/${id}?season=${selectedSeason}&episode=${episode.episode_number}`}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {episode.still_path ? (
                    <img
                      src={getImageUrl(episode.still_path)}
                      alt={episode.name}
                      className="w-full sm:w-48 aspect-video object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full sm:w-48 aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <Play size={24} className="text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400">Episode {episode.episode_number}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{episode.runtime} min</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{episode.name}</h3>
                    <p className="text-gray-400 line-clamp-2">{episode.overview}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Cast Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6">
            {details.credits.cast.slice(0, 6).map((cast) => (
              <CastMember key={cast.id} cast={cast} />
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-12">
          <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="ml-2">Released</span>
              </div>
              {'runtime' in details ? (
                <div>
                  <span className="text-gray-400">Runtime:</span>
                  <span className="ml-2">{details.runtime} minutes</span>
                </div>
              ) : (
                <>
                  <div>
                    <span className="text-gray-400">Seasons:</span>
                    <span className="ml-2">{(details as TVShowDetails).number_of_seasons}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Episodes:</span>
                    <span className="ml-2">{(details as TVShowDetails).number_of_episodes}</span>
                  </div>
                </>
              )}
              <div>
                <span className="text-gray-400">Release Date:</span>
                <span className="ml-2">{formatDate(releaseDate)}</span>
              </div>
              <div>
                <span className="text-gray-400">User Score:</span>
                <span className="ml-2">{(details.vote_average * 10).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Videos/Trailers */}
          {details.videos.results.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl font-bold mb-4">Videos</h2>
              <div className="space-y-3">
                {details.videos.results.slice(0, 3).map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Play size={20} className="text-purple-600" />
                    <div>
                      <p className="font-medium line-clamp-1">{video.name}</p>
                      <p className="text-sm text-gray-400">{video.type}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}