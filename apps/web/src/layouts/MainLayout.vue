<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { project, navIndex } from '@/data/project'
import LogoMark from '@/components/LogoMark.vue'
import AiAssistant from '@/components/AiAssistant.vue'

const router = useRouter()
const now = ref(new Date())
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => (now.value = new Date()), 1000)
})
onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})

const timeStr = computed(
  () =>
    `${now.value.getFullYear()}-${pad(now.value.getMonth() + 1)}-${pad(now.value.getDate())} ` +
    `${pad(now.value.getHours())}:${pad(now.value.getMinutes())}:${pad(now.value.getSeconds())}`,
)
function pad(n: number) {
  return String(n).padStart(2, '0')
}

function logout() {
  sessionStorage.removeItem('wd-authed')
  router.push('/login')
}

const collapsed = ref(false)
</script>

<template>
  <div class="shell">
    <!-- ============ Top bar ============ -->
    <header class="topbar">
      <div class="topbar__left">
        <button class="topbar__collapse" :class="{ 'is-collapsed': collapsed }" @click="collapsed = !collapsed" aria-label="折叠导航">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        </button>
        <LogoMark :mark="project.brand.logo.mark" :size="36" />
        <div class="topbar__title">
          <span class="topbar__name">{{ project.brand.systemName }}</span>
          <span class="topbar__sub">{{ project.brand.tagline }}</span>
        </div>
      </div>

      <div class="topbar__center">
        <span class="topbar__breadcrumb">{{ navIndex.get(String($route.name))?.title ?? '总览' }}</span>
      </div>

      <div class="topbar__right">
        <span class="topbar__time">{{ timeStr }}</span>
        <span class="topbar__badge wd-chip">演示环境</span>
        <div class="topbar__user">
          <span class="topbar__avatar">管</span>
          <span class="topbar__username">管理员</span>
          <button class="topbar__logout" @click="logout">退出</button>
        </div>
      </div>
    </header>

    <div class="shell__main">
      <!-- ============ Left nav ============ -->
      <aside class="nav" :class="{ 'nav--collapsed': collapsed }">
        <nav class="nav__list wd-scroll">
          <template v-for="item in project.nav" :key="item.id">
            <router-link
              v-if="!item.children"
              :to="{ name: item.id }"
              class="nav__item"
              active-class="nav__item--active"
            >
              <span class="nav__text">{{ item.title }}</span>
              <span v-if="item.ref" class="nav__ref">{{ item.ref }}</span>
            </router-link>

            <div v-else class="nav__group">
              <router-link :to="{ name: item.id }" class="nav__item nav__item--parent" active-class="nav__item--active">
                <span class="nav__text">{{ item.title }}</span>
              </router-link>
              <div class="nav__children">
                <router-link
                  v-for="child in item.children"
                  :key="child.id"
                  :to="{ name: child.id }"
                  class="nav__item nav__item--child"
                  active-class="nav__item--active"
                >
                  <span class="nav__dot" />
                  <span class="nav__text">{{ child.title }}</span>
                </router-link>
              </div>
            </div>
          </template>
        </nav>
        <div class="nav__foot">
          <span class="wd-ref">{{ project.report?.chapter }}</span>
        </div>
      </aside>

      <!-- ============ Content ============ -->
      <main class="content wd-scroll">
        <RouterView v-slot="{ Component }">
          <transition name="wd-page" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>

    <!-- Floating AI assistant (Zhipu GLM) -->
    <AiAssistant />
  </div>
</template>

<style scoped>
.shell {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ---------------- top bar ---------------- */
.topbar {
  height: var(--wd-topbar-h);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(180deg, rgba(11, 34, 71, 0.95), rgba(6, 21, 40, 0.9));
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  position: relative;
  z-index: 10;
}
.topbar::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--wd-primary), transparent);
  opacity: 0.5;
}
.topbar__left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.topbar__collapse {
  background: none;
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 6px;
  color: var(--wd-text-dim);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.topbar__collapse:hover {
  color: var(--wd-primary);
  border-color: var(--wd-primary);
}
.topbar__title {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.topbar__name {
  font-size: 17px;
  font-weight: 700;
  background: var(--wd-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
}
.topbar__sub {
  font-size: 10px;
  color: var(--wd-text-dim);
  letter-spacing: 1px;
}
.topbar__center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.topbar__breadcrumb {
  font-size: 16px;
  font-weight: 600;
  color: var(--wd-text);
  letter-spacing: 2px;
}
.topbar__right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.topbar__time {
  font-family: var(--wd-font-mono);
  font-size: 13px;
  color: var(--wd-primary);
}
.topbar__user {
  display: flex;
  align-items: center;
  gap: 8px;
}
.topbar__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--wd-gradient);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}
.topbar__username {
  font-size: 13px;
  color: var(--wd-text);
}
.topbar__logout {
  background: none;
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 5px;
  color: var(--wd-text-dim);
  font-size: 11px;
  padding: 3px 8px;
  transition: all 0.2s;
}
.topbar__logout:hover {
  color: var(--wd-danger);
  border-color: var(--wd-danger);
}

/* ---------------- main ---------------- */
.shell__main {
  flex: 1;
  display: flex;
  min-height: 0;
}

/* ---------------- nav ---------------- */
.nav {
  width: var(--wd-nav-w);
  flex-shrink: 0;
  background: rgba(6, 21, 40, 0.6);
  border-right: 1px solid rgba(0, 212, 255, 0.12);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease, margin 0.25s ease;
}
.nav--collapsed {
  width: 0;
  margin-left: -1px;
  overflow: hidden;
}
.nav__list {
  flex: 1;
  padding: 12px 8px;
}
.nav__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  margin-bottom: 2px;
  border-radius: 6px;
  color: var(--wd-text-dim);
  font-size: 13px;
  transition: all 0.18s;
  position: relative;
}
.nav__item:hover {
  color: var(--wd-text);
  background: rgba(0, 212, 255, 0.06);
}
.nav__item--active {
  color: var(--wd-primary);
  background: rgba(0, 212, 255, 0.1);
  font-weight: 600;
}
.nav__item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--wd-gradient);
  border-radius: 2px;
}
.nav__text {
  flex: 1;
}
.nav__ref {
  font-family: var(--wd-font-mono);
  font-size: 10px;
  opacity: 0.6;
}
.nav__group {
  margin-bottom: 4px;
}
.nav__children {
  padding-left: 16px;
}
.nav__item--child {
  padding: 7px 12px;
  font-size: 12.5px;
}
.nav__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--wd-text-dim);
  opacity: 0.5;
  transition: all 0.18s;
}
.nav__item--child.nav__item--active .nav__dot {
  background: var(--wd-primary);
  opacity: 1;
  box-shadow: 0 0 8px var(--wd-primary);
}
.nav__foot {
  padding: 10px 16px;
  border-top: 1px solid rgba(127, 168, 208, 0.08);
  text-align: center;
}

/* ---------------- content ---------------- */
.content {
  flex: 1;
  padding: 20px;
  min-width: 0;
}

/* page transition */
.wd-page-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.wd-page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
</style>
