import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Cloud, Tv, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDetails, getSeasonDetails } from '../api/tmdb';
import type { TVShowDetails } from '../types';

const SERVERS = [
  {
    category: 'Primary Servers',
    servers: [
      { id: 1, name: 'Vidsrc.su', url: 'https://vidsrc.su/embed', quality: 'NO ADS - 1080p' },
      { id: 2, name: 'Vidsrc.cc', url: 'https://vidsrc.cc/v3/embed', quality: '1080p/4K' },
      { id: 3, name: 'Embed.su', url: 'https://embed.su/embed', quality: '1080p' }
    ]
  },
  {
    category: 'Backup Servers',
    servers: [
      { id: 4, name: 'Vidsrc.xyz', url: 'https://vidsrc.xyz/embed', quality: '1080p' },
      { id: 5, name: 'Vidsrc.vip', url: 'https://vidsrc.vip/embed', quality: '1080p' },
      { id: 6, name: 'Vidsrc.icu', url: 'https://vidsrc.icu/embed', quality: '720p' }
    ]
  },
  {
    category: 'Alternative Servers',
    servers: [
      { id: 7, name: 'Coming soon', url: 'Coming soon', quality: '1080p' },
      { id: 8, name: 'Coming soon', url: 'Coming soon', quality: '1080p' },
      { id: 9, name: 'Coming soon', url: 'Coming soon', quality: '1080p' }
    ]
  }
];

export default function Watch() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [showServers, setShowServers] = useState(false);
  const [selectedServer, setSelectedServer] = useState(() => {
    const saved = localStorage.getItem('selected-server');
    return saved ? parseInt(saved) : 1;
  });
  
  const [selectedSeason, setSelectedSeason] = useState(() => {
    return parseInt(searchParams.get('season') || '1');
  });
  const [selectedEpisode, setSelectedEpisode] = useState(() => {
    return parseInt(searchParams.get('episode') || '1');
  });
  
  const [showEpisodes, setShowEpisodes] = useState(false);

  const { data: details } = useQuery({
    queryKey: ['details', type, id],
    queryFn: () => getDetails(type as 'movie' | 'tv', id as string),
    enabled: type === 'tv',
  });

  const { data: seasonDetails } = useQuery({
    queryKey: ['season', id, selectedSeason],
    queryFn: () => getSeasonDetails(id as string, selectedSeason),
    enabled: type === 'tv',
  });

  useEffect(() => {
    localStorage.setItem('selected-server', selectedServer.toString());
  }, [selectedServer]);

  useEffect(() => {
    if (type === 'tv') {
      setSearchParams(prev => {
        prev.set('season', selectedSeason.toString());
        prev.set('episode', selectedEpisode.toString());
        return prev;
      });
    }
  }, [selectedSeason, selectedEpisode, setSearchParams, type]);

  useEffect(() => {
    const season = parseInt(searchParams.get('season') || '1');
    const episode = parseInt(searchParams.get('episode') || '1');
    
    setSelectedSeason(season);
    setSelectedEpisode(episode);
  }, [searchParams]);

  const currentServer = SERVERS.flatMap(category => category.servers).find(s => s.id === selectedServer)!;
  const isTVShow = type === 'tv';
  const tvDetails = details as TVShowDetails | undefined;

  return (
    <div className="relative h-screen w-full bg-black">
      <div className="absolute top-2 sm:top-16 left-2 sm:left-4 z-50 flex flex-col gap-2">
        <button
          onClick={() => navigate('/')}
          className="p-2 0 rounded-full text-white transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>

        <button
          onClick={() => {
            setShowServers(!showServers);
            setShowEpisodes(false);
          }}
          className="flex items-center justify-between gap-2 px-4 py-2 bg-black/80 hover:bg-black/100 rounded-lg text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Cloud size={20} />
            <span>{currentServer.name}</span>
          </div>
          <span className="text-xs text-gray-400">{currentServer.quality}</span>
        </button>

        {showServers && (
          <div className="absolute top-full mt-2 left-0 w-64 bg-black/90 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 shadow-xl">
            {SERVERS.map((category, index) => (
              <div key={index} className="p-2">
                <div className="text-xs text-gray-400 px-2 py-1">{category.category}</div>
                {category.servers.map(server => (
                  <button
                    key={server.id}
                    onClick={() => {
                      setSelectedServer(server.id);
                      setShowServers(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-white/10 transition-colors ${
                      selectedServer === server.id ? 'text-purple-500 bg-purple-500/10' : 'text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{server.name}</span>
                      <span className="text-xs text-gray-400">{server.quality}</span>
                    </div>
                    {selectedServer === server.id && <Check size={16} />}
                  </button>
                ))}
                {index < SERVERS.length - 1 && <div className="border-t border-gray-800 my-2" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {isTVShow && tvDetails && (
        <div className="absolute top-2 sm:top-16 right-2 sm:right-4 z-50">
          <button
            onClick={() => {
              setShowEpisodes(!showEpisodes);
              setShowServers(false);
            }}
            className="flex items-center justify-between gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
          >
            <Tv size={20} />
            <span>S{selectedSeason} E{selectedEpisode}</span>
          </button>

          {showEpisodes && (
            <div className="absolute top-full mt-2 right-0 w-72 bg-black/90 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 shadow-xl">
              <div className="p-2">
                <select
                  value={selectedSeason}
                  onChange={(e) => {
                    const newSeason = Number(e.target.value);
                    setSelectedSeason(newSeason);
                    setSelectedEpisode(1); // Reset episode when season changes
                  }}
                  className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white mb-2"
                >
                  {Array.from({ length: tvDetails.number_of_seasons }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Season {i + 1}
                    </option>
                  ))}
                </select>

                <div className="max-h-[50vh] sm:max-h-96 overflow-y-auto">
                  {seasonDetails?.episodes.map((episode) => (
                    <button
                      key={episode.id}
                      onClick={() => {
                        setSelectedEpisode(episode.episode_number);
                        setShowEpisodes(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-white/10 rounded-lg transition-colors ${
                        selectedEpisode === episode.episode_number
                          ? 'text-purple-500 bg-purple-500/10'
                          : 'text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="line-clamp-1">{episode.episode_number}. {episode.name}</span>
                        {selectedEpisode === episode.episode_number && <Check size={16} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <iframe
        src={`${currentServer.url}/${type}/${id}${type === 'tv' ? `/${selectedSeason}/${selectedEpisode}` : ''}`}
        className="w-full h-full"
        allowFullScreen
      />
    </div>
  );
}
