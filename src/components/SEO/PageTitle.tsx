import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface PageTitleProps {
  title: string;
  description?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, description }: PageTitleProps) => {
  const fullTitle = `${title} | Руди Виктор - Frontend Developer`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && (
        <meta name="description" content={description} />
      )}
    </Helmet>
  );
};

export default PageTitle;
