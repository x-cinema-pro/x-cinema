import { Helmet } from 'react-helmet-async';
import { getImageUrl } from '../api/tmdb';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string | null;
  type?: 'website' | 'video.movie' | 'video.episode';
  video?: {
    releaseDate?: string;
    duration?: number;
    rating?: number;
  };
}

const DEFAULT_TITLE = 'X-cinema - Watch Movies & TV Shows Online';
const DEFAULT_DESCRIPTION = 'Stream the latest movies and TV shows in HD quality. Watch anywhere, anytime with X-cinema.';
const DEFAULT_IMAGE = '/og-image.jpg';

export default function SEO({
  title,
  description,
  image,
  type = 'website',
  video,
}: SEOProps) {
  const finalTitle = title ? `${title} - X-cinema` : DEFAULT_TITLE;
  const finalDescription = description || DEFAULT_DESCRIPTION;
  const finalImage = image ? getImageUrl(image) : DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="X-cinema" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Video-specific meta tags */}
      {video && (
        <>
          {video.releaseDate && (
            <meta property="video:release_date" content={video.releaseDate} />
          )}
          {video.duration && (
            <meta property="video:duration" content={video.duration.toString()} />
          )}
          {video.rating && (
            <meta property="og:video:rating" content={video.rating.toString()} />
          )}
        </>
      )}

      {/* Indexing directives */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
}