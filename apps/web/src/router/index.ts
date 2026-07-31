/**
 * Hash router — chosen deliberately so the built site works from file://
 * (double-click index.html) without a server. No history mode.
 *
 * Component resolution is centralised: most chapter ids map onto a small set
 * of shared renderers (ContentPage / BizModulePage) to avoid 20 boilerplate
 * files. Only pages with bespoke interaction get a dedicated component.
 */
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { project } from '@/data/project'

type ComponentKind =
  | { kind: 'content' }
  | { kind: 'model-library' }
  | { kind: 'onemap' }
  | { kind: 'chuhe' }
  | { kind: 'biz' }
  | { kind: 'my-needs' }

function resolveComponent(id: string): ComponentKind {
  if (id === 'model-library') return { kind: 'model-library' }
  if (id === 'my-needs') return { kind: 'my-needs' }
  if (id === 'biz-onemap') return { kind: 'onemap' }
  if (id === 'biz-chuhe') return { kind: 'chuhe' }
  if (id.startsWith('biz-')) return { kind: 'biz' }
  return { kind: 'content' }
}

/** All chapter ids from the nav tree, in display order. */
const chapterIds: string[] = (() => {
  const ids = new Set<string>()
  for (const item of project.nav) {
    ids.add(item.id)
    item.children?.forEach((c: { id: string }) => ids.add(c.id))
  }
  return [...ids]
})()

const lazy = (loader: () => Promise<unknown>) => () => loader() as Promise<any>

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: lazy(() => import('@/pages/LoginPage.vue')) },
  {
    path: '/',
    component: lazy(() => import('@/layouts/MainLayout.vue')),
    children: [
      { path: '', name: 'overview', component: lazy(() => import('@/pages/OverviewPage.vue')) },
      ...chapterIds.map((id) => {
        const c = resolveComponent(id)
        const component =
          c.kind === 'model-library'
            ? lazy(() => import('@/pages/chapters/ModelLibraryPage.vue'))
            : c.kind === 'my-needs'
              ? lazy(() => import('@/pages/chapters/MyNeedsPage.vue'))
              : c.kind === 'onemap'
                ? lazy(() => import('@/pages/chapters/BizOnemapPage.vue'))
                : c.kind === 'chuhe'
                  ? lazy(() => import('@/pages/chapters/BizChuhePage.vue'))
                  : c.kind === 'biz'
                    ? lazy(() => import('@/pages/chapters/BizModulePage.vue'))
                    : lazy(() => import('@/pages/chapters/ContentPage.vue'))
        return { path: id, name: id, component, props: { chapterId: id } }
      }),
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

/** Guard: must "log in" before seeing the platform (demo auth). */
router.beforeEach((to) => {
  if (to.name === 'login') return true
  const authed = sessionStorage.getItem('wd-authed') === '1'
  if (!authed) return { name: 'login' }
  return true
})
