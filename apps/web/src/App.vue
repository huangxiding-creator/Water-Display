<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition name="wd-route" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<style>
.wd-route-enter-active,
.wd-route-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.wd-route-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.wd-route-leave-to {
  opacity: 0;
}
</style>
