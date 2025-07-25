<template>


  <div class="container mt-4">
    <!-- Encabezado -->
    <div class="encabezado-dashboard d-flex flex-wrap justify-content-between align-items-center p-3 mb-4">
      <div class="saludo">
        <h4 class="m-0">
          Hola, Tadeo <span class="rol">(Administrador)</span>
        </h4>
      </div>
      <div class="reloj text-end">
        <p class="m-0">{{ fechaFormateada }}</p>
        <p class="m-0">{{ horaFormateada }}</p>
      </div>
    </div>

    <!-- Gráficas en dos columnas -->
    <div class="row mb-4">
      <div class="col-md-6 mb-3">
        <div class="card grafica-blanca h-100">
          <div class="card-body p-2 d-flex flex-column align-items-center justify-content-center">
            <h6 class="card-title d-flex align-items-center mb-2" style="color:#1a1d2b;font-weight:bold;">
              <i class="material-icons me-2" style="font-size:1.2rem;">bar_chart</i>
              Entradas al gimnasio
            </h6>
            <canvas ref="barrasRef" height="140" style="max-width:100%;"></canvas>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card grafica-blanca h-100">
          <div class="card-body p-2 d-flex flex-column align-items-center justify-content-center">
            <h6 class="card-title d-flex align-items-center mb-2" style="color:#1a1d2b;font-weight:bold;">
             
           
            </h6>
            <canvas ref="pastelRef" height="180" width="180" style="max-width:100%;"></canvas>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin de gráficas en dos columnas -->


    <!-- Tarjetas KPI -->
    <div class="row mb-4 align-items-stretch">
      <div class="col-md-3 col-lg-2 mb-3" v-for="(kpi, index) in kpis" :key="index">
        <div class="card tarjeta-kpi h-100">
          <div class="card-body kpi-body">
            <i class="material-icons kpi-icon">{{ kpi.icono }}</i>
            <h5 class="kpi-valor">{{ kpi.valor }}</h5>
            <p class="kpi-titulo">{{ kpi.titulo }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin de tarjetas KPI -->

   

    <!-- Tablas de contexto gym -->
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card h-100 tarjeta-tabla">
          <div class="card-body">
            <h5 class="card-title d-flex align-items-center">
              <i class="material-icons me-2">event_busy</i>
              Membresías próximas a vencer
            </h5>
            <div class="tabla-scroll">
              <table class="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Vence</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in membresiasPorVencer" :key="i">
                    <td>{{ m.cliente }}</td>
                    <td>{{ m.tipo }}</td>
                    <td>{{ m.vence }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-4">
        <div class="card h-100 tarjeta-tabla">
          <div class="card-body">
            <h5 class="card-title d-flex align-items-center">
              <i class="material-icons me-2">person_add</i>
              Últimos clientes registrados
            </h5>
            <div class="tabla-scroll">
              <table class="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha alta</th>
                    <th>Tipo Membresía</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(c, i) in ultimosClientes" :key="i">
                    <td>{{ c.nombre }}</td>
                    <td>{{ c.fechaAlta }}</td>
                    <td>{{ c.tipoMembresia }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin tablas contexto gym -->

    <!-- Productos más vendidos y stock bajo -->
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card h-100 tarjeta-tabla">
          <div class="card-body">
            <h5 class="card-title d-flex align-items-center">
              <i class="material-icons me-2">trending_up</i>
              Productos y servicios más vendidos
            </h5>
            <div class="tabla-scroll">
              <table class="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Nombre</th>
                    <th>Cantidad vendida</th>
                    <th>Ingreso total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, i) in productosMasVendidos" :key="i">
                    <td>{{ p.tipo }}</td>
                    <td>{{ p.nombre }}</td>
                    <td>{{ p.cantidadVendida }}</td>
                    <td>{{ p.ingresoTotal }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos con stock bajo -->
      <div class="col-md-6 mb-4">
        <div class="card h-100 tarjeta-tabla">
          <div class="card-body">
            <h5 class="card-title d-flex align-items-center">
              <i class="material-icons me-2 text-warning">warning</i>
              Productos con stock bajo
            </h5>
            <div class="tabla-scroll">
              <table class="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Mínimo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, i) in productosStockBajo" :key="i">
                    <td>{{ p.nombre }}</td>
                    <td>{{ p.stock }}</td>
                    <td>{{ p.minimo }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin de tablas -->
  </div>
</template>

<script>
import { onMounted, ref, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'

export default {
  components: {  },
  setup() {
    const barrasRef = ref(null)
    const pastelRef = ref(null)
    const fechaFormateada = ref('')
    const horaFormateada = ref('')

    // Arrays de datos para todo el dashboard
    const datosBarras = ref({
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      data: [80, 95, 110, 105, 120, 130, 90]
    })
    const datosPastel = ref({
      labels: ['Área Kids Funcional', 'Funcional Adultos', 'Área de Pesas', 'Área de Fisioterapia'],
      data: [40, 55, 80, 25]
    })
    const kpis = ref([
      { titulo: 'Ventas del día', valor: '$1,250.00', icono: 'attach_money' },
      { titulo: 'Ventas del mes', valor: '$32,000.00', icono: 'calendar_today' },
      { titulo: 'Clientes registrados', valor: '182', icono: 'people' },
      { titulo: 'Membresías activas', valor: '95', icono: 'card_membership' },
      { titulo: 'Asistencias hoy', valor: '54', icono: 'how_to_reg' },
      { titulo: 'Membresías por vencer', valor: '7', icono: 'event_busy' },
    ])
    const accesos = ref([
      { label: 'Registrar asistencia', icono: 'how_to_reg', ruta: '#' },
      { label: 'Nueva membresía', icono: 'card_membership', ruta: '#' },
      { label: 'Agendar clase grupal', icono: 'event', ruta: '#' },
      { label: 'Nueva venta', icono: 'point_of_sale', ruta: '#' }
    ])
    const membresiasPorVencer = ref([
      { cliente: 'Juan Pérez', tipo: 'Mensual', vence: '25/07/2025' },
      { cliente: 'María López', tipo: 'Anual', vence: '28/07/2025' },
      { cliente: 'Carlos Ruiz', tipo: 'Mensual', vence: '30/07/2025' }
    ])
    const ultimosClientes = ref([
      { nombre: 'Laura Gómez', fechaAlta: '20/07/2025', tipoMembresia: 'Mensual' },
      { nombre: 'Pedro Sánchez', fechaAlta: '19/07/2025', tipoMembresia: 'Trimestral' },
      { nombre: 'Andrea Torres', fechaAlta: '18/07/2025', tipoMembresia: 'Anual' }
    ])
    const productosMasVendidos = ref([
      { tipo: 'Producto', nombre: 'Proteína Whey', cantidadVendida: 150, ingresoTotal: '$7,500.00' },
      { tipo: 'Producto', nombre: 'Guantes de gimnasio', cantidadVendida: 90, ingresoTotal: '$2,250.00' },
      { tipo: 'Producto', nombre: 'Bandas de resistencia', cantidadVendida: 70, ingresoTotal: '$1,400.00' },
      { tipo: 'Servicio', nombre: 'Entrenamiento personalizado', cantidadVendida: 60, ingresoTotal: '$12,000.00' }
    ])
    const productosStockBajo = ref([
      { nombre: 'Proteína Whey', stock: 5, minimo: 20 },
      { nombre: 'Guantes de gimnasio', stock: 10, minimo: 30 },
      { nombre: 'Bandas de resistencia', stock: 7, minimo: 15 }
    ])

    function actualizarFechaHora() {
      const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
      const ahora = new Date()
      const diaSemana = dias[ahora.getDay()]
      const dia = ahora.getDate()
      const mes = meses[ahora.getMonth()]
      const anio = ahora.getFullYear()
      fechaFormateada.value = `${diaSemana}, ${dia} de ${mes} de ${anio}`
      const horas = String(ahora.getHours()).padStart(2, '0')
      const minutos = String(ahora.getMinutes()).padStart(2, '0')
      const segundos = String(ahora.getSeconds()).padStart(2, '0')
      horaFormateada.value = `${horas}:${minutos}:${segundos}`
    }

    let intervalo = null
    onMounted(() => {
      // Inicializar reloj y fecha
      actualizarFechaHora()
      intervalo = setInterval(actualizarFechaHora, 1000)

      // Gráfica de barras: Entradas al gimnasio
      new Chart(barrasRef.value, {
        type: 'bar',
        data: {
          labels: datosBarras.value.labels,
          datasets: [{
            label: 'Entradas al gimnasio',
            data: datosBarras.value.data,
            backgroundColor: [
              '#1a1d2b', '#e5dada', '#333', '#02040f', '#e5dada', '#1a1d2b', '#333'
            ],
            borderColor: [
              '#02040f', '#333', '#1a1d2b', '#e5dada', '#333', '#02040f', '#1a1d2b'
            ],
            borderWidth: 2,
            borderRadius: 8,
            barThickness: 18,
            pointBackgroundColor: '#1a1d2b',
            pointBorderColor: '#e5dada',
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#1a1d2b', font: { size: 10 } },
              grid: { color: '#e5dada' }
            },
            x: {
              ticks: { color: '#1a1d2b', font: { size: 10 } },
              grid: { color: '#e5dada' }
            }
          }
        }
      })
      // Gráfica de pastel: Entradas a áreas
      new Chart(pastelRef.value, {
        type: 'pie',
        data: {
          labels: datosPastel.value.labels,
          datasets: [{
            data: datosPastel.value.data,
            backgroundColor: [
              '#1a1d2b', '#e5dada', '#333', '#02040f'
            ],
            borderColor: [
              '#02040f', '#333', '#1a1d2b', '#e5dada'
            ],
            borderWidth: 2,
            pointBackgroundColor: '#1a1d2b',
            pointBorderColor: '#e5dada',
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: { color: '#1a1d2b', font: { weight: 'bold', size: 10 } }
            },
            title: {
              display: true,
              text: 'Entradas a áreas',
              color: '#1a1d2b',
              font: { size: 16, weight: 'bold' }
            }
          }
        }
      })
    })

    onUnmounted(() => {
      if (intervalo) clearInterval(intervalo)
    })

    return {
      barrasRef,
      pastelRef,
      fechaFormateada,
      horaFormateada,
      datosBarras,
      datosPastel,
      kpis: kpis.value,
      accesos: accesos.value,
      membresiasPorVencer: membresiasPorVencer.value,
      ultimosClientes: ultimosClientes.value,
      productosMasVendidos: productosMasVendidos.value,
      productosStockBajo: productosStockBajo.value
    }
  },
  // Eliminado data(), todo se gestiona por arrays en setup
}
</script>

<style scoped>
@import '../assets/colors.css';
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
  min-width: 0;
}

.tarjeta-kpi:hover {
  transform: scale(1.02);
}

/* KPI pila: icono arriba, luego valor, luego texto */
.kpi-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  text-align: center;
  gap: 0.2rem;
  height: 100%;
}
.kpi-icon {
  font-size: 2.5rem;
  color: var(--ambar-intenso);
  margin-bottom: 0.2rem;
}
.kpi-valor {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  min-width: 0;
  word-break: break-word;
  text-align: center;
}
.kpi-titulo {
  font-size: 1rem;
  margin: 0;
  color: var(--negro-profundo);
  word-break: break-word;
  text-align: center;
}

@media (max-width: 600px) {
  .kpi-body {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.3rem;
  }
  .kpi-icon {
    margin-right: 0;
    margin-bottom: 0.3rem;
  }
  .kpi-text {
    width: 100%;
    min-width: 0;
  }
  .tarjeta-kpi {
    padding: 0.5rem 0.2rem;
  }
}

.tarjeta-tabla {
  background-color: var(--ambar-intenso);
  color: var(--blanco);
  border-radius: 10px;
}

.tarjeta-tabla .card-title i {
  font-size: 1.3rem;
  color: var(--blanco);
}

.tabla-scroll {
  background-color: var(--blanco);
  border-radius: 6px;
  padding: 0.5rem;
  overflow-x: auto;
  color: var(--negro);
}


.btn-acceso-grande {
  background-color: var(--ambar-intenso);
  color: var(--blanco);
  border-radius: 16px;
  padding: 2rem 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  min-height: 130px;
  display: block;
  text-decoration: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
}

.btn-acceso-grande:hover {
  background-color: var(--claro-suave);
  color: var(--negro-profundo);
  transform: scale(1.02);
}

.btn-acceso-grande i {
  font-size: 2rem;
}

.grafica-blanca {
  background: var(--blanco);
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.07);
  color: var(--negro-profundo);
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.grafica-blanca canvas {
  max-width: 100%;
  display: block;
  margin: 0 auto;
}
</style>
