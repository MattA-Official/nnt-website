// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/seo',
    '@nuxt/icon'
  ],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2024-10-03',

  site: {
    url: 'https://newtheatre.org.uk',
    name: 'The Nottingham New Theatre',
    defaultLocale: 'en',
  },

  css: ['~/assets/css/main.css'],

  icon: {
    customCollections: [
      {
        prefix: 'icon',
        dir: './assets/icons'
      },
    ],
  }
})