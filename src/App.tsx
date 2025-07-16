import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import './index.css';

const Home = React.lazy(() => import('./pages/Home'));
const Movies = React.lazy(() => import('./pages/Movies'));
const TVShows = React.lazy(() => import('./pages/TVShows'));
const Genres = React.lazy(() => import('./pages/Genres'));
const Watch = React.lazy(() => import('./pages/Watch'));
const Details = React.lazy(() => import('./pages/Details'));

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="movies" element={<Movies />} />
                <Route path="tv" element={<TVShows />} />
                <Route path="genres" element={<Genres />} />
                <Route path="details/:type/:id" element={<Details />} />
              </Route>
              <Route path="/watch/:type/:id" element={<Watch />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;