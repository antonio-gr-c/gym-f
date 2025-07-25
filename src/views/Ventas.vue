<template>
  <Navbar />

  <div class="container mt-4">
    <!-- ENCABEZADO estilo clientes -->
    <div class="encabezado-dashboard d-flex flex-wrap justify-content-between align-items-center p-3 mb-4">
      <div class="saludo">
        <h4 class="m-0">Ventas</h4>
      </div>
      <div class="reloj text-end">
        <p class="m-0">{{ fecha }}</p>
        <p class="m-0">{{ hora }}</p>
      </div>
    </div>

    <!-- CATÁLOGO -->
    <div class="card tarjeta-tabla p-4 mb-5">
      <h5 class="mb-3 d-flex align-items-center">
        <i class="material-icons me-2">table_view</i>
        Catálogo de productos y servicios
      </h5>
      <!-- Pestañas de tipos -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <button class="nav-link" :class="{active: tabCatalogo==='general'}" @click="tabCatalogo='general'">General</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{active: tabCatalogo==='producto'}" @click="tabCatalogo='producto'">Productos</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{active: tabCatalogo==='servicio'}" @click="tabCatalogo='servicio'">Servicios</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{active: tabCatalogo==='paquete'}" @click="tabCatalogo='paquete'">Paquetes</button>
        </li>
      </ul>
      <input
        v-model="busqueda"
        type="text"
        class="form-control mb-3"
        placeholder="Buscar por nombre o ID..."
      />
      <div class="tabla-scroll">
        <table class="table table-hover tabla-clientes mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(producto, i) in productosPaginados"
              :key="producto.id"
              :class="{ 'text-decoration-line-through text-muted': producto.stock === 0 }"
            >
              <td>{{ producto.id }}</td>
              <td>{{ producto.nombre }}</td>
              <td>{{ producto.tipo }}</td>
              <td>${{ producto.precio }}</td>
              <td>
                <span v-if="producto.tipo==='producto'">{{ producto.stock ?? '-' }}</span>
                <span v-else>-</span>
              </td>
              <td>
                <button
                  class="btn btn-outline-success btn-sm"
                  @click="agregarAlTicket(producto)"
                  :disabled="producto.tipo==='producto' && producto.stock===0"
                >
                  <i class="material-icons">add_shopping_cart</i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Paginación catálogo -->
      <div class="d-flex justify-content-end mt-2">
        <button
          class="btn btn-outline-primary btn-sm me-2"
          :disabled="paginaCatalogo === 1"
          @click="paginaCatalogo--"
        >
          Anterior
        </button>
        <button
          class="btn btn-outline-primary btn-sm"
          :disabled="paginaCatalogo === totalPaginasCatalogo"
          @click="paginaCatalogo++"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- TICKET Y RESUMEN -->
    <div v-if="ticket.length" class="row mb-4 fade-in-ticket">
      <!-- TICKET -->
      <div class="col-md-8 mb-3 d-flex flex-column">
        <div class="card tarjeta-tabla p-4 flex-grow-1" style="height:auto; min-height:0;">
          <h5 class="mb-3 d-flex align-items-center">
            <i class="material-icons me-2">shopping_cart</i>
            Ticket actual
          </h5>
          <div class="tabla-scroll">
            <table class="table table-hover tabla-clientes mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Meses</th>
                  <th>Precio</th>
                  <th>Descuento %</th>
                  <th>Promoción</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in ticketPaginado" :key="item.id + '-' + idx">
                  <td>{{ item.nombre }}</td>
                  <td class="text-center">
                    <span v-if="item.tipo === 'servicio' || (item.tipo === 'paquete' && item.id < 10)">1</span>
                    <input
                      v-else-if="item.tipo === 'producto'"
                      type="number"
                      min="1"
                      class="form-control form-control-sm text-center"
                      v-model.number="item.cantidad"
                      @input="actualizarTotales"
                    />
                    <span v-else-if="item.tipo === 'paquete' && item.id >= 10">1</span>
                  </td>
                  <td class="text-center">
                    <span v-if="item.tipo !== 'paquete' || item.id < 10">-</span>
                    <input v-else type="number" min="1" class="form-control form-control-sm text-center" v-model.number="item.meses" @input="actualizarTotales" />
                  </td>
                  <td class="text-center">${{ item.precio }}</td>
                  <td class="text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      class="form-control form-control-sm text-center"
                      v-model.number="item.descuento"
                      @input="actualizarTotales"
                    />
                  </td>
                  <td class="text-center">
                    <select class="form-select form-select-sm" v-model="item.promocion" @change="aplicarPromocion(item)">
                      <option value="">Sin promoción</option>
                      <option v-for="promo in promociones.filter(p => p.aplica.includes(item.tipo))" :key="promo.nombre" :value="promo.nombre">
                        {{ promo.nombre }} ({{ promo.descuento }}%)
                      </option>
                    </select>
                  </td>
                  <td class="text-center">${{ calcularTotalLinea(item) }}</td>
                  <td class="text-center">
                    <button class="btn btn-danger btn-sm mt-1" @click="eliminarItem(idx)">
                      <i class="material-icons">delete</i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Paginación Ticket -->
          <div class="d-flex justify-content-end mt-2">
            <button
              class="btn btn-outline-primary btn-sm me-2"
              :disabled="paginaTicket === 1"
              @click="paginaTicket--"
            >
              Anterior
            </button>
            <button
              class="btn btn-outline-primary btn-sm"
              :disabled="paginaTicket === totalPaginasTicket"
              @click="paginaTicket++"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <!-- RESUMEN -->
      <div class="col-md-4">
        <div class="card tarjeta-tabla p-4 h-100">
          <h5 class="mb-3 d-flex align-items-center">
            <i class="material-icons me-2">receipt_long</i>
            Resumen
          </h5>
          <div class="tabla-scroll">
            <!-- Sección Cliente -->
            <div class="mb-3">
              <label class="form-label"><b>Cliente:</b></label>
              <div class="input-group">
                <select
                  v-model="selectedClienteId"
                  class="form-select"
                  aria-label="Selecciona cliente"
                >
                  <option disabled value="">-- Selecciona cliente --</option>
                  <option :disabled="ticket.some(item => item.tipo === 'servicio' || item.tipo === 'paquete')" value="general">General</option>
                  <option
                    v-for="c in clientes"
                    :key="c.id"
                    :value="c.id"
                  >
                    {{ c.nombre }}
                  </option>
                </select>
                <button
                  class="btn btn-outline-primary"
                  type="button"
                  @click="openClienteModal"
                >
                  <i class="material-icons">add</i>
                </button>
                <!-- Eliminar botón de agregar mascota cuando hay cliente o general seleccionado -->
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label"><b>Observaciones:</b></label>
              <input
                v-model="observaciones"
                type="text"
                class="form-control"
              />
            </div>
            <!-- Campo de método de pago eliminado, solo efectivo permitido -->
            <hr />
            <p><strong>Subtotal:</strong> <span class="text-secondary">${{ subtotal }}</span></p>
            <p><strong>Descuento total:</strong> <span class="text-secondary">${{ descuentoTotal }}</span></p>
            <h5><strong style="color: black;">Total a pagar:</strong> <span class="text-success">${{ total }}</span></h5>
          </div>
        </div>
      </div>
    </div>

    <!-- BOTONES DE ACCIÓN -->
    <div
      v-if="ticket.length"
      class="d-flex gap-3 justify-content-end mb-5 fade-in-ticket"
    >
      <button class="btn btn-primary" @click="guardarVenta">
        <i class="material-icons me-1">check_circle</i> Guardar venta
      </button>
      <button class="btn btn-outline-danger" @click="cancelarVenta">
        <i class="material-icons me-1">cancel</i> Cancelar
      </button>
    </div>
  </div>

  <!-- Modal para crear cliente -->
  <div
    class="modal fade"
    id="clienteModal"
    tabindex="-1"
    aria-labelledby="clienteModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="clienteModalLabel">Nuevo Cliente</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Cerrar"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input
              v-model="clienteForm.nombre"
              type="text"
              class="form-control"
              placeholder="Ej. Juan"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Apellido paterno</label>
            <input
              v-model="clienteForm.apellidoPaterno"
              type="text"
              class="form-control"
              placeholder="Ej. Pérez"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Apellido materno</label>
            <input
              v-model="clienteForm.apellidoMaterno"
              type="text"
              class="form-control"
              placeholder="Ej. López"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Edad</label>
            <input
              v-model.number="clienteForm.edad"
              type="number"
              min="0"
              class="form-control"
              placeholder="Ej. 25"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Teléfono</label>
            <input
              v-model="clienteForm.telefono"
              type="tel"
              class="form-control"
              placeholder="Ej. 5551234567"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="guardarCliente"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para agregar mascota -->
  <div
    class="modal fade"
    id="mascotaModal"
    tabindex="-1"
    aria-labelledby="mascotaModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="mascotaModalLabel">Agregar Mascota</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Cerrar"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input
              v-model="nuevaMascota.nombre"
              type="text"
              class="form-control"
              placeholder="Ej. Luna"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Especie</label>
            <input
              v-model="nuevaMascota.especie"
              type="text"
              class="form-control"
              placeholder="Ej. Perro"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Edad</label>
            <div class="input-group">
              <input
                v-model.number="nuevaMascota.edad"
                type="number"
                min="0"
                class="form-control"
              />
              <select
                v-model="nuevaMascota.unidad_edad"
                class="form-select"
              >
                <option value="años">Años</option>
                <option value="meses">Meses</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Raza</label>
            <input
              v-model="nuevaMascota.raza"
              type="text"
              class="form-control"
              placeholder="Opcional"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="guardarMascota"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
