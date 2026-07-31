<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { project } from '@/data/project'
import LogoMark from '@/components/LogoMark.vue'

const router = useRouter()
const username = ref('admin')
const password = ref('')
const loading = ref(false)

function login() {
  loading.value = true
  // Demo auth — this is a showcase platform, not a real system.
  sessionStorage.setItem('wd-authed', '1')
  setTimeout(() => router.push('/'), 400)
}
</script>

<template>
  <div class="login">
    <!-- Animated tech background -->
    <div class="login__bg">
      <div class="login__grid" />
      <div class="login__orb login__orb--1" />
      <div class="login__orb login__orb--2" />
    </div>

    <div class="login__card wd-fade-in">
      <div class="login__brand">
        <LogoMark :mark="project.brand.logo.mark" :size="64" />
        <h1 class="login__title">{{ project.brand.systemName }}</h1>
        <p v-if="project.brand.tagline" class="login__tagline">{{ project.brand.tagline }}</p>
      </div>

      <form class="login__form" @submit.prevent="login">
        <label class="field">
          <span class="field__label">账号</span>
          <input v-model="username" class="field__input" type="text" autocomplete="username" />
        </label>
        <label class="field">
          <span class="field__label">密码</span>
          <input v-model="password" class="field__input" type="password" autocomplete="current-password" placeholder="演示无需密码" />
        </label>
        <button class="login__btn" type="submit" :disabled="loading">
          {{ loading ? '进入中…' : '进入平台' }}
        </button>
        <p class="login__hint">演示平台 · 任意账号即可进入 · 非真实生产系统</p>
      </form>

      <div class="login__foot">
        <span v-if="project.brand.owner">{{ project.brand.owner }}</span>
        <span v-if="project.brand.designer">报告编制：{{ project.brand.designer }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(0, 102, 255, 0.25), transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.18), transparent 50%),
    var(--wd-bg);
}
.login__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
}
.login__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
}
.login__orb--1 {
  width: 400px;
  height: 400px;
  background: var(--wd-primary-deep);
  top: -100px;
  left: -100px;
  animation: float1 12s ease-in-out infinite;
}
.login__orb--2 {
  width: 300px;
  height: 300px;
  background: var(--wd-primary);
  bottom: -80px;
  right: -60px;
  animation: float2 15s ease-in-out infinite;
}
@keyframes float1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(60px, 40px); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-50px, -60px); }
}

.login__card {
  position: relative;
  z-index: 1;
  width: 380px;
  padding: 36px 32px 24px;
  background: linear-gradient(160deg, rgba(11, 34, 71, 0.92), rgba(6, 21, 40, 0.88));
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 16px;
  backdrop-filter: blur(16px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(0, 212, 255, 0.15);
}
.login__brand {
  text-align: center;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.login__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  background: var(--wd-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
}
.login__tagline {
  margin: 0;
  font-size: 12px;
  color: var(--wd-text-dim);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field__label {
  font-size: 12px;
  color: var(--wd-text-dim);
}
.field__input {
  padding: 10px 12px;
  background: rgba(6, 21, 40, 0.6);
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 8px;
  color: var(--wd-text);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.field__input:focus {
  border-color: var(--wd-primary);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.12);
}
.login__btn {
  margin-top: 6px;
  padding: 11px;
  border: none;
  border-radius: 8px;
  background: var(--wd-gradient);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  transition: transform 0.15s, box-shadow 0.2s;
}
.login__btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 102, 255, 0.4);
}
.login__btn:disabled {
  opacity: 0.6;
}
.login__hint {
  margin: 4px 0 0;
  font-size: 11px;
  color: var(--wd-text-dim);
  text-align: center;
  opacity: 0.7;
}
.login__foot {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(127, 168, 208, 0.1);
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: var(--wd-text-dim);
  text-align: center;
  opacity: 0.7;
  line-height: 1.5;
}
</style>
