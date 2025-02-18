import React from "react";
import { Helmet } from "react-helmet-async";
import OpenGraph from "./OpenGraph";

export interface PageTitleProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
}: PageTitleProps) => {
  const fullTitle = `${title} | Руди Виктор - Frontend Developer`;
  const fullDescription = description || "Портфолио frontend разработчика с опытом создания современных веб-приложений";

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={fullDescription} />
      </Helmet>
      <OpenGraph
        title={fullTitle}
        description={fullDescription}
        image={image}
        url={url}
        type={type}
      />
    </>
  );
};

export default PageTitle;
