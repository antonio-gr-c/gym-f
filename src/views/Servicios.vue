<template>
  <div class="contenido-principal">
    <div class="container mt-4">
      <!-- Encabezado -->
      <div class="encabezado-dashboard d-flex flex-wrap justify-content-between align-items-center p-3 mb-4">
        <div class="saludo">
          <h4 class="m-0">Servicios</h4>
        </div>
        <div class="reloj text-end">
          <p class="m-0">{{ fechaFormateada }}</p>
          <p class="m-0">{{ horaFormateada }}</p>
        </div>
      </div>
    

      <!-- Filtros y botón agregar servicio -->
      <div class="card tarjeta-kpi p-4 mb-4">
        <h5 class="mb-3 d-flex align-items-center">
          <i class="material-icons me-2">inventory_2</i>
          {{ tituloLista }}
        </h5>
        <div class="row align-items-center">
          <div class="col-md-4 mb-2">
            <div class="btn-group" role="group">
              <button 
                v-for="filtro in filtros" 
                :key="filtro.valor"
                class="btn"
                :class="filtroActivo === filtro.valor ? `btn-${filtro.color}` : `btn-outline-${filtro.color}`"
                @click="cambiarFiltro(filtro.valor)"
              >
                {{ filtro.texto }}
              </button>
            </div>
          </div>
          <div class="col-md-8 mb-2 d-flex align-items-center justify-content-end">
            <div class="input-group me-2">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Buscar servicio..." 
                v-model="terminoBusqueda" 
                @input="filtrarServicios" 
              />
              <button class="btn btn-outline-secondary" @click="limpiarBusqueda">
                <i class="material-icons">clear</i>
              </button>
            </div>
            <button class="btn btn-success" @click="abrirModalServicio">
              <i class="material-icons me-1">add_box</i> Nuevo
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla de servicios -->
      <div class="card tarjeta-tabla p-4">
        <h5 class="mb-3 d-flex align-items-center">
          <i class="material-icons me-2">table_view</i>
          Listado de servicios
        </h5>
        <div class="tabla-scroll">
          <table class="table table-hover tabla-clientes mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Costo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="servicio in serviciosFiltrados" :key="servicio.id">
                <td>{{ servicio.id_servicio }}</td>
                <td>{{ servicio.nombre }}</td>
                <td>${{ Number(servicio.costo).toFixed(2) }}</td>
                <td>
                  <span :class="`badge bg-${servicio.activo ? 'success' : 'secondary'}`">
                    {{ servicio.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="td-acciones">
                  <div class="acciones-btns d-flex gap-1 justify-content-center">
                    <button 
                      class="btn btn-sm btn-outline-warning" 
                      title="Editar" 
                      @click="editarServicio(servicio)"
                    >
                      <i class="material-icons">edit</i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      title="Eliminar" 
                      @click="cambiarEstadoServicio(servicio.id)"
                    >
                      <i class="material-icons">{{ servicio.activo ? 'toggle_off' : 'toggle_on' }}</i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="serviciosFiltrados.length === 0">
                <td colspan="5" class="text-center text-muted">No hay servicios encontrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sección de servicios vendidos con paginación -->
      <div class="card tarjeta-tabla p-4 mt-4">
        <h5 class="mb-3 d-flex align-items-center">
          <i class="material-icons me-2">event_available</i>
          Servicios vendidos y agendados
        </h5>
        <div class="tabla-scroll">
          <table class="table table-hover tabla-clientes mb-0">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Cliente</th>
                <th>Fecha de venta</th>
                <th>Fecha agendada</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="venta in ventasPaginadas" :key="venta.id_venta">
                <td>{{ venta.nombre_servicio }}</td>
                <td>{{ venta.nombre_cliente || 'No asignado' }}</td>
                <td>{{ formatearFecha(venta.fecha) }}</td>
                <td>{{ venta.fecha_agendada ? formatearFechaSoloDia(venta.fecha_agendada) : 'Inmediato' }}</td>
                <td>${{ Number(venta.precio).toFixed(2) }}</td>
                <td>{{ venta.cantidad }}</td>
                <td>${{ Number(venta.total).toFixed(2) }}</td>
              </tr>
              <tr v-if="serviciosVendidos.length === 0">
                <td colspan="7" class="text-center text-muted">No hay servicios vendidos/agendados para mostrar.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Controles de paginación -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <button class="btn btn-outline-light" :disabled="paginaActual === 1" @click="paginaActual--">
            <i class="material-icons">chevron_left</i> Anterior
          </button>
          <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
          <button class="btn btn-outline-light" :disabled="paginaActual === totalPaginas" @click="paginaActual++">
            Siguiente <i class="material-icons">chevron_right</i>
          </button>
        </div>
      </div>

      <!-- Modal para agregar/editar servicio -->
      <div class="modal fade" id="modalServicio" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ modalTitulo }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarServicio">
                <div class="mb-3">
                  <label class="form-label">Nombre del servicio</label>
                  <input 
                    v-model="servicioForm.nombre" 
                    type="text" 
                    class="form-control" 
                    required 
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Costo</label>
                  <input 
                    v-model.number="servicioForm.costo" 
                    type="number" 
                    class="form-control" 
                    min="0" 
                    step="0.01" 
                    required 
                  />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" class="btn btn-success">
                    {{ servicioForm.id ? 'Actualizar' : 'Guardar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Swal from 'sweetalert2'

// Estado reactivo
const serviciosVendidos = ref([])
const servicios = ref([])
const terminoBusqueda = ref('')
const filtroActivo = ref('activos')
const fechaFormateada = ref('')
const horaFormateada = ref('')
const servicioForm = ref({
  id: null,
  nombre: '',
  costo: '',
  activo: true
})

// Paginación para servicios vendidos
const paginaActual = ref(1)
const ventasPorPagina = 10
const totalPaginas = computed(() => {
  return Math.max(1, Math.ceil(serviciosVendidos.value.length / ventasPorPagina))
})
const ventasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * ventasPorPagina
  return serviciosVendidos.value.slice(inicio, inicio + ventasPorPagina)
})

// Resetear página si cambia la data
watch(serviciosVendidos, () => {
  paginaActual.value = 1
})

// Constantes
const filtros = [
  { valor: 'activos', texto: 'Activos', color: 'primary' },
  { valor: 'inactivos', texto: 'Inactivos', color: 'secondary' },
  { valor: 'todos', texto: 'Todos', color: 'info' }
]

// Computed
const tituloLista = computed(() => {
  return filtros.find(f => f.valor === filtroActivo.value)?.texto + ' Servicios'
})

const modalTitulo = computed(() => {
  return servicioForm.value.id ? 'Editar Servicio' : 'Nuevo Servicio'
})

const serviciosFiltrados = computed(() => {
  let resultado = [...servicios.value]
  
  // Aplicar filtro de estado
  if (filtroActivo.value === 'activos') {
    resultado = resultado.filter(s => s.activo)
  } else if (filtroActivo.value === 'inactivos') {
    resultado = resultado.filter(s => !s.activo)
  }
  
  // Aplicar filtro de búsqueda
  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.toLowerCase()
    resultado = resultado.filter(s => 
      s.nombre.toLowerCase().includes(termino) ||
      (s.id_servicio && s.id_servicio.toString().includes(termino))
    )
  }
  
  return resultado
})

