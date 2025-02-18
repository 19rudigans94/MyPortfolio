import React from 'react';

type ImageLoadingType = 'lazy' | 'eager';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  alt: string; // Делаем alt обязательным для SEO
  width?: number;
  height?: number;
  loading?: ImageLoadingType;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>((
  { src, alt, width, height, loading = 'lazy', className, ...props }, ref
) => {
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
      {...props}
    />
  );
});

Image.displayName = 'Image';

export default Image;
