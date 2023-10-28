export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Should I leave my job?',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxt/http', '@nuxtjs/i18n'],

  i18n: {
    defaultLocale: 'en',
    vueI18nLoader: true,
    // vueI18n: {
    //   en: {
    //     hatesManagedSelfEmployed:
    //       'There are a few people in the world who are designed to not have a boss,\
    //     and you are one of them. You hate being told what to do, and so having a boss\
    //     is the worst. So, well done on working for yourself!',
    //   },
    // },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
