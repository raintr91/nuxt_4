import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const TOP_LEVEL_FEATURE_ORDER = ['admin', 'chain']
const FEATURE_FUNCTION_ORDER = [
  'list',
  'create',
  'detail',
  'show',
  'edit',
  'update',
  'duplicate',
  'delete-multiple',
  'delete',
  'login-as-manager',
  'create-manager-user',
  'form-options',
  'crawl-setting',
  'autocomplete',
  'analytics-download-pdf',
  'analytics-export',
  'analytics',
  'export-report',
]
const featureSidebarItems = buildFeatureSidebar()

export default withMermaid(defineConfig({
  title: 'Portal Docs',
  description: 'Portal feature specs, testcases, and team workflow',
  cleanUrls: true,
  ignoreDeadLinks: [/^https?:\/\/localhost(:\d+)?/],
  vite: {
    optimizeDeps: {
      include: ['dayjs', 'mermaid'],
    },
    resolve: {
      alias: {
        dayjs: 'dayjs/',
      },
    },
    build: {
      commonjsOptions: {
        include: [/dayjs/, /node_modules/],
      },
    },
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Features', link: '/common-ui/generated' },
      { text: 'Feature artifact', link: '/operational/FEATURE-ARTIFACT-FLOWS' }
    ],
    sidebar: [
      {
        text: 'Operational',
        collapsed: true,
        items: [
          { text: 'Architecture', link: '/operational/ARCHITECTURE' },
          { text: 'Full cycle (overview)', link: '/operational/FULL-CYCLE-PIPELINE-DIAGRAM' },
          { text: 'Feature artifact (index)', link: '/operational/FEATURE-ARTIFACT-FLOWS' },
          { text: 'Prompt templates', link: '/operational/PROMPT-TEMPLATES' },
          { text: 'Design Registry Promotion', link: '/operational/DESIGN-REGISTRY-PROMOTION' },
          { text: 'Page Lifecycle', link: '/operational/PAGE-LIFECYCLE' }
        ]
      },
      {
        text: 'Onboarding',
        collapsed: true,
        items: [
          { text: 'Feature Artifact Workflow Slides', link: '/onboarding/team-ai-workflow-slides' },
          { text: 'YAML/Markdown AI Workflow', link: '/onboarding/yaml-markdown-ai-workflow' },
          { text: 'Platform Base Overview', link: '/onboarding/platform-base-overview' },
          { text: 'E2E Automation Playwright', link: '/onboarding/e2e-automation-playwright' }
        ]
      },
      {
        text: 'Dev environment',
        collapsed: true,
        items: [
          { text: 'Docker dev nhẹ', link: '/dev-environment/DOCKER-DEV-LIGHT' },
          { text: 'WSL + Cursor perf', link: '/dev-environment/WSL-CURSOR-PERF' },
          { text: 'Monorepo strategy', link: '/dev-environment/MONOREPO-STRATEGY' }
        ]
      },
      {
        text: 'Features',
        collapsed: true,
        items: featureSidebarItems
      },
      { text: 'Common', link: '/common-ui/' },
      {
        text: 'Flow trace',
        collapsed: true,
        items: [{ text: 'Index', link: '/flow-trace/' }]
      }
    ],
    search: {
      provider: 'local'
    }
  }
}))

function buildFeatureSidebar() {
  const featuresRoot = join(docsRoot, 'features', 'md')
  if (!existsSync(featuresRoot)) return []

  return listFeatureGroups(featuresRoot)
}

function listFeatureGroups(dir: string): DefaultTheme.SidebarItem[] {
  const entries = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.'))

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md')
    .map((entry) => join(dir, entry.name))
    .sort(sidebarPathSort)

  const groups = entries
    .filter((entry) => entry.isDirectory() && entry.name !== 'testcases')
    .map((entry) => {
      const childItems = listFeatureGroups(join(dir, entry.name))
      return {
        name: entry.name,
        item: {
          text: titleCase(entry.name),
          collapsed: true,
          items: childItems
        }
      }
    })
    .filter(({ item }) => item.items.length > 0)
    .sort((a, b) => compareSidebarNames(a.name, b.name))
    .map(({ item }) => item)

  return [
    ...files.map((file) => ({
      text: readTitle(file),
      link: specLink(file)
    })),
    ...groups
  ]
}

function sidebarPathSort(a: string, b: string) {
  return compareSidebarNames(a, b)
}

function compareSidebarNames(aPath: string, bPath: string) {
  const a = aPath.split('/').pop() ?? aPath
  const b = bPath.split('/').pop() ?? bPath
  const aRank = sidebarRank(a)
  const bRank = sidebarRank(b)

  if (aRank !== bRank) return aRank - bRank
  return a.localeCompare(b)
}

function sidebarRank(value: string) {
  const normalized = value.toLowerCase().replace(/\.md$/, '')

  const topLevelRank = TOP_LEVEL_FEATURE_ORDER.indexOf(normalized)
  if (topLevelRank >= 0) return topLevelRank

  const functionRank = FEATURE_FUNCTION_ORDER.findIndex((keyword) => {
    return normalized === keyword || normalized.startsWith(`${keyword}-`) || normalized.includes(keyword)
  })
  if (functionRank >= 0) return 100 + functionRank

  return 1000
}

function readTitle(file: string) {
  const firstHeading = readFileSync(file, 'utf8').match(/^#\s+(.+)$/m)?.[1]
  return firstHeading ?? relative(docsRoot, dirname(file))
}

function specLink(file: string) {
  const relativePath = relative(docsRoot, file).split('/').join('/')
  return `/${relativePath.replace(/\.md$/, '')}`
}

function titleCase(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