// Métodos
function formatearFecha(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatearFechaSoloDia(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function actualizarFechaHora() {
  const ahora = new Date()
  fechaFormateada.value = ahora.toLocaleDateString('es-MX', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
  horaFormateada.value = ahora.toLocaleTimeString('es-MX', { hour12: false })
}

function cambiarFiltro(tipo) {
  filtroActivo.value = tipo
}

function limpiarBusqueda() {
  terminoBusqueda.value = ''
}

function filtrarServicios() {
  // La búsqueda se maneja automáticamente con el computed
}

async function cargarServiciosVendidos() {
  try {
    const response = await fetch('http://localhost:8080/backend/public/api/gym/ventas/servicios')
    if (!response.ok) throw new Error('Error al cargar servicios vendidos')
    serviciosVendidos.value = await response.json()
  } catch (error) {
    mostrarError('No se pudo cargar el historial de servicios vendidos', error)
  }
}

async function cargarServicios() {
  try {
    const response = await fetch('http://localhost:8080/backend/public/api/gym/servicios')
    if (!response.ok) throw new Error('Error al cargar servicios')
    servicios.value = await response.json()
  } catch (error) {
    mostrarError('No se pudo cargar la lista de servicios', error)
  }
}

function abrirModalServicio(servicio = null) {
  servicioForm.value = servicio 
    ? { ...servicio } 
    : { id: null, nombre: '', costo: '', activo: true }
  
  const modal = new bootstrap.Modal(document.getElementById('modalServicio'))
  modal.show()
}

async function guardarServicio() {
  try {
    const url = servicioForm.value.id
      ? `http://localhost:8080/backend/public/api/gym/servicios/${servicioForm.value.id}`
      : 'http://localhost:8080/backend/public/api/gym/servicios'
    
    const method = servicioForm.value.id ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: servicioForm.value.nombre,
        costo: servicioForm.value.costo,
        activo: servicioForm.value.activo
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al guardar el servicio')
    }
    
    await Swal.fire({
      icon: 'success',
      title: servicioForm.value.id ? 'Servicio actualizado' : 'Servicio creado',
      showConfirmButton: false,
      timer: 1500
    })
    
    document.getElementById('modalServicio').querySelector('.btn-close').click()
    await cargarServicios()
  } catch (error) {
    mostrarError('Error al guardar el servicio', error)
  }
}

async function cambiarEstadoServicio(id) {
  try {
    const servicio = servicios.value.find(s => s.id === id)
    if (!servicio) return
    
    const result = await Swal.fire({
      title: `¿${servicio.activo ? 'Desactivar' : 'Activar'} servicio?`,
      text: `Estás a punto de ${servicio.activo ? 'desactivar' : 'activar'} este servicio`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${servicio.activo ? 'desactivar' : 'activar'}`,
      cancelButtonText: 'Cancelar'
    })
    
    if (!result.isConfirmed) return
    
    const response = await fetch(`http://localhost:8080/backend/public/api/gym/servicios/estado/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al cambiar estado')
    }
    
    await cargarServicios()
    Swal.fire({
      icon: 'success',
      title: 'Estado actualizado',
      showConfirmButton: false,
      timer: 1500
    })
  } catch (error) {
    mostrarError('Error al cambiar estado del servicio', error)
  }
}

function mostrarError(titulo, error) {
  console.error(error)
  Swal.fire({
    icon: 'error',
    title: titulo,
    text: error.message || 'Error desconocido',
    timer: 3000
  })
}

// Ciclo de vida
let intervaloReloj = null

onMounted(() => {
  actualizarFechaHora()
  intervaloReloj = setInterval(actualizarFechaHora, 1000)
  cargarServicios()
  cargarServiciosVendidos()
})

onUnmounted(() => {
  if (intervaloReloj) clearInterval(intervaloReloj)
})
</script>

<style scoped>
@import '../assets/colors.css';

.contenido-principal {
  background-color: #fff;
  min-height: 100vh;
}

.encabezado-dashboard {
  background-color: var(--ambar-intenso);
  border-radius: 8px;
  font-family: 'Nunito Sans', sans-serif;
}

.saludo h4 {
  color: var(--blanco);
  font-weight: 700;
}

.saludo .rol {
  font-size: 0.9rem;
  font-weight: normal;
  color: var(--claro-suave);
}

.reloj {
  color: var(--claro-suave);
}

.tarjeta-kpi {
  background-color: var(--claro-suave);
  border-left: 5px solid var(--ambar-intenso);
  border-radius: 8px;
  color: var(--negro-profundo);
  transition: transform 0.2s ease;
}

.tarjeta-kpi:hover {
  transform: scale(1.02);
}

.tarjeta-tabla {
  background-color: var(--ambar-intenso);
  color: var(--blanco);
  border-radius: 10px;
}

.tabla-scroll {
  background-color: var(--blanco);
  border-radius: 6px;
  padding: 0.5rem;
  overflow-x: auto;
  color: var(--negro);
}

.material-icons {
  vertical-align: middle;
  font-size: 1.2em;
}
.tabla-clientes th, .tabla-clientes td {
  padding: 0.35rem 0.3rem !important;
  vertical-align: middle !important;
  white-space: nowrap;
}
.tabla-clientes {
  font-size: 1rem;
  border-radius: 8px;
}
.td-nombre, .td-edad, .td-dias, .td-telefono, .td-suscripcion, .td-entrenador, .td-plan {
  vertical-align: middle;
  white-space: nowrap;
}
.dias-verde {
  color: #2ecc40;
  font-weight: bold;
}
.dias-amarillo {
  color: #e6b800;
  font-weight: bold;
}
.dias-rojo {
  color: #ff4d4f;
  font-weight: bold;
}
.dias-centro {
  display: inline-block;
  width: 100%;
  text-align: center;
}
.td-acciones {
  width: 1%;
  vertical-align: middle;
}
.acciones-btns button {
  min-width: 32px;
  padding: 0.3rem 0.5rem;
}
.acciones-btns {
  gap: 0.3rem !important;
}
</style>
