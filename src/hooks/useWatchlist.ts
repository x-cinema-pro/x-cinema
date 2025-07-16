import { useState, useEffect } from 'react';
import { WatchlistItem } from '../types';

const WATCHLIST_STORAGE_KEY = 'x-cinema-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (item: WatchlistItem) => {
    if (!isInWatchlist(item.id)) {
      setWatchlist(prev => [...prev, item]);
    }
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some(item => item.id === id);
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
}