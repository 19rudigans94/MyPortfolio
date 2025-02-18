import React from "react";
import { Helmet } from "react-helmet-async";

interface OpenGraphProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
}

const OpenGraph: React.FC<OpenGraphProps> = ({
  title,
  description,
  image = "/og-image.png", // Дефолтное OG изображение
  url = "https://viktor-rudi.com/", // Замените на ваш домен
  type = "website",
}) => {
  return (
    <Helmet>
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default OpenGraph;
