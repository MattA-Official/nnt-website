// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/seo', '@nuxt/icon', 'nuxt-vuefire'],

  routeRules: {
    '/**': { prerender: true },
    '/api/**': { prerender: false },
    '/admin/**': { prerender: false },
    // TODO: figure out which routes need to be excluded from prerendering
    '/mailing-list': { redirect: 'https://newtheatre.us3.list-manage.com/subscribe?u=ce5311ce46fe45638f90f4022&id=97e4899eb8' },
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
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
        }
      }
    },
  },

  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    },
    auth: {
      enabled: true,
      sessionCookie: true,
    }
  },
})