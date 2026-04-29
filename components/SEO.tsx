import type { Metadata } from 'next';

const SITE_URL = 'https://skfsd.online';
const DEFAULT_DESC =
  'Streamline postal operations with powerful analytics, target tracking, and real-time delivery monitoring.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

type SEOProps = {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
};

export function generateMetadata({
  title,
  description = DEFAULT_DESC,
  canonical,
  image = DEFAULT_IMAGE,
  noIndex = false,
}: SEOProps): Metadata {
  const fullTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;

  const desc =
    description.length > 160 ? description.slice(0, 157) + '...' : description;

  const url = canonical || SITE_URL;

  return {
    title: fullTitle,
    description: desc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      images: [image],
    },
    twitter: {
      title: fullTitle,
      description: desc,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}
