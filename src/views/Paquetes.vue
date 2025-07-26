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
                    <button class="btn btn-sm btn-outline-danger" title="Cambiar estado" @click="eliminarPaquete(paquete.id)">
                      <i class="material-icons">delete</i>
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
              <input type="text" class="form-control" value="Regular" readonly />
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

async function eliminarPaquete(id) {
  const paquete = paquetes.value.find(p => p.id === id)
  if (!paquete) return
  const accion = paquete.activo ? 'desactivar' : 'activar'
  const confirm = await Swal.fire({
    title: `¿Seguro que deseas ${accion} este paquete?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: `Sí, ${accion}`,
    cancelButtonText: 'Cancelar'
  })
  if (!confirm.isConfirmed) return

  try {
    const res = await fetch(`http://localhost:8080/backend/public/api/gym/paquetes/estado/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'No se pudo cambiar el estado del paquete')
    await Swal.fire({ icon: 'success', title: data.mensaje || 'Estado actualizado', showConfirmButton: false, timer: 1200 })
    await cargarPaquetes()
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message || 'No se pudo cambiar el estado del paquete.' })
  }
}
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

  try {
    const response = await fetch(`http://localhost:8080/backend/public/api/gym/paquetes/${paqueteDetalle.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: paqueteDetalle.value.nombre,
        descripcion: paqueteDetalle.value.descripcion,
        precio: paqueteDetalle.value.precio,
        duracion: paqueteDetalle.value.duracionCantidad,
        unidad: paqueteDetalle.value.duracionUnidad,
        visita_unica: paqueteDetalle.value.visita_unica ?? false,
        semana: paqueteDetalle.value.semana ?? false,
        quincena: paqueteDetalle.value.quincena ?? false,
        mensualidad_gym: paqueteDetalle.value.mensualidad_gym ?? false,
        personal_trainer: paqueteDetalle.value.personal_trainer ?? false,
        nutriologo: paqueteDetalle.value.nutriologo ?? false,
        fisioterapia: paqueteDetalle.value.fisioterapia ?? false,
        area_funcional: paqueteDetalle.value.area_funcional ?? false,
        consulta_medica: paqueteDetalle.value.consulta_medica ?? false,
        consulta_psicologica: paqueteDetalle.value.consulta_psicologica ?? false,
        area_kids: paqueteDetalle.value.area_kids ?? false,
        funcional_adultos: paqueteDetalle.value.funcional_adultos ?? false,
        area_pesas: paqueteDetalle.value.area_pesas ?? false,
        area_fisioterapia: paqueteDetalle.value.area_fisioterapia ?? false,
        gym_general: paqueteDetalle.value.gym_general ?? false,
        tipo_paquete: "Regular",
        estado: paqueteDetalle.value.estado ?? true
      })
    })

    const data = await response.json()

    if (response.ok) {
      const idx = paquetes.value.findIndex(p => p.id === paqueteDetalle.value.id)
      if (idx !== -1) {
        paquetes.value[idx] = { ...paqueteDetalle.value }
      }
      await Swal.fire({ icon: 'success', title: 'Paquete actualizado', showConfirmButton: false, timer: 1200 })
      editandoDetalle.value = false
      paqueteDetalle.value = null
    } else {
      await Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'No se pudo actualizar el paquete.' })
    }
  } catch (error) {
    await Swal.fire({ icon: 'error', title: 'Error de red', text: 'No se pudo conectar al servidor.' })
  }
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

async function agregarPaqueteModal() {
  if (!nuevoPaquete.value.nombre || !nuevoPaquete.value.precio || !nuevoPaquete.value.duracionCantidad || !nuevoPaquete.value.duracionUnidad) {
    Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa los campos obligatorios.' })
    return
  }

  // Mapear servicios y áreas a campos booleanos
  const servicios = {
    'Visita única': 'visita_unica',
    'Semana': 'semana',
    'Quincena': 'quincena',
    'Mensualidad gym': 'mensualidad_gym',
    'Personal trainer': 'personal_trainer',
    'Nutriólogo': 'nutriologo',
    'Fisioterapia': 'fisioterapia',
    'Área funcional': 'area_funcional',
    'Consulta médica': 'consulta_medica',
    'Consulta psicológica': 'consulta_psicologica'
  }
  const areas = {
    'Kids': 'area_kids',
    'Funcional adultos': 'funcional_adultos',
    'Área de pesas': 'area_pesas',
    'Área de fisioterapia': 'area_fisioterapia',
    'Gym general': 'gym_general'
  }

  const payload = {
    nombre: nuevoPaquete.value.nombre,
    descripcion: nuevoPaquete.value.descripcion,
    precio: nuevoPaquete.value.precio,
    duracion: nuevoPaquete.value.duracionCantidad,
    unidad: nuevoPaquete.value.duracionUnidad,
    tipo_paquete: nuevoPaquete.value.tipoPaquete,
    estado: nuevoPaquete.value.estado === 'Activo' ? 1 : 0,
    // Servicios
    ...Object.fromEntries(Object.entries(servicios).map(([k, v]) => [v, nuevoPaquete.value.serviciosIncluidos.includes(k)])),
    // Áreas
    ...Object.fromEntries(Object.entries(areas).map(([k, v]) => [v, nuevoPaquete.value.areasAcceso.includes(k)])),
    // Promoción
    descuento: nuevoPaquete.value.tipoPaquete !== 'Regular' ? nuevoPaquete.value.descuento : '',
    precio_especial: nuevoPaquete.value.tipoPaquete !== 'Regular' ? nuevoPaquete.value.precioEspecial : '',
    fecha_inicio: nuevoPaquete.value.tipoPaquete !== 'Regular' ? nuevoPaquete.value.fechaInicio : '',
    fecha_fin: nuevoPaquete.value.tipoPaquete !== 'Regular' ? nuevoPaquete.value.fechaFin : ''
  }

  try {
    const res = await fetch('http://localhost:8080/backend/public/api/gym/paquetes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'No se pudo registrar el paquete')
    Swal.fire({ icon: 'success', title: 'Paquete agregado', showConfirmButton: false, timer: 1200 })
    // Refrescar lista
    await cargarPaquetes()
    // Limpiar formulario
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
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.message || 'No se pudo registrar el paquete.' })
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

const paquetes = ref([])

async function cargarPaquetes() {
  try {
    const response = await fetch('http://localhost:8080/backend/public/api/gym/paquetes')
    if (!response.ok) throw new Error('No se pudo obtener la lista de paquetes')
    const data = await response.json()
    paquetes.value = data.map(p => {
      // Servicios
      const serviciosIncluidos = []
      if (p.visita_unica) serviciosIncluidos.push('Visita única')
      if (p.semana) serviciosIncluidos.push('Semana')
      if (p.quincena) serviciosIncluidos.push('Quincena')
      if (p.mensualidad_gym) serviciosIncluidos.push('Mensualidad gym')
      if (p.personal_trainer) serviciosIncluidos.push('Personal trainer')
      if (p.nutriologo) serviciosIncluidos.push('Nutriólogo')
      if (p.fisioterapia) serviciosIncluidos.push('Fisioterapia')
      if (p.area_funcional) serviciosIncluidos.push('Área funcional')
      if (p.consulta_medica) serviciosIncluidos.push('Consulta médica')
      if (p.consulta_psicologica) serviciosIncluidos.push('Consulta psicológica')
      // Áreas
      const areasAcceso = []
      if (p.area_kids) areasAcceso.push('Kids')
      if (p.funcional_adultos) areasAcceso.push('Funcional adultos')
      if (p.area_pesas) areasAcceso.push('Área de pesas')
      if (p.area_fisioterapia) areasAcceso.push('Área de fisioterapia')
      if (p.gym_general) areasAcceso.push('Gym general')
      return {
        id: p.id_paquete,
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: Number(p.precio),
        duracionCantidad: Number(p.duracion),
        duracionUnidad: p.unidad,
        serviciosIncluidos,
        areasAcceso,
        tipoPaquete: p.tipo_paquete,
        descuento: p.descuento || '',
        precioEspecial: p.precio_especial || '',
        fechaInicio: p.fecha_inicio || '',
        fechaFin: p.fecha_fin || '',
        estado: p.estado === 1 ? 'Activo' : 'Inactivo',
        activo: p.estado === 1
      }
    })
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la lista de paquetes.' })
  }
}

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
  cargarPaquetes()
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
