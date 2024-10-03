// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/seo'
  ],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2024-10-03'
})