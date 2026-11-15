/**
 * Site-wide SEO settings. The production origin comes from VITE_SITE_URL (.env);
 * it drives the canonical URL, Open Graph tags, JSON-LD, robots.txt and sitemap.xml.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://christianlloydsalon.web.app').replace(/\/+$/, '');

export const site = {
  url: `${SITE_URL}/`,
  name: 'Christian Lloyd Salon',
  title: 'Christian Lloyd Salon | Software Engineer (Flutter, React, NestJS)',
  description:
    'Christian Lloyd Salon is a software engineer in Bohol, Philippines building production Flutter apps, React web apps and NestJS + AWS backends. Projects, experience and resume.',
  image: `${SITE_URL}/og-image.jpg`,
  imageAlt: 'Christian Lloyd Salon, Software Engineer: portfolio cover art',
  locale: 'en_US',
};