// import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'
import Swal from 'sweetalert2'

export default {
  name: 'Ventas',
  components: { Navbar },

  data() {
    return {
      promociones: [
        { nombre: 'Mes del amor', descuento: 10, aplica: ['producto', 'servicio', 'paquete'] },
        { nombre: 'Mes del niño', descuento: 15, aplica: ['producto'] },
        { nombre: 'Mes del gym', descuento: 20, aplica: ['servicio', 'paquete'] }
      ],
    aplicarPromocion(item) {
      const promo = this.promociones.find(p => p.nombre === item.promocion)
      if (promo) {
        item.descuento = promo.descuento
      } else {
        item.descuento = 0
      }
      this.actualizarTotales()
    },
      busqueda: '',
      tabCatalogo: 'general',
      // clientes y selección
      clientes: [
        { id: 1, nombre: 'Ana Torres', telefono: '5551234567', correo: 'ana@mail.com', mascotas: [ { id: 1, nombre: 'Luna', especie: 'Perro', edad: 3, unidad_edad: 'años', raza: 'Labrador' } ] },
        { id: 2, nombre: 'Carlos Ruiz', telefono: '5558889999', correo: 'carlos@mail.com', mascotas: [] }
      ],
      selectedClienteId: '',
      mascotasCliente: [], // Mascotas del cliente seleccionado
      clienteForm: {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        edad: '',
        telefono: '',
        tieneMascota: false,
        mascota: {
          nombre: '',
          especie: '',
          edad: 0,
          unidad_edad: 'años',
          raza: ''
        }
      },
      // datos de mascota para la venta
      mascotaNombre: '',
      mascotaEdad: 0,
      mascotaUnidadEdad: 'años',
      mascotaEspecie: '',
      mascotaRaza: '',
      // venta
      observaciones: '',
      metodoPago: 'efectivo',
      usuarioId: null,
      // catálogo y ticket
      productos: [
        // Productos ejemplo
        { id: 1, nombre: 'Proteína', tipo: 'producto', precio: 500, stock: 10 },
        { id: 2, nombre: 'Guantes', tipo: 'producto', precio: 200, stock: 5 },
        // Servicios
        { id: 3, nombre: 'Consulta psicóloga', tipo: 'servicio', precio: 350 },
        { id: 4, nombre: 'Consulta nutriólogo', tipo: 'servicio', precio: 350 },
        { id: 5, nombre: 'Consulta fisioterapeuta', tipo: 'servicio', precio: 400 },
        { id: 6, nombre: 'Consulta médica', tipo: 'servicio', precio: 300 },
        // Paquetes
        { id: 7, nombre: 'Paquete 0 - Visita', tipo: 'paquete', precio: 100 },
        { id: 8, nombre: 'Paquete 0 - Semana', tipo: 'paquete', precio: 350 },
        { id: 9, nombre: 'Paquete 0 - Quincena', tipo: 'paquete', precio: 600 },
        { id: 10, nombre: 'Paquete 1 - Mensualidad Gym', tipo: 'paquete', precio: 900 },
        { id: 11, nombre: 'Paquete 2 - Personal Trainer y Mensualidad', tipo: 'paquete', precio: 1800 },
        { id: 12, nombre: 'Paquete 3 - Personal Trainer, Gimnasio y Nutriólogo', tipo: 'paquete', precio: 2200 },
        { id: 13, nombre: 'Paquete 4 - Personal Trainer, Gimnasio y Fisioterapia', tipo: 'paquete', precio: 2200 },
        { id: 14, nombre: 'Paquete 5 - Funcional', tipo: 'paquete', precio: 700 },
        { id: 15, nombre: 'Paquete 6 - Funcional y Gimnasio', tipo: 'paquete', precio: 1200 }
      ],
      ticket: [],
      paginaCatalogo: 1,
      productosPorPagina: 10,
      paginaTicket: 1,
      itemsPorTicket: 10,
      // reloj
      fecha: '',
      hora: '',
      intervalo: null,
      // nueva mascota
      nuevaMascota: {
        nombre: '',
        especie: '',
        raza: '',
        edad: 0,
        unidad_edad: 'años'
      }
    }
  },

  computed: {
    clienteSeleccionado() {
      if (this.selectedClienteId === 'general') {
        return { id: 'general', nombre: 'General', telefono: '', correo: '', mascotas: [] }
      }
      return this.clientes.find(c => c.id === this.selectedClienteId) || {}
    },
    productosFiltrados() {
      const filtro = this.busqueda.toLowerCase()
      let lista = this.productos
      if (this.tabCatalogo !== 'general') {
        lista = lista.filter(p => p.tipo === this.tabCatalogo)
      }
      return lista
        .filter(
          p =>
            p.nombre.toLowerCase().includes(filtro) ||
            (p.id && p.id.toString().includes(filtro))
        )
        .sort((a, b) => {
          const stockA = a.tipo === 'servicio' ? 1 : a.stock ?? 0
          const stockB = b.tipo === 'servicio' ? 1 : b.stock ?? 0
          return Number(stockB > 0) - Number(stockA > 0)
        })
    },
    productosPaginados() {
      const start = (this.paginaCatalogo - 1) * this.productosPorPagina
      return this.productosFiltrados.slice(start, start + this.productosPorPagina)
    },
    totalPaginasCatalogo() {
      return Math.ceil(this.productosFiltrados.length / this.productosPorPagina)
    },
    ticketPaginado() {
      const start = (this.paginaTicket - 1) * this.itemsPorTicket
      return this.ticket.slice(start, start + this.itemsPorTicket)
    },
    totalPaginasTicket() {
      return Math.ceil(this.ticket.length / this.itemsPorTicket)
    },
    subtotal() {
      return this.ticket.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    },
    descuentoTotal() {
      return this.ticket.reduce(
        (sum, item) =>
          sum + item.precio * item.cantidad * (item.descuento / 100),
        0
      )
    },
    total() {
      return (this.subtotal - this.descuentoTotal).toFixed(2)
    },
    hayServicioEnTicket() {
      return this.ticket.some(item => item.tipo === 'Servicio')
    }
  },

  watch: {
    selectedClienteId(newVal) {
      this.cargarMascotasCliente(newVal)
      // Limpiar selección de mascota en servicios del ticket al cambiar cliente
      this.ticket.forEach(item => {
        if (item.tipo === 'Servicio') item.mascota_id = ''
      })
    }
  },

  mounted() {
    this.usuarioId = 1
    this.actualizarReloj()
    this.intervalo = setInterval(this.actualizarReloj, 1000)
  },

  beforeUnmount() {
    clearInterval(this.intervalo)
  },

  methods: {
    actualizarReloj() {
      const ahora = new Date()
      this.fecha = ahora.toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      this.hora = ahora.toLocaleTimeString('es-MX')
    },

    // clientes (local)
    cargarClientes() {},
    openClienteModal() {
      this.clienteForm = {
        nombre: '',
        telefono: '',
        correo: '',
        tieneMascota: false,
        mascota: { nombre: '', especie: '', edad: 0, unidad_edad: 'años', raza: '' }
      }
      const modalEl = document.getElementById('clienteModal')
      new bootstrap.Modal(modalEl).show()
    },
    guardarCliente() {
      if (!this.clienteForm.nombre.trim() || !this.clienteForm.apellidoPaterno.trim() || !this.clienteForm.apellidoMaterno.trim() || !this.clienteForm.edad || !this.clienteForm.telefono.trim()) {
        return Swal.fire('Error', 'Todos los campos son obligatorios', 'error')
      }
      // Generar nuevo id
      const nuevoId = this.clientes.length ? Math.max(...this.clientes.map(c => c.id)) + 1 : 1
      const nuevo = {
        id: nuevoId,
        nombre: this.clienteForm.nombre,
        apellidoPaterno: this.clienteForm.apellidoPaterno,
        apellidoMaterno: this.clienteForm.apellidoMaterno,
        edad: this.clienteForm.edad,
        telefono: this.clienteForm.telefono,
        mascotas: []
      }
      // Si hay mascota
      if (this.clienteForm.tieneMascota) {
        const nuevaMascota = {
          id: Date.now(),
          ...this.clienteForm.mascota
        }
        nuevo.mascotas.push(nuevaMascota)
      }
      this.clientes.push(nuevo)
      this.selectedClienteId = nuevo.id
      bootstrap.Modal.getInstance(document.getElementById('clienteModal')).hide()
      Swal.fire('Éxito', 'Cliente registrado', 'success')
    },
    cargarMascotasCliente(clienteId) {
      if (!clienteId) {
        this.mascotasCliente = []
        return
      }
      const cliente = this.clientes.find(c => c.id === clienteId)
      this.mascotasCliente = cliente && cliente.mascotas ? cliente.mascotas : []
    },

    // catálogo (local)
    cargarCatalogo() {},

    agregarAlTicket(producto) {
      const esServicio = producto.tipo === 'servicio';
      const esPaquete = producto.tipo === 'paquete';
      if (esServicio) {
        // Si estaba seleccionado 'General', lo deselecciona
        if (this.selectedClienteId === 'general') {
          this.selectedClienteId = '';
        }
        // Servicios siempre se agregan como una nueva línea, cantidad fija en 1
        this.ticket.push({
          id: producto.id,
          nombre: producto.nombre,
          tipo: producto.tipo,
          precio: producto.precio,
          cantidad: 1,
          descuento: 0,
          mascota_id: ''
        });
        return;
      }
      if (esPaquete) {
        // Si estaba seleccionado 'General', lo deselecciona
        if (this.selectedClienteId === 'general') {
          this.selectedClienteId = '';
        }
        // Revisar si ya hay un paquete diferente en el ticket
        const paqueteEnTicket = this.ticket.find(i => i.tipo === 'paquete');
        if (paqueteEnTicket && paqueteEnTicket.id !== producto.id) {
          Swal.fire('Solo un paquete', 'No puedes elegir dos paquetes diferentes en el mismo ticket', 'warning');
          return;
        }
        // Si ya existe el mismo paquete, aumentar cantidad
        const existe = this.ticket.find(i => i.id === producto.id);
        if (existe) {
          existe.cantidad++;
        } else {
          this.ticket.push({
            id: producto.id,
            nombre: producto.nombre,
            tipo: producto.tipo,
            precio: producto.precio,
            cantidad: 1,
            descuento: 0,
            mascota_id: '',
            meses: producto.id >= 10 ? 1 : undefined
          });
        }
        return;
      }
      // Productos
      const existe = this.ticket.find(i => i.id === producto.id);
      if (existe) {
        if (producto.stock > 0) {
          existe.cantidad++;
          producto.stock--;
        } else {
          Swal.fire('Sin stock', `No hay stock de ${producto.nombre}`, 'warning');
        }
      } else {
        this.ticket.push({
          id: producto.id,
          nombre: producto.nombre,
          tipo: producto.tipo,
          precio: producto.precio,
          cantidad: 1,
          descuento: 0
        });
        if (producto.stock !== undefined) producto.stock--;
      }
    },

    calcularTotalLinea(item) {
      let total = item.precio * item.cantidad;
      if (item.tipo === 'paquete' && item.id >= 10) {
        total = item.precio * item.cantidad * (item.meses || 1);
      }
      total = total * (1 - (item.descuento || 0) / 100);
      return total.toFixed(2);
    },

    eliminarItem(idx) {
      const item = this.ticket[idx]
      const prod = this.productos.find(p => p.id === item.id)
      if (prod && prod.stock !== undefined && item.tipo === 'producto') {
        prod.stock += item.cantidad
      }
      this.ticket.splice(idx, 1)
    },

    guardarVenta() {
      if (!this.selectedClienteId) {
        return Swal.fire('Error', 'Selecciona un cliente', 'error')
      }
      // Validar que cada servicio tenga mascota seleccionada si hay mascotas disponibles
      const serviciosSinMascota = this.ticket.filter(i => i.tipo === 'servicio' && this.mascotasCliente.length && !i.mascota_id)
      if (serviciosSinMascota.length) {
        return Swal.fire('Error', 'Selecciona una mascota para cada servicio', 'error')
      }
      Swal.fire('¡Listo!', 'Venta registrada localmente', 'success')
      this.cancelarVenta()
    },

    cancelarVenta() {
      this.ticket.forEach(item => {
        if (item.tipo === 'producto') {
          const prod = this.productos.find(p => p.id === item.id)
          prod.stock += item.cantidad
        }
      })
      this.ticket = []
      this.selectedClienteId = ''
      this.mascotaNombre = ''
      this.mascotaEspecie = ''
      this.mascotaRaza = ''
      this.mascotaEdad = 0
      this.mascotaUnidadEdad = 'años'
      this.observaciones = ''
      this.metodoPago = 'efectivo'
    },

    // generarPDF eliminado

    actualizarTotales() {
      this.ticket = [...this.ticket]
    },

    // mascotas (local)
    openMascotaModal() {
      if (!this.selectedClienteId) {
        return Swal.fire('Error', 'Selecciona un cliente primero', 'error')
      }
      this.nuevaMascota = {
        nombre: '',
        especie: '',
        edad: 0,
        unidad_edad: 'años',
        raza: ''
      }
      const modalEl = document.getElementById('mascotaModal')
      new bootstrap.Modal(modalEl).show()
    },
    guardarMascota() {
      if (!this.nuevaMascota.nombre.trim() || !this.nuevaMascota.especie.trim()) {
        return Swal.fire('Error', 'Nombre y especie son obligatorios', 'error')
      }
      const cliente = this.clientes.find(c => c.id === this.selectedClienteId)
      if (cliente) {
        const nuevaMascota = {
          id: Date.now(),
          ...this.nuevaMascota
        }
        if (!cliente.mascotas) cliente.mascotas = []
        cliente.mascotas.push(nuevaMascota)
        this.cargarMascotasCliente(this.selectedClienteId)
        bootstrap.Modal.getInstance(document.getElementById('mascotaModal')).hide()
        Swal.fire('Éxito', 'Mascota agregada', 'success')
      }
    }
  }
}
</script>





<style scoped>
@import '../assets/colors.css';

h5 {
  color: white;
}

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

.reloj {
  color: var(--claro-suave);
}

.tarjeta-tabla {
  background-color: var(--ambar-intenso);
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
.td-nombre, .td-edad, .td-correo, .td-telefono {
  vertical-align: middle;
  white-space: nowrap;
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


