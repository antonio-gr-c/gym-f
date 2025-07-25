<template>
  <div class="contenido-principal">
    <div class="container mt-4">
      <!-- Encabezado -->
      <div class="encabezado-dashboard d-flex flex-wrap justify-content-between align-items-center p-3 mb-4">
        <div class="saludo">
          <h4 class="m-0">Clientes</h4>
        </div>
        <div class="reloj text-end">
          <p class="m-0">{{ fechaFormateada }}</p>
          <p class="m-0">{{ horaFormateada }}</p>
        </div>
      </div>


      <!-- Filtros y botón agregar cliente -->
      <div class="card tarjeta-kpi p-4 mb-4">
        <h5 class="mb-3 d-flex align-items-center">
          <i class="material-icons me-2">group</i>
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
              <input type="text" class="form-control" placeholder="Buscar cliente..." v-model="terminoBusqueda" @input="filtrarClientes" />
              <button class="btn btn-outline-secondary" @click="terminoBusqueda = ''; filtrarClientes()">
                <i class="material-icons">clear</i>
              </button>
            </div>
            <button class="btn btn-success" @click="abrirModalCliente">
              <i class="material-icons me-1">person_add</i>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal para agregar cliente -->
      <div class="modal fade" id="modalAgregarCliente" tabindex="-1" aria-labelledby="modalAgregarClienteLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalAgregarClienteLabel">Agregar nuevo cliente</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <input v-model="nuevoCliente.nombre" type="text" class="form-control" placeholder="Nombre(s)" />
                </div>
                <div class="col-md-6 mb-3">
                  <input v-model="nuevoCliente.apellidoPaterno" type="text" class="form-control" placeholder="Apellido paterno" />
                </div>
                <div class="col-md-6 mb-3">
                  <input v-model="nuevoCliente.apellidoMaterno" type="text" class="form-control" placeholder="Apellido materno" />
                </div>
                <div class="col-md-6 mb-3">
                  <input v-model="nuevoCliente.edad" type="number" class="form-control" placeholder="Edad" min="0" />
                </div>
                <div class="col-md-12 mb-3">
                  <input v-model="nuevoCliente.telefono" type="tel" class="form-control" placeholder="Teléfono" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" @click="agregarClienteModal">Agregar Cliente</button>
            </div>
          </div>
        </div>
      </div>

      

<!-- Tabla -->
<div class="card tarjeta-tabla p-4">
  <h5 class="mb-3 d-flex align-items-center">
    <i class="material-icons me-2">table_view</i>
    Listado de clientes
  </h5>
  <div class="tabla-scroll">
    <table class="table table-hover tabla-clientes mb-0">
      <thead>
        <tr>
          <th>Nombre completo</th>
          <th>Edad</th>
          <th>Teléfono</th>
          <th>Tipo de suscripción</th>
          <th>Entrenador</th>
          <th>Plan</th>
          <th>Días restantes</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientesOrdenados" :key="cliente.id">
          <td class="td-nombre">{{ cliente.nombre }} {{ cliente.apellidoPaterno }} {{ cliente.apellidoMaterno }}</td>
          <td class="td-edad">{{ cliente.edad }}</td>
          <td class="td-telefono">{{ cliente.telefono }}</td>
          <td class="td-suscripcion">{{ cliente.suscripcion || 'No especificado' }}</td>
          <td class="td-entrenador">{{ cliente.entrenador || 'No asignado' }}</td>
          <td class="td-plan">{{ cliente.plan || 'No especificado' }}</td>
          <td class="td-dias">
            <span
              :class="{
                'dias-verde': cliente.diasRestantes > 10,
                'dias-amarillo': cliente.diasRestantes > 5 && cliente.diasRestantes <= 10,
                'dias-rojo': cliente.diasRestantes <= 5,
                'dias-centro': true
              }"
            >
              {{ cliente.diasRestantes !== undefined ? cliente.diasRestantes : 'N/A' }}
            </span>
          </td>
          <td class="td-acciones">
            <div class="acciones-btns d-flex gap-1 justify-content-center">
              <button class="btn btn-sm btn-outline-primary" title="Ver" @click="verDetalle(cliente)">
                <i class="material-icons">visibility</i>
              </button>
              <button class="btn btn-sm btn-outline-warning" title="Editar" @click="editarCliente(cliente)">
                <i class="material-icons">edit</i>
              </button>
              <button class="btn btn-sm btn-outline-danger" title="Eliminar" @click="eliminarCliente(cliente.id)">
                <i class="material-icons">delete</i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="clientesOrdenados.length === 0">
          <td colspan="8" class="text-center text-muted">No hay clientes encontrados.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


   

      <!-- Detalle master-detail fuera del listado -->
      <div v-if="clienteDetalle" class="card tarjeta-tabla p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="mb-0">Detalle de cliente</h5>
          <button class="btn btn-sm btn-outline-secondary" @click="cancelarEdicionDetalle" title="Cerrar"><i class="material-icons">close</i></button>
        </div>
        <form v-if="editandoDetalle" @submit.prevent="guardarEdicionDetalle">
          <div class="row">
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Nombre(s):</b></label>
              <input v-model="clienteDetalle.nombre" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Apellido paterno:</b></label>
              <input v-model="clienteDetalle.apellidoPaterno" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Apellido materno:</b></label>
              <input v-model="clienteDetalle.apellidoMaterno" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Edad:</b></label>
              <input v-model="clienteDetalle.edad" type="number" class="form-control" min="0" />
            </div>
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Teléfono:</b></label>
              <input v-model="clienteDetalle.telefono" type="tel" class="form-control" />
            </div>
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Tipo de suscripción:</b></label>
              <input v-model="clienteDetalle.suscripcion" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Entrenador:</b></label>
              <input v-model="clienteDetalle.entrenador" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Plan:</b></label>
              <input v-model="clienteDetalle.plan" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Días restantes:</b></label>
              <input v-model="clienteDetalle.diasRestantes" type="number" class="form-control" min="0" />
            </div>
          </div>
          <div class="text-end mt-3">
            <button type="submit" class="btn btn-success me-2">Guardar cambios</button>
            <button type="button" class="btn btn-secondary" @click="editandoDetalle = false">Cancelar</button>
          </div>
        </form>
        <div v-else class="row">
          <div class="col-md-4 mb-2"><b>Nombre(s):</b> {{ clienteDetalle.nombre }}</div>
          <div class="col-md-4 mb-2"><b>Apellido paterno:</b> {{ clienteDetalle.apellidoPaterno }}</div>
          <div class="col-md-4 mb-2"><b>Apellido materno:</b> {{ clienteDetalle.apellidoMaterno }}</div>
          <div class="col-md-4 mb-2"><b>Edad:</b> {{ clienteDetalle.edad }}</div>
          <div class="col-md-4 mb-2"><b>Teléfono:</b> {{ clienteDetalle.telefono }}</div>
          <div class="col-md-4 mb-2"><b>Tipo de suscripción:</b> {{ clienteDetalle.suscripcion || 'No especificado' }}</div>
          <div class="col-md-4 mb-2"><b>Entrenador:</b> {{ clienteDetalle.entrenador || 'No asignado' }}</div>
          <div class="col-md-4 mb-2"><b>Plan:</b> {{ clienteDetalle.plan || 'No especificado' }}</div>
          <div class="col-md-4 mb-2"><b>Días restantes:</b> {{ clienteDetalle.diasRestantes !== undefined ? clienteDetalle.diasRestantes : 'N/A' }}</div>
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


