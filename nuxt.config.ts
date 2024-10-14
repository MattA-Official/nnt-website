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
    '/': { prerender: true },
    '/mailing-list': { redirect: 'https://newtheatre.us3.list-manage.com/subscribe?u=ce5311ce46fe45638f90f4022&id=97e4899eb8' }
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