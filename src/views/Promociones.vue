<template>
  <div class="contenido-principal">
    <div class="container mt-4">
      <!-- Encabezado -->
      <div class="encabezado-dashboard d-flex flex-wrap justify-content-between align-items-center p-3 mb-4">
        <div class="saludo">
          <h4 class="m-0">Promociones</h4>
        </div>
        <div class="reloj text-end">
          <p class="m-0">{{ fechaFormateada }}</p>
          <p class="m-0">{{ horaFormateada }}</p>
        </div>
      </div>


      <!-- Filtros y botón agregar promoción -->
      <div class="card tarjeta-kpi p-4 mb-4">
        <h5 class="mb-3 d-flex align-items-center">
          <i class="material-icons me-2">local_offer</i>
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
              <input type="text" class="form-control" placeholder="Buscar promoción..." v-model="terminoBusqueda" @input="filtrarClientes" />
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

      <!-- Modal para agregar promoción -->
      <div class="modal fade" id="modalAgregarCliente" tabindex="-1" aria-labelledby="modalAgregarClienteLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalAgregarClienteLabel">Agregar nueva promoción</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <label class="form-label"><b>Nombre de la promoción</b></label>
                  <input v-model="nuevoCliente.nombre" type="text" class="form-control" placeholder="Ej. Mes del Amor" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label"><b>Descuento (%)</b></label>
                  <input v-model.number="nuevoCliente.descuento" type="number" class="form-control" min="1" max="100" placeholder="Ej. 20" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label"><b>Tipo de promoción</b></label>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="tipoProducto" value="producto" v-model="nuevoCliente.tipos" />
                    <label class="form-check-label" for="tipoProducto">Producto</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="tipoServicio" value="servicio" v-model="nuevoCliente.tipos" />
                    <label class="form-check-label" for="tipoServicio">Servicio</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="tipoPaquete" value="paquete" v-model="nuevoCliente.tipos" />
                    <label class="form-check-label" for="tipoPaquete">Paquete</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" @click="agregarClienteModal">Agregar Promoción</button>
            </div>
          </div>
        </div>
      </div>

      

<!-- Tabla -->
<div class="card tarjeta-tabla p-4">
  <h5 class="mb-3 d-flex align-items-center">
    <i class="material-icons me-2">table_view</i>
    Listado de promociones
  </h5>
  <div class="tabla-scroll">
    <table class="table table-hover tabla-clientes mb-0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Promoción</th>
          <th>Descuento</th>
          <th>Tipo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="promo in clientesOrdenados" :key="promo.id">
          <td>{{ promo.id }}</td>
          <td>{{ promo.nombre }}</td>
          <td>{{ promo.descuento }}%</td>
          <td>{{ promo.tipo }}</td>
          <td class="td-acciones">
            <div class="acciones-btns d-flex gap-1 justify-content-center">
              <button class="btn btn-sm btn-outline-warning" title="Editar" @click="editarCliente(promo)">
                <i class="material-icons">edit</i>
              </button>
              <button class="btn btn-sm btn-outline-danger" title="Eliminar" @click="eliminarCliente(promo.id)">
                <i class="material-icons">delete</i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="clientesOrdenados.length === 0">
          <td colspan="5" class="text-center text-muted">No hay promociones encontradas.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


   

      <!-- Detalle master-detail fuera del listado -->
      <div v-if="clienteDetalle" class="card tarjeta-tabla p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="mb-0">Detalle de promoción</h5>
          <button class="btn btn-sm btn-outline-secondary" @click="cancelarEdicionDetalle" title="Cerrar"><i class="material-icons">close</i></button>
        </div>
        <form v-if="editandoDetalle" @submit.prevent="guardarEdicionDetalle">
          <div class="row">
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Nombre de la promoción:</b></label>
              <input v-model="clienteDetalle.nombre" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Descuento (%):</b></label>
              <input v-model.number="clienteDetalle.descuento" type="number" class="form-control" min="1" max="100" />
            </div>
            <div class="col-md-4 mb-2">
              <label class="form-label"><b>Tipo de promoción</b></label>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="editTipoProducto" value="producto" v-model="clienteDetalle.tipos" />
                <label class="form-check-label" for="editTipoProducto">Producto</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="editTipoServicio" value="servicio" v-model="clienteDetalle.tipos" />
                <label class="form-check-label" for="editTipoServicio">Servicio</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="editTipoPaquete" value="paquete" v-model="clienteDetalle.tipos" />
                <label class="form-check-label" for="editTipoPaquete">Paquete</label>
              </div>
            </div>
          </div>
          <div class="text-end mt-3">
            <button type="submit" class="btn btn-success me-2">Guardar cambios</button>
            <button type="button" class="btn btn-secondary" @click="editandoDetalle = false">Cancelar</button>
          </div>
        </form>
        <div v-else class="row">
          <div class="col-md-4 mb-2"><b>Nombre:</b> {{ clienteDetalle.nombre }}</div>
          <div class="col-md-4 mb-2"><b>Descuento:</b> {{ clienteDetalle.descuento }}%</div>
          <div class="col-md-4 mb-2"><b>Tipo:</b> {{ clienteDetalle.tipo }}</div>
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
  // Asegurarse de que tipos sea un array de los tipos activos
  let tipos = []
  if (cliente.producto || (cliente.tipo && cliente.tipo.includes('producto'))) tipos.push('producto')
  if (cliente.servicio || (cliente.tipo && cliente.tipo.includes('servicio'))) tipos.push('servicio')
  if (cliente.paquete || (cliente.tipo && cliente.tipo.includes('paquete'))) tipos.push('paquete')
  clienteDetalle.value = {
    ...cliente,
    tipos
  }
  editandoDetalle.value = true
}