function verDetalle(cliente) {
  clienteDetalle.value = {
    ...cliente
  }
  editandoDetalle.value = false
}

function editarCliente(cliente) {
  clienteDetalle.value = {
    ...cliente
  }
  editandoDetalle.value = true
}

async function guardarEdicionDetalle() {
  if (!clienteDetalle.value.nombre || !clienteDetalle.value.apellidoPaterno || !clienteDetalle.value.apellidoMaterno || !clienteDetalle.value.edad || !clienteDetalle.value.telefono) {
    await Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos.' })
    return
  }
  const idx = clientes.value.findIndex(c => c.id === clienteDetalle.value.id)
  if (idx !== -1) {
    clientes.value[idx] = { ...clienteDetalle.value }
    await Swal.fire({ icon: 'success', title: 'Cliente actualizado', showConfirmButton: false, timer: 1200 })
  }
  editandoDetalle.value = false
  clienteDetalle.value = null
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

function agregarClienteModal() {
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
  // Cerrar modal
  const modal = document.getElementById('modalAgregarCliente')
  if (modal) {
    window.bootstrap.Modal.getInstance(modal).hide()
  }
}
import { ref, computed, onMounted, onUnmounted } from 'vue'

const terminoBusqueda = ref('')
const filtroActivo = ref('activos')

const nuevoCliente = ref({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  edad: '',
  telefono: ''
})

const clientes = ref([
  { id: 1, nombre: 'Ana', apellidoPaterno: 'Torres', apellidoMaterno: '', edad: 25, telefono: '5551234567', activo: true, suscripcion: 'Mensual', entrenador: 'Marcos', plan: 'Básico', diasRestantes: 12 },
  { id: 2, nombre: 'Carlos', apellidoPaterno: 'Ruiz', apellidoMaterno: '', edad: 30, telefono: '5558889999', activo: false, suscripcion: 'Trimestral', entrenador: 'Lucía', plan: 'Premium', diasRestantes: 0 },
  { id: 3, nombre: 'Lucía', apellidoPaterno: 'Gómez', apellidoMaterno: '', edad: 27, telefono: '5552223333', activo: true, suscripcion: 'Mensual', entrenador: 'Daniel', plan: 'Básico', diasRestantes: 7 }
])

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
  }).then(result => {
    if (result.isConfirmed) {
      clientes.value = clientes.value.filter(c => c.id !== id)
      // Cerrar master-detail si el cliente eliminado estaba abierto
      if (clienteDetalle.value && clienteDetalle.value.id === id) {
        clienteDetalle.value = null
        editandoDetalle.value = false
      }
      Swal.fire({ icon: 'success', title: 'Cliente eliminado', showConfirmButton: false, timer: 1200 })
    }
  })
}

const tituloLista = computed(() => {
  switch(filtroActivo.value) {
    case 'activos': return 'Clientes Activos'
    case 'inactivos': return 'Clientes Inactivos'
    case 'todos': return 'Todos los Clientes'
    default: return 'Clientes'
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
