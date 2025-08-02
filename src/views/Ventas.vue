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
          <button class="nav-link" :class="{active: tabCatalogo==='general'}"  @click="cambiarTab('general')">General</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{active: tabCatalogo==='producto'}"  @click="cambiarTab('producto')">Productos</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{active: tabCatalogo==='servicio'}"  @click="cambiarTab('servicio')">Servicios</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{active: tabCatalogo==='paquete'}"  @click="cambiarTab('paquete')">Paquetes</button>
        </li>
      </ul>

     <!-- justo debajo de las pestañas -->
<div class="mb-3">
  <input
    v-if="tabCatalogo==='general'"
    v-model="searchGeneral"
    placeholder="Buscar en General…"
    class="form-control"
  />
  <input
    v-else-if="tabCatalogo==='producto'"
    v-model="searchProducto"
    placeholder="Buscar Productos…"
    class="form-control"
  />
  <input
    v-else-if="tabCatalogo==='servicio'"
    v-model="searchServicio"
    placeholder="Buscar Servicios…"
    class="form-control"
  />
  <input
    v-else-if="tabCatalogo==='paquete'"
    v-model="searchPaquete"
    placeholder="Buscar Paquetes…"
    class="form-control"
  />
</div>


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
              :key="`${producto.id}-${producto.tipo}-${i}`"
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
                    <span v-if="item.tipo === 'servicio'">1</span>
                    <input
                      v-else-if="item.tipo === 'producto' || item.tipo === 'paquete'"
                      type="number"
                      min="1"
                      class="form-control form-control-sm text-center"
                      v-model.number="item.cantidad"
                      @input="actualizarTotales"
                    />
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
                      <option v-for="promo in promociones" :key="promo.nombre" :value="promo.nombre">
                        {{ promo.nombre }} ({{ promo.descuento }}%)
                      </option>
                    </select>
                  </td>
                  <td class="text-center">${{ calcularTotalLinea(item) }}</td>
                  <td class="text-center">
                    <div v-if="item.tipo === 'servicio'" class="mb-1">
                      <input type="date" class="form-control form-control-sm" v-model="item.fecha_servicio" />
                    </div>
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
                  <option :disabled="ticket.some(item => item.tipo === 'servicio' || item.tipo === 'paquete')" value="general">
                    General
                  </option>
                  <option v-for="c in clientes" :key="c.id" :value="c.id">
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
              </div>
            </div>
            <!-- Método de pago: solo efectivo -->
            <hr />
            <p><strong>Subtotal:</strong> <span class="text-secondary">${{ subtotal }}</span></p>
            <p><strong>Descuento total:</strong> <span class="text-secondary">${{ descuentoTotal }}</span></p>
            <h5><strong style="color: #000;">Total a pagar:</strong> <span class="text-success">${{ total }}</span></h5>
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
</template>


<script>
import Navbar from '../components/Navbar.vue'
import Swal from 'sweetalert2'

