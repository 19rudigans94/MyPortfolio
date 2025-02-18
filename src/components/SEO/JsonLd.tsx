import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredData {
  '@context': string;
  '@type': string;
  name: string;
  jobTitle: string;
  url: string;
  sameAs: string[];
  knowsAbout: string[];
  worksFor: {
    '@type': string;
    name: string;
  };
  description: string;
}

const JsonLd: React.FC = () => {
  const structuredData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Руди Виктор',
    jobTitle: 'Frontend Developer',
    url: 'https://your-portfolio-url.com',
    sameAs: [
      'https://github.com/your-github',
      'https://linkedin.com/in/your-linkedin',
    ],
    knowsAbout: [
      'Frontend Development',
      'React',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'UI/UX Design'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance'
    },
    description: 'Frontend разработчик, специализирующийся на создании современных веб-приложений с использованием React, TypeScript и Tailwind CSS'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default JsonLd;
