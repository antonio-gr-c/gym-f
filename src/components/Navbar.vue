<template>
  <div>
    <!-- Botón de hamburguesa para móviles -->
    <button class="hamburger-btn" @click="toggleSidebar" v-if="isMobile">
      <i class="material-icons">{{ isSidebarOpen ? 'close' : 'menu' }}</i>
    </button>

    <!-- Sidebar/Navbar -->
    <div class="sidebar" :class="{ 'mobile-open': isSidebarOpen, 'mobile-hidden': !isSidebarOpen && isMobile }">
      <div class="logo-container">
        <router-link to="/" class="logo-link" @click="closeSidebarOnMobile">
          <img :src="logo" alt="Logo" class="logo-sidebar" />
        </router-link>
      </div>

      <ul class="menu-list">
        <li v-for="item in menu" :key="item.nombre" class="menu-item">
          <router-link 
            :to="item.ruta" 
            class="menu-link" 
            active-class="active-link"
            @click="closeSidebarOnMobile"
          >
            <i class="material-icons me-2">{{ item.icono }}</i>
            <span class="menu-text">{{ item.nombre }}</span>
          </router-link>
        </li>
      </ul>

      <div class="bottom-link">
        <router-link to="/login" class="menu-link" @click="closeSidebarOnMobile">
          <i class="material-icons">logout</i>
          <span class="menu-text">Salir</span>
        </router-link>
      </div>
    </div>

    <!-- Overlay para móviles -->
    <div 
      class="sidebar-overlay" 
      v-if="isMobile && isSidebarOpen" 
      @click="toggleSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import logo from '../assets/images/logo.jpg'

const menu = ref([
  { nombre: 'Administración', ruta: '/admin', icono: 'admin_panel_settings' },
  { nombre: 'Check-in', ruta: '/check-in', icono: 'how_to_reg' },
  { nombre: 'Clientes', ruta: '/clientes', icono: 'people' },
  { nombre: 'Ventas', ruta: '/ventas', icono: 'point_of_sale' },
  { nombre: 'Paquetes', ruta: '/paquetes', icono: 'card_giftcard' },
  { nombre: 'Productos', ruta: '/productos', icono: 'shopping_bag' },
  { nombre: 'Servicios', ruta: '/servicios', icono: 'miscellaneous_services' },
  { nombre: 'Promociones', ruta: '/promociones', icono: 'local_offer' }
])

const isMobile = ref(false)
const isSidebarOpen = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    isSidebarOpen.value = true
  }
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebarOnMobile = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
@import '../assets/colors.css';

.sidebar {
  width: 240px;
  height: 100vh;
  background-color: #000000;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: transform 0.3s ease;
}

.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-sidebar {
  width: 90px;
  height: 90px;
  object-fit: contain;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.menu-item {
  margin-bottom: 1rem;
}

.menu-link {
  display: flex;
  align-items: center;
  color: #bbb;
  text-decoration: none;
  font-weight: 500;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  transition: background 0.3s, color 0.3s;
}

.menu-link:hover,
.menu-link.active-link {
  background-color: #1a1d2b;
  color: #fff;
}

.material-icons {
  font-size: 20px;
  min-width: 24px;
}

.bottom-link {
  padding-top: 2rem;
  border-top: 1px solid #333;
}

.menu-text {
  transition: opacity 0.3s;
}

.hamburger-btn {
  position: fixed;
  top: 10px;
  left: 10px;
  background: #1a1d2b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px;
  z-index: 1100;
  cursor: pointer;
  display: none;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Responsive styles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .hamburger-btn {
    display: block;
  }
  
  .menu-text {
    opacity: 1;
  }
}

@media (min-width: 769px) {
  .sidebar {
    transform: translateX(0) !important;
  }
}
</style>