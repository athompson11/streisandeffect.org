import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://streisandeffect.org',
  output: 'static',
  build: {
    format: 'directory'
  }
});
