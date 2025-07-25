<template>
  <div class="sidebar">
    <div class="logo-container">
      <router-link to="/" class="logo-link">
        <img :src="logo" alt="Logo" class="logo-sidebar" />
      </router-link>
    </div>

    <ul class="menu-list">
      <li v-for="item in menu" :key="item.nombre" class="menu-item">
        <router-link :to="item.ruta" class="menu-link" active-class="active-link">
          <i class="material-icons me-2">{{ item.icono }}</i>
          <span>{{ item.nombre }}</span>
        </router-link>
      </li>
    </ul>

    <div class="bottom-link">
      <router-link to="/login" class="menu-link">
        <i class="material-icons">logout</i>
        
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import logo from '../assets/images/logo.png'

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
</script>
<style scoped>
@import '../assets/colors.css';

.sidebar {
  width: 240px;
  height: 100vh;
  background-color: #0f111a; /* Color de fondo oscuro */
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
}

.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-sidebar {
  width: 60px;
  height: 60px;
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
}

.bottom-link {
  padding-top: 2rem;
  border-top: 1px solid #333;
}
</style>
