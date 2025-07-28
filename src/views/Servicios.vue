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


      <!-- Filtros y botón agregar producto -->
      <div class="card tarjeta-kpi p-4 mb-4">
        <h5 class="mb-3 d-flex align-items-center">
          <i class="material-icons me-2">inventory_2</i>
          {{ tituloLista }}
        </h5>
        <div class="row align-items-center">
          <div class="col-md-4 mb-2">
            <div class="btn-group" role="group">
              <button class="btn" :class="filtroActivo === 'activos' ? 'btn-primary' : 'btn-outline-primary'" @click="cambiarFiltro('activos')">Activos</button>
              <button class="btn" :class="filtroActivo === 'inactivos' ? 'btn-secondary' : 'btn-outline-secondary'" @click="cambiarFiltro('inactivos')">Inactivos</button>
              <button class="btn" :class="filtroActivo === 'todos' ? 'btn-info' : 'btn-outline-info'" @click="cambiarFiltro('todos')">Todos</button>
            </div>
          </div>
          <div class="col-md-8 mb-2 d-flex align-items-center justify-content-end">
            <div class="input-group me-2">
              <input type="text" class="form-control" placeholder="Buscar servicio..." v-model="terminoBusqueda" @input="filtrarClientes" />
              <button class="btn btn-outline-secondary" @click="terminoBusqueda = ''; filtrarClientes()">
                <i class="material-icons">clear</i>
              </button>
            </div>
            <button class="btn btn-success" @click="abrirModalCliente">
              <i class="material-icons me-1">add_box</i>
            </button>
          </div>
        </div>
      </div>


      <!-- Modal para agregar servicio -->
      <div class="modal fade" id="modalAgregarCliente" tabindex="-1" aria-labelledby="modalAgregarClienteLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalAgregarClienteLabel">Agregar nuevo servicio</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <input v-model="nuevoCliente.nombre" type="text" class="form-control" placeholder="Nombre del servicio" />
                </div>
                <div class="col-md-12 mb-3">
                  <input v-model.number="nuevoCliente.costo" type="number" class="form-control" placeholder="Costo" min="0" step="0.01" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" @click="agregarClienteModal">Agregar Servicio</button>
            </div>
          </div>
        </div>
      </div>

      


<!-- Tabla de productos -->
<div class="card tarjeta-tabla p-4">
  <h5 class="mb-3 d-flex align-items-center">
    <i class="material-icons me-2">table_view</i>
    Listado de productos
  </h5>
  <div class="tabla-scroll">
    <table class="table table-hover tabla-clientes mb-0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Costo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in clientesOrdenados" :key="producto.id">
          <td>{{ producto.id }}</td>
          <td>{{ producto.nombre }}</td>
          <td>${{ Number(producto.costo).toFixed(2) }}</td>
          <td class="td-acciones">
            <div class="acciones-btns d-flex gap-1 justify-content-center">
              <button class="btn btn-sm btn-outline-warning" title="Editar" @click="editarCliente(producto)">
                <i class="material-icons">edit</i>
              </button>
              <button class="btn btn-sm btn-outline-danger" title="Eliminar" @click="eliminarCliente(producto.id)">
                <i class="material-icons">delete</i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="clientesOrdenados.length === 0">
          <td colspan="4" class="text-center text-muted">No hay servicios encontrados.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


   

      <!-- Detalle master-detail fuera del listado para servicios -->
      <div v-if="clienteDetalle" class="card tarjeta-tabla p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="mb-0">Detalle de servicio</h5>
          <button class="btn btn-sm btn-outline-secondary" @click="cancelarEdicionDetalle" title="Cerrar"><i class="material-icons">close</i></button>
        </div>
        <form v-if="editandoDetalle" @submit.prevent="guardarEdicionDetalle">
          <div class="row">
            <div class="col-md-6 mb-2">
              <label class="form-label"><b>Nombre:</b></label>
              <input v-model="clienteDetalle.nombre" type="text" class="form-control" />
            </div>
            <div class="col-md-6 mb-2">
              <label class="form-label"><b>Costo:</b></label>
              <input v-model.number="clienteDetalle.costo" type="number" class="form-control" min="0" step="0.01" />
            </div>
          </div>
          <div class="text-end mt-3">
            <button type="submit" class="btn btn-success me-2">Guardar cambios</button>
            <button type="button" class="btn btn-secondary" @click="editandoDetalle = false">Cancelar</button>
          </div>
        </form>
        <div v-else class="row">
          <div class="col-md-6 mb-2"><b>Nombre:</b> {{ clienteDetalle.nombre }}</div>
          <div class="col-md-6 mb-2"><b>Costo:</b> ${{ Number(clienteDetalle.costo).toFixed(2) }}</div>
        </div>
      </div>
    </div> <!-- cierra container -->
  </div> <!-- cierra contenido-principal -->
