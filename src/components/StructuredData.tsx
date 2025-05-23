import { Game } from '@/types';

interface StructuredDataProps {
  type: 'website' | 'article' | 'game' | 'organization';
  data: Game;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
    };

    switch (type) {
      case 'website':
        return {
          ...baseSchema,
          '@type': 'WebSite',
          name: 'ANA Gaming',
          url: process.env.NEXTAUTH_URL,
          description: 'Plataforma de visualização de apostas esportivas',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${process.env.NEXTAUTH_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };

      case 'game':
        return {
          ...baseSchema,
          '@type': 'SportsEvent',
          name: data.name,
          startDate: data.startTime,
          sport: data.category,
          location: {
            '@type': 'Place',
            name: 'Estádio/Arena',
          },
          competitor: [
            {
              '@type': 'SportsTeam',
              name: data.homeTeam,
            },
            {
              '@type': 'SportsTeam',
              name: data.awayTeam,
            },
          ],
        };

      case 'organization':
        return {
          ...baseSchema,
          '@type': 'Organization',
          name: 'ANA Gaming',
          url: process.env.NEXTAUTH_URL,
          logo: `${process.env.NEXTAUTH_URL}/logo.png`,
          description: 'Plataforma líder em visualização de odds de apostas esportivas',
          sameAs: ['https://twitter.com/anagaming', 'https://linkedin.com/company/anagaming'],
        };

      default:
        return baseSchema;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateSchema()),
      }}
    />
  );
}
