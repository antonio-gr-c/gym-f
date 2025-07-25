<template>
  <div class="app-wrapper">
    <Navbar v-if="mostrarLayout" class="sidebar-fixed" />
    <main :class="['main-content', { 'with-sidebar': mostrarLayout }]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'


const route = useRoute()

const mostrarLayout = computed(() => {
  return !['/login', '/check-in'].includes(route.path)
})
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
}

.sidebar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  z-index: 2000;
  box-shadow: 2px 0 8px rgba(0,0,0,0.08);
}



.main-content {
  flex: 1 0 auto;
  min-height: 400px;
  padding-bottom: 2rem;
  width: 80%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.with-sidebar {
  margin-left: 240px;
}

@media (max-width: 991px) {
  .sidebar-fixed {
    width: 70px;
  }
  .with-sidebar {
    margin-left: 70px;
  }
}
</style>