async function guardarEdicionDetalle() {
  if (!clienteDetalle.value.nombre || !clienteDetalle.value.descuento || !clienteDetalle.value.tipos || clienteDetalle.value.tipos.length === 0) {
    await Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos.' })
    return
  }
  const body = {
    nombre: clienteDetalle.value.nombre,
    descuento: clienteDetalle.value.descuento,
    producto: clienteDetalle.value.tipos.includes('producto'),
    servicio: clienteDetalle.value.tipos.includes('servicio'),
    paquete: clienteDetalle.value.tipos.includes('paquete')
  }
  try {
    const response = await fetch(`http://localhost:8080/backend/public/api/gym/promociones/${clienteDetalle.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'No se pudo actualizar la promoción')
    }
    await Swal.fire({ icon: 'success', title: 'Promoción actualizada', showConfirmButton: false, timer: 1200 })
    editandoDetalle.value = false
    clienteDetalle.value = null
    await cargarPromociones()
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message || 'No se pudo actualizar la promoción.' })
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
  if (!nuevoCliente.value.nombre || !nuevoCliente.value.descuento || !nuevoCliente.value.tipos || nuevoCliente.value.tipos.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos.' })
    return
  }
  // Construir el body para el backend
  const body = {
    nombre: nuevoCliente.value.nombre,
    descuento: nuevoCliente.value.descuento,
    producto: nuevoCliente.value.tipos.includes('producto'),
    servicio: nuevoCliente.value.tipos.includes('servicio'),
    paquete: nuevoCliente.value.tipos.includes('paquete')
  }
  try {
    const response = await fetch('http://localhost:8080/backend/public/api/gym/promociones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'No se pudo registrar la promoción')
    }
    Swal.fire({ icon: 'success', title: 'Promoción agregada', showConfirmButton: false, timer: 1200 })
    nuevoCliente.value = {
      nombre: '',
      descuento: '',
      tipos: []
    }
    // Cerrar modal
    const modal = document.getElementById('modalAgregarCliente')
    if (modal) {
      window.bootstrap.Modal.getInstance(modal).hide()
    }
    // Refrescar la lista de promociones
    await cargarPromociones()
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message || 'No se pudo registrar la promoción.' })
  }
}
import { ref, computed, onMounted, onUnmounted } from 'vue'

const terminoBusqueda = ref('')
const filtroActivo = ref('activos')

const nuevoCliente = ref({
  nombre: '',
  descuento: '',
  tipos: []
})

const clientes = ref([])

async function cargarPromociones() {
  try {
    const response = await fetch('http://localhost:8080/backend/public/api/gym/promociones')
    if (!response.ok) throw new Error('No se pudo obtener la lista de promociones')
    const promociones = await response.json()
    clientes.value = promociones.map(p => ({
      id: p.id,
      nombre: p.nombre,
      descuento: p.descuento,
      tipo: p.tipo,
      activo: p.activo !== undefined ? !!p.activo : true
    }))
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la lista de promociones.' })
  }
}

const clientesOrdenados = computed(() => {
  let filtrados = [...clientes.value]
  // Filtrar por estado activo/inactivo
  if (filtroActivo.value === 'activos') {
    filtrados = filtrados.filter(c => c.activo === true)
  } else if (filtroActivo.value === 'inactivos') {
    filtrados = filtrados.filter(c => c.activo === false)
  }
  // Filtro de búsqueda
  if (terminoBusqueda.value.trim()) {
    const termino = terminoBusqueda.value.toLowerCase()
    filtrados = filtrados.filter(c =>
      c.nombre.toLowerCase().includes(termino)
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
    title: '¿Seguro que deseas desactivar esta promoción?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then(async result => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/backend/public/api/gym/promociones/estado/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()

        if (response.ok) {
          // Actualizar localmente la promoción si estás usando un array llamado promociones
          const index = clientes.value.findIndex(p => p.id === id)
          if (index !== -1) {
            clientes.value[index].activo = !clientes.value[index].activo
          }

          // Cerrar detalle si estaba abierto
          if (clienteDetalle.value && clienteDetalle.value.id === id) {
            clienteDetalle.value = null
            editandoDetalle.value = false
          }

          Swal.fire({ icon: 'success', title: data.mensaje || 'Promoción actualizada', showConfirmButton: false, timer: 1200 })
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'No se pudo cambiar el estado de la promoción' })
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error de red', text: 'No se pudo conectar al servidor.' })
      }
    }
  })
}


const tituloLista = computed(() => {
  switch(filtroActivo.value) {
    case 'activos': return 'Promociones Activas'
    case 'inactivos': return 'Promociones Inactivas'
    case 'todos': return 'Todas las Promociones'
    default: return 'Promociones'
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
  cargarPromociones()
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
