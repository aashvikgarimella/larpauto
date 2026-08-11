import { defineConfig } from 'astro/config';

/**
 * Two possible homes, and they need different URLs baked in.
 *
 *   CUSTOM_DOMAIN unset  ->  https://aashvikgarimella.github.io/larpauto/
 *                            served from a subpath, so `base` is required or
 *                            every stylesheet, font and link 404s.
 *
 *   CUSTOM_DOMAIN set    ->  https://larpauto.com/
 *                            served from the apex, no base, and the build
 *                            emits a CNAME file so Pages keeps the domain.
 *
 * Set the repo variable CUSTOM_DOMAIN=larpauto.com once DNS points at GitHub.
 */
const domain = process.env.CUSTOM_DOMAIN;

export default defineConfig({
  site: domain ? `https://${domain}` : 'https://aashvikgarimella.github.io',
  base: domain ? undefined : '/larpauto',
  compressHTML: false,
  build: { inlineStylesheets: 'auto' },
  integrations: [
    {
      name: 'cname',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          if (!domain) return;
          const { writeFile } = await import('node:fs/promises');
          await writeFile(new URL('CNAME', dir), domain + '\n');
        },
      },
    },
  ],
});
