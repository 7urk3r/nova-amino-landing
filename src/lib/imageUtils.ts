/**
 * Sanity image optimization utilities
 * Transforms raw Sanity CDN URLs into optimized versions with proper sizing, format, and quality
 */

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'png' | 'jpg';
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint';
  blur?: number;
  sharpen?: number;
}

/**
 * Optimizes a Sanity image URL with size, format, and quality parameters
 */
export function optimizeImage(
  url: string | undefined | null,
  options: ImageOptions = {}
): string | undefined {
  if (!url) return undefined;

  // Ensure we have a valid Sanity CDN URL
  if (!url.includes('cdn.sanity.io')) return url;

  const {
    width,
    height,
    quality = 75,
    format = 'auto',
    fit = 'crop',
    crop = 'center',
    blur,
    sharpen,
  } = options;

  // Build query parameters
  const params = new URLSearchParams();

  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  if (quality) params.append('q', quality.toString());
  if (format === 'auto') params.append('auto', 'format');
  else if (format) params.append('fm', format);
  if (fit) params.append('fit', fit);
  if (crop && fit === 'crop') params.append('crop', crop);
  if (blur) params.append('blur', blur.toString());
  if (sharpen) params.append('sharpen', sharpen.toString());

  // Add parameters to URL
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

/**
 * Creates a responsive srcset for different screen sizes
 */
export function createResponsiveSrcset(
  url: string | undefined | null,
  sizes: number[] = [400, 800, 1200],
  options: Omit<ImageOptions, 'width'> = {}
): string | undefined {
  if (!url) return undefined;

  return sizes
    .map(size => `${optimizeImage(url, { ...options, width: size })} ${size}w`)
    .join(', ');
}

/**
 * Predefined image optimization presets for common use cases
 */
export const imagePresets = {
  // Product cards - small, optimized
  productCard: (url: string | undefined | null) =>
    optimizeImage(url, { width: 400, height: 400, quality: 80 }),

  // Product cards hover/back image
  productCardHover: (url: string | undefined | null) =>
    optimizeImage(url, { width: 400, height: 400, quality: 80 }),

  // Hero images - large, high quality
  hero: (url: string | undefined | null) =>
    optimizeImage(url, { width: 1200, height: 800, quality: 85 }),

  // Hero mobile
  heroMobile: (url: string | undefined | null) =>
    optimizeImage(url, { width: 800, height: 600, quality: 80 }),

  // Thumbnails - very small
  thumbnail: (url: string | undefined | null) =>
    optimizeImage(url, { width: 150, height: 150, quality: 70 }),

  // Avatar images
  avatar: (url: string | undefined | null) =>
    optimizeImage(url, { width: 64, height: 64, quality: 80, fit: 'crop', crop: 'center' }),

  // Mission statement supporting images
  supportingImage: (url: string | undefined | null) =>
    optimizeImage(url, { width: 600, height: 400, quality: 80 }),

  // Study feed thumbnails
  studyThumbnail: (url: string | undefined | null) =>
    optimizeImage(url, { width: 300, height: 200, quality: 75 }),
} as const;

/**
 * Helper to create responsive image markup with srcset
 */
export function createResponsiveImage(
  url: string | undefined | null,
  alt: string,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  widths = [400, 800, 1200],
  options: Omit<ImageOptions, 'width'> = {}
) {
  if (!url) return null;

  const srcset = createResponsiveSrcset(url, widths, options);
  const fallbackSrc = optimizeImage(url, { ...options, width: widths[0] });

  return {
    src: fallbackSrc,
    srcset,
    sizes,
    alt,
  };
}