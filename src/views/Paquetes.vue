<template>
  <div class="contenido-principal">
    <div class="container mt-4">
      <!-- Encabezado -->
      <div class="encabezado-dashboard d-flex flex-wrap justify-content-between align-items-center p-3 mb-4">
        <div class="saludo">
          <h4 class="m-0">Paquetes</h4>
        </div>
        <div class="reloj text-end">
          <p class="m-0">{{ fechaFormateada }}</p>
          <p class="m-0">{{ horaFormateada }}</p>
        </div>
      </div>

      <!-- Filtros, búsqueda y botón agregar paquete -->
      <div class="card tarjeta-kpi p-4 mb-4">
        <h5 class="mb-3 d-flex align-items-center">
          <i class="material-icons me-2">inventory_2</i>
          {{ tituloLista }}
        </h5>
        <div class="row align-items-center">
          <div class="col-md-6 mb-2">
            <div class="btn-group" role="group">
              <button class="btn" :class="filtroPaquetes === 'activos' ? 'btn-primary' : 'btn-outline-primary'" @click="cambiarFiltroPaquete('activos')">Activos</button>
              <button class="btn" :class="filtroPaquetes === 'inactivos' ? 'btn-secondary' : 'btn-outline-secondary'" @click="cambiarFiltroPaquete('inactivos')">Inactivos</button>
              <button class="btn" :class="filtroPaquetes === 'todos' ? 'btn-info' : 'btn-outline-info'" @click="cambiarFiltroPaquete('todos')">Todos</button>
            </div>
          </div>
          <div class="col-md-6 mb-2 d-flex justify-content-end">
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Buscar paquete..." v-model="terminoBusquedaPaquete" />
              <button class="btn btn-outline-secondary" @click="terminoBusquedaPaquete = ''">
                <i class="material-icons">clear</i>
              </button>
              <button class="btn btn-success ms-2" @click="abrirModalPaquete">
                <i class="material-icons me-1">add_box</i> Nuevo Paquete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para agregar paquete -->
      <div class="modal fade" id="modalAgregarPaquete" tabindex="-1" aria-labelledby="modalAgregarPaqueteLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalAgregarPaqueteLabel">Agregar nuevo paquete</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-12 mb-3">
                  <label class="form-label">Nombre del paquete</label>
                  <input v-model="nuevoPaquete.nombre" type="text" class="form-control" placeholder="Ejemplo: Paquete 2" />
                </div>
                <div class="col-12 mb-3">
                  <label class="form-label">Descripción breve</label>
                  <textarea v-model="nuevoPaquete.descripcion" class="form-control" placeholder="Incluye personal trainer y acceso al gym durante 1 mes." rows="2"></textarea>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Precio</label>
                  <input v-model.number="nuevoPaquete.precio" type="number" step="0.01" class="form-control" placeholder="Ejemplo: 250.00" min="0" />
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Duración</label>
                  <input v-model.number="nuevoPaquete.duracionCantidad" type="number" class="form-control" min="1" placeholder="Cantidad" />
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Unidad</label>
                  <select v-model="nuevoPaquete.duracionUnidad" class="form-select">
                    <option value="Días">Días</option>
                    <option value="Semanas">Semanas</option>
                    <option value="Meses">Meses</option>
                  </select>
                </div>
                <div class="col-12 mb-3">
                  <label class="form-label">Servicios incluidos</label>
                  <div class="d-flex flex-wrap gap-2">
                    <div v-for="servicio in serviciosDisponibles" :key="servicio" class="form-check">
                      <input class="form-check-input" type="checkbox" :id="'servicio-' + servicio" :value="servicio" v-model="nuevoPaquete.serviciosIncluidos">
                      <label class="form-check-label" :for="'servicio-' + servicio">{{ servicio }}</label>
                    </div>
                  </div>
                </div>
                <div class="col-12 mb-3">
                  <label class="form-label">Acceso a áreas</label>
                  <div class="d-flex flex-wrap gap-2">
                    <div v-for="area in areasDisponibles" :key="area" class="form-check">
                      <input class="form-check-input" type="checkbox" :id="'area-' + area" :value="area" v-model="nuevoPaquete.areasAcceso">
                      <label class="form-check-label" :for="'area-' + area">{{ area }}</label>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Tipo de paquete</label>
                  <select v-model="nuevoPaquete.tipoPaquete" class="form-select">
                    <option value="Regular">Regular</option>
                    <option value="Promoción por meses">Promoción por meses</option>
                    <option value="Promoción estacional">Promoción estacional</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3" v-if="nuevoPaquete.tipoPaquete !== 'Regular'">
                  <label class="form-label">Datos de promoción</label>
                  <div class="input-group mb-2">
                    <span class="input-group-text">Descuento (%)</span>
                    <input v-model.number="nuevoPaquete.descuento" type="number" class="form-control" min="0" max="100" placeholder="Ejemplo: 10" />
                  </div>
                  <div class="input-group mb-2">
                    <span class="input-group-text">Precio especial</span>
                    <input v-model.number="nuevoPaquete.precioEspecial" type="number" step="0.01" class="form-control" min="0" placeholder="Ejemplo: 200.00" />
                  </div>
                  <div class="mb-2">
                    <label class="form-label">Fecha inicio</label>
                    <input v-model="nuevoPaquete.fechaInicio" type="date" class="form-control" />
                  </div>
                  <div>
                    <label class="form-label">Fecha fin</label>
                    <input v-model="nuevoPaquete.fechaFin" type="date" class="form-control" />
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Estado</label>
                  <select v-model="nuevoPaquete.estado" class="form-select">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" @click="agregarPaqueteModal">Agregar Paquete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="card tarjeta-tabla p-4">
        <h5 class="mb-3 d-flex align-items-center">
          <i class="material-icons me-2">table_view</i>
          Listado de paquetes
        </h5>
        <div class="tabla-scroll">
          <table class="table table-hover tabla-clientes mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Área</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paquete in paquetesFiltrados" :key="paquete.id">
                <td>{{ paquete.nombre }}</td>
                <td>{{ Array.isArray(paquete.areasAcceso) ? paquete.areasAcceso.join(', ') : (paquete.areasAcceso || '-') }}</td>
                <td>{{ paquete.precio }}</td>
                <td class="td-acciones">
                  <div class="acciones-btns d-flex gap-1 justify-content-center">
                    <button class="btn btn-sm btn-outline-primary" title="Ver" @click="verDetalle(paquete)">
                      <i class="material-icons">visibility</i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" title="Editar" @click="editarPaquete(paquete)">
                      <i class="material-icons">edit</i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Eliminar" @click="eliminarPaquete(paquete.id)">
                      <i class="material-icons">delete</i>
                    </button>
                    <button class="btn btn-sm btn-outline-dark" title="Cambiar estado" @click="paquete.activo = !paquete.activo">
                      <i class="material-icons">swap_horiz</i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paquetes.length === 0">
                <td colspan="5" class="text-center text-muted">No hay paquetes encontrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detalle master-detail -->
      <div v-if="paqueteDetalle" class="card tarjeta-tabla p-4 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="mb-0">Detalle de paquete</h5>
          <button class="btn btn-sm btn-outline-secondary" @click="cancelarEdicionDetalle" title="Cerrar"><i class="material-icons">close</i></button>
        </div>
        <form v-if="editandoDetalle" @submit.prevent="guardarEdicionDetalle">
          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Nombre del paquete</label>
              <input v-model="paqueteDetalle.nombre" type="text" class="form-control" placeholder="Ejemplo: Paquete 2" />
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Descripción breve</label>
              <textarea v-model="paqueteDetalle.descripcion" class="form-control" placeholder="Incluye personal trainer y acceso al gym durante 1 mes." rows="2"></textarea>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Precio</label>
              <input v-model.number="paqueteDetalle.precio" type="number" step="0.01" class="form-control" placeholder="Ejemplo: 250.00" min="0" />
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Duración</label>
              <input v-model.number="paqueteDetalle.duracionCantidad" type="number" class="form-control" min="1" placeholder="Cantidad" />
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Unidad</label>
              <select v-model="paqueteDetalle.duracionUnidad" class="form-select">
                <option value="Días">Días</option>
                <option value="Semanas">Semanas</option>
                <option value="Meses">Meses</option>
              </select>
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Servicios incluidos</label>
              <div class="d-flex flex-wrap gap-2">
                <div v-for="servicio in serviciosDisponibles" :key="servicio" class="form-check">
                  <input class="form-check-input" type="checkbox" :id="'edit-servicio-' + servicio" :value="servicio" v-model="paqueteDetalle.serviciosIncluidos">
                  <label class="form-check-label" :for="'edit-servicio-' + servicio">{{ servicio }}</label>
                </div>
              </div>
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Acceso a áreas</label>
              <div class="d-flex flex-wrap gap-2">
                <div v-for="area in areasDisponibles" :key="area" class="form-check">
                  <input class="form-check-input" type="checkbox" :id="'edit-area-' + area" :value="area" v-model="paqueteDetalle.areasAcceso">
                  <label class="form-check-label" :for="'edit-area-' + area">{{ area }}</label>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Tipo de paquete</label>
              <select v-model="paqueteDetalle.tipoPaquete" class="form-select">
                <option value="Regular">Regular</option>
                <option value="Promoción por meses">Promoción por meses</option>
                <option value="Promoción estacional">Promoción estacional</option>
              </select>
            </div>
            <div class="col-md-6 mb-3" v-if="paqueteDetalle.tipoPaquete !== 'Regular'">
              <label class="form-label">Datos de promoción</label>
              <div class="input-group mb-2">
                <span class="input-group-text">Descuento (%)</span>
                <input v-model.number="paqueteDetalle.descuento" type="number" class="form-control" min="0" max="100" placeholder="Ejemplo: 10" />
              </div>
              <div class="input-group mb-2">
                <span class="input-group-text">Precio especial</span>
                <input v-model.number="paqueteDetalle.precioEspecial" type="number" step="0.01" class="form-control" min="0" placeholder="Ejemplo: 200.00" />
              </div>
              <div class="mb-2">
                <label class="form-label">Fecha inicio</label>
                <input v-model="paqueteDetalle.fechaInicio" type="date" class="form-control" />
              </div>
              <div>
                <label class="form-label">Fecha fin</label>
                <input v-model="paqueteDetalle.fechaFin" type="date" class="form-control" />
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Estado</label>
              <select v-model="paqueteDetalle.estado" class="form-select">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div class="text-end mt-3">
            <button type="submit" class="btn btn-success me-2">Guardar cambios</button>
            <button type="button" class="btn btn-secondary" @click="editandoDetalle = false">Cancelar</button>
          </div>
        </form>
        <div v-else class="row g-2">
          <!-- Nombre -->
          <div class="col-12 mb-1"><b>Nombre:</b> {{ paqueteDetalle.nombre }}</div>
          <!-- Precio, Duración, Servicios -->
          <div class="col-12 mb-1 d-flex flex-wrap align-items-center gap-3">
            <span><b>Precio:</b> ${{ Number(paqueteDetalle.precio).toFixed(2) }}</span>
            <span><b>Duración:</b> {{ paqueteDetalle.duracionCantidad }} {{ paqueteDetalle.duracionUnidad }}</span>
            <span><b>Servicios incluidos:</b> <span v-if="paqueteDetalle.serviciosIncluidos && paqueteDetalle.serviciosIncluidos.length">{{ paqueteDetalle.serviciosIncluidos.join(', ') }}</span><span v-else class="text-muted">Ninguno</span></span>
          </div>
          <!-- Áreas de acceso, Tipo de paquete -->
          <div class="col-12 mb-1 d-flex flex-wrap align-items-center gap-3">
            <span><b>Áreas de acceso:</b> <span v-if="paqueteDetalle.areasAcceso && paqueteDetalle.areasAcceso.length">{{ paqueteDetalle.areasAcceso.join(', ') }}</span><span v-else class="text-muted">Ninguna</span></span>
            <span><b>Tipo de paquete:</b> {{ paqueteDetalle.tipoPaquete }}</span>
            <span><b>Estado:</b> {{ paqueteDetalle.estado || (paqueteDetalle.activo ? 'Activo' : 'Inactivo') }}</span>
          </div>
          <!-- Promoción (si aplica) -->
          <template v-if="paqueteDetalle.tipoPaquete && paqueteDetalle.tipoPaquete !== 'Regular'">
            <div class="col-12 mb-1 d-flex flex-wrap align-items-center gap-3">
              <span><b>Descuento:</b> <span v-if="paqueteDetalle.descuento">{{ paqueteDetalle.descuento }}%</span><span v-else class="text-muted">-</span></span>
              <span><b>Precio especial:</b> <span v-if="paqueteDetalle.precioEspecial">${{ Number(paqueteDetalle.precioEspecial).toFixed(2) }}</span><span v-else class="text-muted">-</span></span>
              <span><b>Fecha inicio:</b> <span v-if="paqueteDetalle.fechaInicio">{{ paqueteDetalle.fechaInicio }}</span><span v-else class="text-muted">-</span></span>
              <span><b>Fecha fin:</b> <span v-if="paqueteDetalle.fechaFin">{{ paqueteDetalle.fechaFin }}</span><span v-else class="text-muted">-</span></span>
            </div>
          </template>
          <!-- Descripción -->
          <div class="col-12 mt-2"><b>Descripción:</b> <span>{{ paqueteDetalle.descripcion }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const serviciosDisponibles = [
  'Visita única',
  'Semana',
  'Quincena',
  'Mensualidad gym',
  'Personal trainer',
  'Nutriólogo',
  'Fisioterapia',
  'Área funcional',
  'Consulta médica',
  'Consulta psicológica'
]

const areasDisponibles = [
  'Kids',
  'Funcional adultos',
  'Área de pesas',
  'Área de fisioterapia',
  'Gym general'
]

const paqueteDetalle = ref(null)
const editandoDetalle = ref(false)

function verDetalle(paquete) {
  paqueteDetalle.value = { ...paquete }
  editandoDetalle.value = false
}

function editarPaquete(paquete) {
  paqueteDetalle.value = { ...paquete }
  editandoDetalle.value = true
}

async function guardarEdicionDetalle() {
  if (!paqueteDetalle.value.nombre || !paqueteDetalle.value.precio || !paqueteDetalle.value.duracionCantidad || !paqueteDetalle.value.duracionUnidad) {
    await Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa los campos obligatorios.' })
    return
  }
  const idx = paquetes.value.findIndex(p => p.id === paqueteDetalle.value.id)
  if (idx !== -1) {
    paquetes.value[idx] = { ...paqueteDetalle.value }
    await Swal.fire({ icon: 'success', title: 'Paquete actualizado', showConfirmButton: false, timer: 1200 })
  }
  editandoDetalle.value = false
  paqueteDetalle.value = null
}

function cancelarEdicionDetalle() {
  paqueteDetalle.value = null
}

function abrirModalPaquete() {
  const modal = document.getElementById('modalAgregarPaquete')
  if (modal) {
    new window.bootstrap.Modal(modal).show()
  }
}

function agregarPaqueteModal() {
  if (!nuevoPaquete.value.nombre || !nuevoPaquete.value.precio || !nuevoPaquete.value.duracionCantidad || !nuevoPaquete.value.duracionUnidad) {
    Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa los campos obligatorios.' })
    return
  }
  paquetes.value.push({
    id: paquetes.value.length ? Math.max(...paquetes.value.map(p => p.id)) + 1 : 1,
    nombre: nuevoPaquete.value.nombre,
    descripcion: nuevoPaquete.value.descripcion,
    precio: nuevoPaquete.value.precio,
    duracionCantidad: nuevoPaquete.value.duracionCantidad,
    duracionUnidad: nuevoPaquete.value.duracionUnidad,
    serviciosIncluidos: [...nuevoPaquete.value.serviciosIncluidos],
    areasAcceso: [...nuevoPaquete.value.areasAcceso],
    tipoPaquete: nuevoPaquete.value.tipoPaquete,
    descuento: nuevoPaquete.value.tipoPaquete !== 'Regular' ? nuevoPaquete.value.descuento : '',
    precioEspecial: nuevoPaquete.value.tipoPaquete !== 'Regular' ? nuevoPaquete.value.precioEspecial : '',
    fechaInicio: nuevoPaquete.value.tipoPaquete !== 'Regular' ? nuevoPaquete.value.fechaInicio : '',
    fechaFin: nuevoPaquete.value.tipoPaquete !== 'Regular' ? nuevoPaquete.value.fechaFin : '',
    estado: nuevoPaquete.value.estado,
    activo: nuevoPaquete.value.estado === 'Activo'
  })
  Swal.fire({ icon: 'success', title: 'Paquete agregado', showConfirmButton: false, timer: 1200 })
  nuevoPaquete.value = {
    nombre: '',
    descripcion: '',
    precio: '',
    duracionCantidad: 1,
    duracionUnidad: 'Meses',
    serviciosIncluidos: [],
    areasAcceso: [],
    tipoPaquete: 'Regular',
    descuento: '',
    precioEspecial: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Activo'
  }
  // Cerrar modal
  const modal = document.getElementById('modalAgregarPaquete')
  if (modal) {
    window.bootstrap.Modal.getInstance(modal).hide()
  }
}

const nuevoPaquete = ref({
  nombre: '',
  descripcion: '',
  precio: '',
  duracionCantidad: 1,
  duracionUnidad: 'Meses',
  serviciosIncluidos: [],
  areasAcceso: [],
  tipoPaquete: 'Regular',
  descuento: '',
  precioEspecial: '',
  fechaInicio: '',
  fechaFin: '',
  estado: 'Activo'
})

const paquetes = ref([
  {
    id: 1,
    nombre: 'Paquete 0 - Visita',
    descripcion: 'Acceso por un día a todas las áreas del gimnasio.',
    precio: 100.00,
    duracionCantidad: 1,
    duracionUnidad: 'Días',
    serviciosIncluidos: ['Visita única'],
    areasAcceso: ['Gym general', 'Área de pesas'],
    tipoPaquete: 'Regular',
    descuento: '',
    precioEspecial: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Activo',
    activo: true
  },
  {
    id: 2,
    nombre: 'Paquete 0 - Semana',
    descripcion: 'Acceso ilimitado al gimnasio durante una semana.',
    precio: 350.00,
    duracionCantidad: 1,
    duracionUnidad: 'Semanas',
    serviciosIncluidos: ['Semana'],
    areasAcceso: ['Gym general', 'Área de pesas', 'Funcional adultos'],
    tipoPaquete: 'Regular',
    descuento: '',
    precioEspecial: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Activo',
    activo: true
  },
  {
    id: 3,
    nombre: 'Paquete 0 - Quincena',
    descripcion: 'Acceso ilimitado al gimnasio durante 15 días.',
    precio: 600.00,
    duracionCantidad: 15,
    duracionUnidad: 'Días',
    serviciosIncluidos: ['Quincena'],
    areasAcceso: ['Gym general', 'Área de pesas', 'Funcional adultos'],
    tipoPaquete: 'Regular',
    descuento: '',
    precioEspecial: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Activo',
    activo: true
  },
  {
    id: 4,
    nombre: 'Paquete 1 - Mensualidad Gym',
    descripcion: 'Acceso ilimitado al gimnasio durante 1 mes.',
    precio: 900.00,
    duracionCantidad: 1,
    duracionUnidad: 'Meses',
    serviciosIncluidos: ['Mensualidad gym'],
    areasAcceso: ['Gym general', 'Área de pesas', 'Funcional adultos'],
    tipoPaquete: 'Promoción por meses',
    descuento: 10,
    precioEspecial: 800.00,
    fechaInicio: '2025-08-01',
    fechaFin: '2025-08-31',
    estado: 'Activo',
    activo: true
  },
  {
    id: 5,
    nombre: 'Paquete 2 - Personal Trainer y Mensualidad',
    descripcion: 'Incluye personal trainer y acceso al gym durante 1 mes.',
    precio: 1800.00,
    duracionCantidad: 1,
    duracionUnidad: 'Meses',
    serviciosIncluidos: ['Mensualidad gym', 'Personal trainer'],
    areasAcceso: ['Gym general', 'Área de pesas', 'Funcional adultos'],
    tipoPaquete: 'Promoción estacional',
    descuento: 15,
    precioEspecial: 1500.00,
    fechaInicio: '2025-09-01',
    fechaFin: '2025-09-30',
    estado: 'Activo',
    activo: true
  },
  {
    id: 6,
    nombre: 'Paquete 3 - Personal Trainer, Gimnasio y Nutriólogo',
    descripcion: 'Incluye personal trainer, acceso al gym y consulta con nutriólogo durante 1 mes.',
    precio: 2200.00,
    duracionCantidad: 1,
    duracionUnidad: 'Meses',
    serviciosIncluidos: ['Mensualidad gym', 'Personal trainer', 'Nutriólogo'],
    areasAcceso: ['Gym general', 'Área de pesas', 'Funcional adultos'],
    tipoPaquete: 'Regular',
    descuento: '',
    precioEspecial: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Activo',
    activo: true
  },
  {
    id: 7,
    nombre: 'Paquete 4 - Personal Trainer, Gimnasio y Fisioterapia',
    descripcion: 'Incluye personal trainer, acceso al gym y fisioterapia durante 1 mes.',
    precio: 2200.00,
    duracionCantidad: 1,
    duracionUnidad: 'Meses',
    serviciosIncluidos: ['Mensualidad gym', 'Personal trainer', 'Fisioterapia'],
    areasAcceso: ['Gym general', 'Área de pesas', 'Área de fisioterapia'],
    tipoPaquete: 'Regular',
    descuento: '',
    precioEspecial: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Activo',
    activo: true
  },
  {
    id: 8,
    nombre: 'Paquete 5 - Funcional',
    descripcion: 'Acceso a clases funcionales durante 1 mes.',
    precio: 700.00,
    duracionCantidad: 1,
    duracionUnidad: 'Meses',
    serviciosIncluidos: ['Área funcional'],
    areasAcceso: ['Funcional adultos'],
    tipoPaquete: 'Regular',
    descuento: '',
    precioEspecial: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Activo',
    activo: true
  },
  {
    id: 9,
    nombre: 'Paquete 6 - Funcional y Gimnasio',
    descripcion: 'Acceso a clases funcionales y gimnasio durante 1 mes.',
    precio: 1200.00,
    duracionCantidad: 1,
    duracionUnidad: 'Meses',
    serviciosIncluidos: ['Área funcional', 'Mensualidad gym'],
    areasAcceso: ['Funcional adultos', 'Gym general'],
    tipoPaquete: 'Promoción por meses',
    descuento: 5,
    precioEspecial: 1100.00,
    fechaInicio: '2025-10-01',
    fechaFin: '2025-10-31',
    estado: 'Activo',
    activo: true
  }
])

const filtroPaquetes = ref('activos')
const terminoBusquedaPaquete = ref('')

const paquetesFiltrados = computed(() => {
  let filtrados = [...paquetes.value]
  if (filtroPaquetes.value === 'activos') {
    filtrados = filtrados.filter(p => p.activo)
  } else if (filtroPaquetes.value === 'inactivos') {
    filtrados = filtrados.filter(p => !p.activo)
  }

  if (terminoBusquedaPaquete.value.trim()) {
    const termino = terminoBusquedaPaquete.value.toLowerCase()
    filtrados = filtrados.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      p.area.toLowerCase().includes(termino)
    )
  }

  return filtrados
})

const cambiarFiltroPaquete = tipo => filtroPaquetes.value = tipo

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
