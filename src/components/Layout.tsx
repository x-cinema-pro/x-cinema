import { Link, Outlet } from 'react-router-dom';
import { Film, Home, Tv, MessageCircle, Mail, List, Menu, X } from 'lucide-react';
import { useState } from 'react';
import SearchBar from './SearchBar';
import '../index.css';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-purple-600 text-2xl font-bold flex items-center h-16">X-cinema</Link>
              <div className="hidden md:flex gap-6">
                <Link to="/" className="flex items-center gap-2 hover:text-purple-600 transition-colors h-16">
                  <Home size={20} />
                  <span>Home</span>
                </Link>
                <Link to="/movies" className="flex items-center gap-2 hover:text-purple-600 transition-colors h-16">
                  <Film size={20} />
                  <span>Movies</span>
                </Link>
                <Link to="/tv" className="flex items-center gap-2 hover:text-purple-600 transition-colors h-16">
                  <Tv size={20} />
                  <span>TV Shows</span>
                </Link>
                <Link to="/genres" className="flex items-center gap-2 hover:text-purple-600 transition-colors h-16">
                  <List size={20} />
                  <span>Genres</span>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <SearchBar />
              </div>
              <div className="hidden md:flex items-center gap-4">
                <a 
                  href="https://discord.gg/x-cinema" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center h-10 w-10 rounded-lg hover:text-purple-600 hover:bg-gray-800/50 transition-colors"
                >
                  <MessageCircle size={20} />
                </a>
                <a 
                  href="mailto:contact@x-cinema.com" 
                  className="flex items-center justify-center h-10 w-10 rounded-lg hover:text-purple-600 hover:bg-gray-800/50 transition-colors"
                >
                  <Mail size={20} />
                </a>
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-gray-800">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-4">
                <div className="px-2">
                  <SearchBar />
                </div>
                <Link
                  to="/"
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home size={20} />
                  <span>Home</span>
                </Link>
                <Link
                  to="/movies"
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Film size={20} />
                  <span>Movies</span>
                </Link>
                <Link
                  to="/tv"
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Tv size={20} />
                  <span>TV Shows</span>
                </Link>
                <Link
                  to="/genres"
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <List size={20} />
                  <span>Genres</span>
                </Link>
                <div className="flex items-center gap-4 p-2">
                  <a
                    href="https://discord.gg/x-cinema"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-10 w-10 rounded-lg hover:text-purple-600 hover:bg-gray-800/50 transition-colors"
                  >
                    <MessageCircle size={20} />
                  </a>
                  <a
                    href="mailto:contact@x-cinema.com"
                    className="flex items-center justify-center h-10 w-10 rounded-lg hover:text-purple-600 hover:bg-gray-800/50 transition-colors"
                  >
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}