</template>

<script setup>
import Swal from 'sweetalert2'


// Estado para el detalle master-detail editable
const clienteDetalle = ref(null)
const editandoDetalle = ref(false)



function verDetalle(producto) {
  clienteDetalle.value = {
    ...producto
  }
  editandoDetalle.value = false
}

function editarCliente(producto) {
  clienteDetalle.value = {
    ...producto
  }
  editandoDetalle.value = true
}

async function guardarEdicionDetalle() {
  if (!clienteDetalle.value.nombre || clienteDetalle.value.costo === '' || clienteDetalle.value.costo === null) {
    await Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos.' })
    return
  }

  try {
    const response = await fetch(`http://localhost:8080/backend/public/api/gym/servicios/${clienteDetalle.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: clienteDetalle.value.nombre,
        costo: clienteDetalle.value.costo,
        activo: true // o false, según lo que tengas en el formulario o quieras conservar
      })
    })

    const data = await response.json()

    if (response.ok) {
      const idx = clientes.value.findIndex(p => p.id === clienteDetalle.value.id)
      if (idx !== -1) {
        clientes.value[idx] = {
          ...clientes.value[idx],
          nombre: clienteDetalle.value.nombre,
          costo: clienteDetalle.value.costo
        }
      }

      await Swal.fire({ icon: 'success', title: 'Servicio actualizado', showConfirmButton: false, timer: 1200 })
      editandoDetalle.value = false
      clienteDetalle.value = null
    } else {
      await Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'No se pudo actualizar el servicio.' })
    }
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Error de red', text: 'No se pudo conectar al servidor.' })
  }
}


function cancelarEdicionDetalle() {
  clienteDetalle.value = null
}

// Modal control
function abrirModalCliente() {
  const modal = document.getElementById('modalAgregarCliente')
  if (modal) {
    new window.bootstrap.Modal(modal).show()
  }
}

async function agregarClienteModal() {
  if (!nuevoCliente.value.nombre || nuevoCliente.value.costo === '' || nuevoCliente.value.costo === null) {
    Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos.' })
    return
  }
  try {
    const body = {
      nombre: nuevoCliente.value.nombre,
      costo: nuevoCliente.value.costo
    }
    const response = await fetch('http://localhost:8080/backend/public/api/gym/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'No se pudo agregar el servicio')
    }
    Swal.fire({ icon: 'success', title: 'Servicio agregado', showConfirmButton: false, timer: 1200 })
    nuevoCliente.value = {
      nombre: '',
      costo: ''
    }
    // Cerrar modal
    const modal = document.getElementById('modalAgregarCliente')
    if (modal) {
      window.bootstrap.Modal.getInstance(modal).hide()
    }
    // Refrescar la lista de servicios
    await cargarServicios()
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message || 'No se pudo agregar el servicio.' })
  }
}
import { ref, computed, onMounted, onUnmounted } from 'vue'

const terminoBusqueda = ref('')
const filtroActivo = ref('activos')

const nuevoCliente = ref({
  nombre: '',
  costo: ''
})


const clientes = ref([])

async function cargarServicios() {
  try {
    // Llamar al endpoint para actualizar días restantes antes de cargar la lista
    await fetch('http://localhost:8080/backend/public/api/gym/actualizar-dias-restantes', { method: 'GET' });
    const response = await fetch('http://localhost:8080/backend/public/api/gym/servicios')
    if (!response.ok) throw new Error('No se pudo obtener la lista de servicios')
    const servicios = await response.json()
    // Normalizar campos si es necesario
    clientes.value = servicios.map(s => ({
      id: s.id_servicio || s.id, // según cómo venga del backend
      nombre: s.nombre,
      costo: s.costo,
      activo: s.activo !== undefined ? !!s.activo : true
    }))
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la lista de servicios.' })
  }
}

const clientesOrdenados = computed(() => {
  let filtrados = [...clientes.value]
  if (filtroActivo.value === 'activos') filtrados = filtrados.filter(c => c.activo)
  else if (filtroActivo.value === 'inactivos') filtrados = filtrados.filter(c => !c.activo)

  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.toLowerCase()
    filtrados = filtrados.filter(c =>
      c.nombre.toLowerCase().includes(termino) ||
      c.telefono.includes(termino)
    )
  }
  return filtrados
})

const cambiarFiltro = tipo => filtroActivo.value = tipo
const filtrarClientes = () => {}

const agregarCliente = () => {
  if (!nuevoCliente.value.nombre || !nuevoCliente.value.apellidoPaterno || !nuevoCliente.value.apellidoMaterno || !nuevoCliente.value.edad || !nuevoCliente.value.telefono) {
    Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos.' })
    return
  }
  clientes.value.push({
    id: clientes.value.length ? Math.max(...clientes.value.map(c => c.id)) + 1 : 1,
    nombre: nuevoCliente.value.nombre,
    apellidoPaterno: nuevoCliente.value.apellidoPaterno,
    apellidoMaterno: nuevoCliente.value.apellidoMaterno,
    edad: nuevoCliente.value.edad,
    telefono: nuevoCliente.value.telefono,
    activo: true
  })
  Swal.fire({ icon: 'success', title: 'Cliente agregado', showConfirmButton: false, timer: 1200 })
  nuevoCliente.value = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: '',
    telefono: ''
  }
  mostrarFormulario.value = true
}

function eliminarCliente(id) {
  Swal.fire({
    title: '¿Seguro que deseas eliminar este cliente?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then(async result => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/backend/public/api/gym/servicios/estado/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()

        if (response.ok) {
          clientes.value = clientes.value.map(c =>
            c.id === id ? { ...c, activo: !c.activo } : c
          )
          if (clienteDetalle.value && clienteDetalle.value.id === id) {
            clienteDetalle.value = null
            editandoDetalle.value = false
          }
          Swal.fire({ icon: 'success', title: data.mensaje || 'Estado actualizado', showConfirmButton: false, timer: 1200 })
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'No se pudo actualizar el estado del cliente' })
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error de red', text: 'No se pudo conectar al servidor.' })
      }
    }
  })
}


const tituloLista = computed(() => {
  switch(filtroActivo.value) {
    case 'activos': return 'Servicios Activos'
    case 'inactivos': return 'Servicios Inactivos'
    case 'todos': return 'Todos los Servicios'
    default: return 'Servicios'
  }
})

const fechaFormateada = ref('')
const horaFormateada = ref('')
let intervalo = null

function actualizarFechaHora() {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const ahora = new Date()
  fechaFormateada.value = `${dias[ahora.getDay()]}, ${ahora.getDate()} de ${meses[ahora.getMonth()]} de ${ahora.getFullYear()}`
  horaFormateada.value = ahora.toLocaleTimeString('es-MX', { hour12: false })
}


onMounted(() => {
  actualizarFechaHora()
  intervalo = setInterval(actualizarFechaHora, 1000)
  cargarServicios()
})

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
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
