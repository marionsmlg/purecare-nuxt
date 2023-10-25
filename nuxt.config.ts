// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&family=Quicksand:wght@300;400;500;600;700&display=swap',
        },
      ],
    }
  },
  runtimeConfig: {
    apiKey: 'AIzaSyAhPjzK9O-DH3FLUGp3SYuzwWfgZ10wyTA', 
    projectId :'biocare-ac1f1',
    senderId : '899493293584',
    appId: '1:899493293584:web:2e7c97ad970719c7196495',
    measurementId : 'LEHHMR2EE9'
  
  },

  
})

