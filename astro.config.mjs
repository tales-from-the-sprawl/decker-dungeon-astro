// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://ddng.databladet.se',
  integrations: [mdx()],
  output: 'server',
  devToolbar: {
    enabled: false
  },

  adapter: node({
    mode: 'standalone',
  }),

  session: {
    driver: "fs",
    options: {
      base: "./session"
    }
  },

  vite: {
    server: {
      allowedHosts: ["ddng.databladet.se"]
    }
  }    
});