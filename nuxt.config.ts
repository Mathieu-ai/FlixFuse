// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-09',
  devtools: { enabled: true },
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'nl', name: 'Nederlands', file: 'nl.json' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      redirectOn: 'root',
      fallbackLocale: 'en'
    }
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui-pro',
    'nuxt-auth-utils',
    '@pinia/nuxt',
    'nuxt-mapbox',
    '@nuxtjs/i18n'
  ],
  nitro: {
    experimental: {
      wasm: true,
      websocket: true
    }
  },
  mapbox: {
    accessToken: process.env.MAPBOX_TOKEN
  },
  css: ['@/assets/css/main.css'],
})