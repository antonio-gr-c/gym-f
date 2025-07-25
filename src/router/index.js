import { createRouter, createWebHistory } from 'vue-router'

import login from '../views/login.vue'
import landing     from '../views/admin.vue'
import Navbar from '../components/Navbar.vue'



const CheckIn = () => import('../views/CheckIn.vue');
const Clientes = () => import('../views/Clientes.vue');
const Entrenadores = () => import('../views/Entrenadores.vue');
const Ventas = () => import('../views/Ventas.vue');
const Paquetes = () => import('../views/Paquetes.vue');
const Productos = () => import('../views/Productos.vue');
const Servicios = () => import('../views/Servicios.vue');
const Promociones = () => import('../views/Promociones.vue');

const routes = [
  { path: '/',          redirect: '/admin' },
  { path: '/admin',     component: landing },
  { path: '/navbar',    component: Navbar },
  { path: '/login',     component: login },
  { path: '/check-in',  component: CheckIn },
  { path: '/clientes',  component: Clientes },
  { path: '/entrenadores', component: Entrenadores },
  { path: '/ventas',    component: Ventas },
  { path: '/paquetes',  component: Paquetes },
  { path: '/productos', component: Productos },
  { path: '/servicios', component: Servicios },
  { path: '/promociones', component: Promociones },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router
