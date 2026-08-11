import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://larpauto.com',
  compressHTML: false,
  build: { inlineStylesheets: 'auto' },
});