export default {
  name: 'Ventas',
  components: { Navbar },

  data() {
    return {
      promociones: [],
      tabCatalogo: 'general',

        searchGeneral: '',
    searchProducto: '',
    searchServicio: '',
    searchPaquete: '',

      // clientes y selección
      clientes: [],
      selectedClienteId: '',
      clienteForm: {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        edad: null,
        telefono: ''
      },

      // venta
      observaciones: '',
      usuarioId: null,

      // catálogo y ticket
      allProductos: [], // datos crudos del API
      productos: [],    // copia visual, nunca se muta directamente fuera de cargarCatalogo
      ticket: [],
      paginaCatalogo: 1,
      productosPorPagina: 10,
      paginaTicket: 1,
      itemsPorTicket: 10,

      // reloj
      fecha: '',
      hora: '',
      intervalo: null
    }
  },

  watch: {
    tabCatalogo() {
      // limpia todos los searches
      this.searchGeneral = ''
      this.searchProducto = ''
      this.searchServicio = ''
      this.searchPaquete = ''
      // vuelve a la primera página
      this.paginaCatalogo = 1
    }
  },

  computed: {
    clienteSeleccionado() {
      if (this.selectedClienteId === 'general') {
        return { id: 'general', nombre: 'General' }
      }
      return this.clientes.find(c => c.id === this.selectedClienteId) || {}
    },

    searchTerm() {
    switch (this.tabCatalogo) {
      case 'producto': return this.searchProducto.trim().toLowerCase()
      case 'servicio': return this.searchServicio.trim().toLowerCase()
      case 'paquete':  return this.searchPaquete.trim().toLowerCase()
      default:         return this.searchGeneral.trim().toLowerCase()
    }
    },
     productosFiltrados() {
      // Siempre filtra sobre allProductos
      let lista = this.allProductos.filter(p =>
        this.tabCatalogo === 'general' || p.tipo === this.tabCatalogo
      )
      if (this.searchTerm) {
        lista = lista.filter(p =>
          p.nombre.toLowerCase().includes(this.searchTerm) ||
          String(p.id).includes(this.searchTerm)
        )
      }
      // Ordena por id ascendente
      return lista.sort((a, b) => a.id - b.id)
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
        (sum, item) => sum + item.precio * item.cantidad * (item.descuento / 100),
        0
      )
    },
    total() {
      return (this.subtotal - this.descuentoTotal).toFixed(2)
    }
  },

  mounted() {
    this.usuarioId = 1
    this.actualizarReloj()
    this.intervalo = setInterval(this.actualizarReloj, 1000)
    this.cargarCatalogo()
    this.cargarClientes()
    this.cargarPromociones()
  },

  beforeUnmount() {
    clearInterval(this.intervalo)
  },

  methods: {
    aplicarPromocion(item) {
      if (!item.promocion) {
        item.descuento = 0;
        return;
      }
      const promo = this.promociones.find(p => p.nombre === item.promocion);
      if (promo && typeof promo.descuento === 'number') {
        item.descuento = promo.descuento;
      }
    },

     cambiarTab(tab) {
    this.tabCatalogo = tab;
    this.resetSearch();
    this.paginaCatalogo = 1;
  },
  resetSearch() {
    this.searchGeneral = '';
    this.searchProducto = '';
    this.searchServicio = '';
    this.searchPaquete = '';
  },


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

    async cargarPromociones() {
      try {
        const res = await fetch('http://localhost:8080/backend/public/api/gym/promociones')
        if (!res.ok) throw new Error('No se pudo cargar las promociones')
        this.promociones = await res.json()
      } catch (e) {
        Swal.fire('Error', e.message, 'error')
      }
    },

    async cargarClientes() {
      try {
        const res = await fetch('http://localhost:8080/backend/public/api/gym/clientes/paquetes')
        if (!res.ok) throw new Error('No se pudo cargar la lista de clientes')
        const data = await res.json()
        this.clientes = data.map(c => ({
          id: c.id_cliente,
          nombre: c.nombre_completo,
          edad: c.edad,
          telefono: c.telefono || '',
          paquete: c.paquete || '-',
          dias_restantes: c.dias_restantes || '-'
        }))
      } catch (e) {
        Swal.fire('Error', e.message, 'error')
      }
    },

    openClienteModal() {
    // Reinicia el formulario
    this.clienteForm = {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      edad: null,
      telefono: ''
    }
    // Abre el modal usando la misma instancia de Bootstrap que en tu función async
    const modalEl = document.getElementById('clienteModal')
    window.bootstrap.Modal.getOrCreateInstance(modalEl).show()
  },

  async guardarCliente() {
    const { nombre, apellidoPaterno, apellidoMaterno, edad, telefono } = this.clienteForm
    // Validación igual al método async de ejemplo
    if (!nombre || !apellidoPaterno || !apellidoMaterno || !edad || !telefono) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos.'
      })
    }

    try {
      // Envía al backend
      const response = await fetch('http://localhost:8080/backend/public/api/gym/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          edad,
          telefono
        })
      })
      const data = await response.json()

      if (response.ok) {
        // Éxito: notifica, limpia y cierra modal
        Swal.fire({
          icon: 'success',
          title: 'Cliente agregado',
          text: data.mensaje || 'Cliente agregado correctamente',
          showConfirmButton: false,
          timer: 1200
        })
        this.clienteForm = {
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          edad: null,
          telefono: ''
        }
        const modalEl = document.getElementById('clienteModal')
        window.bootstrap.Modal.getInstance(modalEl).hide()

        // Recarga lista de clientes y opcionalmente selecciona el nuevo
        await this.cargarClientes()
        if (data.id_cliente) {
          this.selectedClienteId = data.id_cliente
        }
      } else {
        // Error de API
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'No se pudo agregar el cliente.'
        })
      }
    } catch (error) {
      // Error de conexión
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar al servidor. Intenta más tarde.'
      })
    }
  },

    async cargarCatalogo() {
      try {
        const res = await fetch('http://localhost:8080/backend/public/api/gym/general')
        if (!res.ok) throw new Error('No se pudo cargar el catálogo')
        const data = await res.json()
        this.allProductos = data.map(item => ({
          ...item,
          precio: Number(item.precio),
          stock: item.tipo === 'producto' ? Number(item.stock) : undefined,
          cantidad: 1,
          descuento: 0
        }))
        this.productos = [...this.allProductos]
      } catch (e) {
        Swal.fire('Error', e.message, 'error')
      }
    },

    agregarAlTicket(producto) {
      const esServicio = producto.tipo === 'servicio'
      const esPaquete = producto.tipo === 'paquete'

      if (esServicio) {
        if (this.selectedClienteId === 'general') this.selectedClienteId = ''
        const hoy = new Date().toISOString().slice(0, 10)
        this.ticket.push({
          id: producto.id,
          nombre: producto.nombre,
          tipo: producto.tipo,
          precio: producto.precio,
          cantidad: 1,
          descuento: 0,
          fecha_servicio: hoy
        })
        return
      }

      if (esPaquete) {
        if (this.selectedClienteId === 'general') this.selectedClienteId = ''
        const existe = this.ticket.find(i => i.tipo === 'paquete' && i.id === producto.id)
        if (existe) {
          existe.cantidad++
        } else {
          this.ticket.push({
            id: producto.id,
            nombre: producto.nombre,
            tipo: producto.tipo,
            precio: producto.precio,
            cantidad: 1,
            descuento: 0
          })
        }
        return
      }

      // productos
      const existeProd = this.ticket.find(i => i.id === producto.id)
      if (existeProd) {
        if (producto.stock > 0) {
          existeProd.cantidad++
          // Actualiza stock solo en allProductos
          const prodRef = this.allProductos.find(p => p.id === producto.id)
          if (prodRef && prodRef.stock !== undefined) prodRef.stock--
        } else {
          Swal.fire('Sin stock', `No hay stock de ${producto.nombre}`, 'warning')
        }
      } else {
        this.ticket.push({
          id: producto.id,
          nombre: producto.nombre,
          tipo: producto.tipo,
          precio: producto.precio,
          cantidad: 1,
          descuento: 0
        })
        // Actualiza stock solo en allProductos
        const prodRef = this.allProductos.find(p => p.id === producto.id)
        if (prodRef && prodRef.stock !== undefined) prodRef.stock--
      }
    },

    calcularTotalLinea(item) {
      let total = item.precio * item.cantidad
      total *= 1 - (item.descuento || 0) / 100
      return total.toFixed(2)
    },

    eliminarItem(idx) {
      const item = this.ticket[idx]
      // Actualiza stock solo en allProductos
      const prod = this.allProductos.find(p => p.id === item.id)
      if (prod && prod.stock !== undefined && item.tipo === 'producto') {
        prod.stock += item.cantidad
      }
      this.ticket.splice(idx, 1)
    },

    async guardarVenta() {
      if (!this.selectedClienteId) {
        return Swal.fire('Error', 'Selecciona un cliente', 'error')
      }

      const errores = []

      // 1. Productos
      for (const item of this.ticket.filter(i => i.tipo === 'producto')) {
        const prod = this.productos.find(p => p.id === item.id)
        if (!prod || prod.stock < item.cantidad) {
          errores.push(`Stock insuficiente para ${item.nombre}`)
          continue
        }
        try {
          const total = (item.precio * item.cantidad * (1 - (item.descuento || 0) / 100)).toFixed(2)
          let res = await fetch('http://localhost:8080/backend/public/api/gym/ventas/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cantidad: item.cantidad,
              precio: total,
              total,
              descuento: item.descuento,
              id_producto: item.id
            })
          })
          let data = await res.json()
          if (!res.ok) {
            errores.push(data.error || `Error al vender ${item.nombre}`)
            continue
          }
          const nuevoStock = prod.stock - item.cantidad
          res = await fetch(`http://localhost:8080/backend/public/api/gym/productos/stock/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock_actual: nuevoStock })
          })
          data = await res.json()
          if (!res.ok) {
            errores.push(data.error || `Error al actualizar stock de ${item.nombre}`)
          }
        } catch {
          errores.push(`Error de red con ${item.nombre}`)
        }
      }

// 2. Servicios
for (const item of this.ticket.filter(i => i.tipo === 'servicio')) {
  try {
    const body = {
      cantidad: item.cantidad,
      precio: item.precio, // Precio unitario
      descuento: item.descuento || 0,
      id_servicio: item.id,
      id_cliente: this.selectedClienteId,
      fecha_agendada: item.fecha_servicio || null // Solo si es agendado
    };
    
    const res = await fetch('http://localhost:8080/backend/public/api/gym/ventas/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await res.json();
    if (!res.ok) {
      errores.push(data.error || `Error al vender servicio ${item.nombre}`);
    }
  } catch (error) {
    errores.push(`Error con servicio ${item.nombre}: ${error.message}`);
  }
}

      // 3. Paquete
      const paquete = this.ticket.find(i => i.tipo === 'paquete')
      if (paquete) {
        // Buscar cliente seleccionado
        const cliente = this.clientes.find(c => c.id === this.selectedClienteId)
        if (cliente && Number(cliente.dias_restantes) > 0) {
          Swal.fire({
            icon: 'warning',
            title: 'No se puede comprar paquete',
            text: `El cliente ${cliente.nombre} aún tiene ${cliente.dias_restantes} días restantes de su membresía actual. Debe esperar a que caduque para activar otra.`
          })
          return;
        }
        try {
          const total = (paquete.precio * paquete.cantidad * (1 - (paquete.descuento || 0) / 100)).toFixed(2)
          let id_promocion = null
          if (paquete.promocion) {
            const promo = this.promociones.find(p => p.nombre === paquete.promocion)
            if (promo?.id) id_promocion = promo.id
          }
          const body = {
            id_paquete: paquete.id,
            id_cliente: this.selectedClienteId,
            meses: paquete.cantidad,
            precio: total,
            total,
            descuento: paquete.descuento || 0,
            id_promocion
          }
          const res = await fetch('http://localhost:8080/backend/public/api/gym/ventas/paquetes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          })
          const data = await res.json()
          if (!res.ok) {
            errores.push(data.error || `Error al vender paquete ${paquete.nombre}`)
          }
        } catch {
          errores.push(`Error de red con paquete ${paquete.nombre}`)
        }
      }

      if (errores.length) {
        Swal.fire('Error', errores.join('\n'), 'error')
        return
      }

      Swal.fire('¡Listo!', 'Venta registrada correctamente', 'success')
      this.cancelarVenta()
      this.cargarCatalogo()
    },

    cancelarVenta() {
      this.ticket.forEach(item => {
        if (item.tipo === 'producto') {
          // Actualiza stock solo en allProductos
          const prod = this.allProductos.find(p => p.id === item.id)
          if (prod && prod.stock !== undefined) prod.stock += item.cantidad
        }
      })
      this.ticket = []
      this.selectedClienteId = ''
      this.observaciones = ''
    },

    actualizarTotales() {
      this.ticket = [...this.ticket]
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


