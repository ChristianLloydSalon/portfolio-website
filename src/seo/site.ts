/**
 * Site-wide SEO settings. The production origin comes from VITE_SITE_URL (.env);
 * it drives the canonical URL, Open Graph tags, JSON-LD, robots.txt and sitemap.xml.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://christianlloydsalon.web.app').replace(/\/+$/, '');

export const site = {
  url: `${SITE_URL}/`,
  name: 'Christian Lloyd Salon',
  title: 'Christian Lloyd Salon | Senior Flutter & Full-Stack Engineer',
  description:
    'Senior Flutter & Full-Stack Engineer with 5+ years shipping production mobile apps, NestJS backends and AWS systems. Case studies and experience.',
  image: `${SITE_URL}/og-image.jpg`,
  imageAlt: 'Christian Lloyd Salon, Senior Flutter & Full-Stack Engineer: portfolio cover art',
  locale: 'en_US',
};
