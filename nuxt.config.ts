// https://nuxt.com/docs/api/configuration/nuxt-config
const portEnv = process.env.NUXT_PORT?.trim()
const devPort = portEnv ? parseInt(portEnv, 10) : 0
const devServerPort = Number.isFinite(devPort) ? devPort : 3004

function resolvePublicApiBase(): string {
  const raw = process.env.NUXT_PUBLIC_API_BASE?.trim()
  return raw || '/api'
}

export default defineNuxtConfig({
  srcDir: '.',
  compatibilityDate: '2026-01-31',
  devtools: { enabled: import.meta.dev },
  watchers: {
    chokidar: {
      usePolling: true,
      interval: 300,
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: devServerPort
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 300,
        awaitWriteFinish: {
          stabilityThreshold: 200,
          pollInterval: 100
        }
      }
    }
  },
  runtimeConfig: {
    public: {
      apiBase: resolvePublicApiBase(),
      portalKey: process.env.NUXT_PUBLIC_PORTAL_KEY || 'portal',
      serviceKey: process.env.NUXT_PUBLIC_SERVICE_KEY || 'PORTAL',
      dashboardTheme: process.env.NUXT_PUBLIC_DASHBOARD_THEME || 'mairy'
    }
  },
  modules: ['@nuxt/eslint', '@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/i18n', 'shadcn-nuxt'],
  css: ['~/assets/css/main.css'],
  shadcn: {
    componentDir: [
      { path: './components/atoms', prefix: 'At' },
      { path: './components/molecules', prefix: 'Mo' }
    ]
  },
  components: [
    { path: '~/components/atoms', pathPrefix: false },
    { path: '~/components/organisms', pathPrefix: false }
  ],
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'ja',
    detectBrowserLanguage: false,
    langDir: 'locales',
    locales: [
      {
        code: 'ja',
        iso: 'ja-JP',
        name: '日本語',
        file: 'ja.json'
      }
    ],
    vueI18n: './i18n.config'
  }
})
