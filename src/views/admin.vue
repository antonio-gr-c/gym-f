<template>


  <div class="container mt-4">
    <!-- Encabezado -->
    <div class="encabezado-dashboard d-flex flex-wrap justify-content-between align-items-center p-3 mb-4">
      <div class="saludo">
        <h4 class="m-0">
          Bienvenido <span class="rol">(Administrador)</span>
        </h4>
      </div>
      <div class="reloj text-end">
        <p class="m-0">{{ fechaFormateada }}</p>
        <p class="m-0">{{ horaFormateada }}</p>
      </div>
    </div>

    <!-- Gráfica de barras: Entradas al gimnasio -->
    <div class="row mb-4 justify-content-center">
      <div class="col-12 mb-3 d-flex justify-content-center">
        <div class="card grafica-blanca h-100 w-100" style="max-width: 700px; margin: 0 auto;">
          <div class="card-body p-4 d-flex flex-column align-items-center justify-content-center">
            <h6 class="card-title d-flex align-items-center mb-3" style="color:#1a1d2b;font-weight:bold; font-size:1.3rem;">
              <i class="material-icons me-2" style="font-size:1.5rem;">bar_chart</i>
              Entradas al gimnasio
            </h6>
            <canvas ref="barrasRef" height="220" style="max-width:100%; min-width:300px;"></canvas>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin de gráfica de barras -->


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

  </div>
</template>

<script>
import { onMounted, ref, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'

export default {
  components: {  },
  setup() {
    const barrasRef = ref(null)
    const fechaFormateada = ref('')
    const horaFormateada = ref('')

    // Gráfica de barras: datos dinámicos desde el endpoint
    const datosBarras = ref({
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      data: [0, 0, 0, 0, 0, 0, 0]
    })
    async function cargarEntradasSemana() {
      try {
        const response = await fetch('http://localhost:8080/backend/public/api/gym/entradas/semana')
        const data = await response.json()
        if (Array.isArray(data)) {
          datosBarras.value.labels = data.map(d => d.dia)
          datosBarras.value.data = data.map(d => d.cantidad)
        }
      } catch (e) {
        // Si hay error, deja los datos en cero
      }
    }
    // Tarjetas KPI: datos dinámicos desde el endpoint
    function formatCurrency(value) {
      return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 })
    }
    const kpis = ref([
      { titulo: 'Ventas del día', valor: '...', icono: 'attach_money' },
      { titulo: 'Ventas del mes', valor: '...', icono: 'calendar_today' },
      { titulo: 'Clientes registrados', valor: '...', icono: 'people' },
      { titulo: 'Membresías activas', valor: '...', icono: 'card_membership' },
      { titulo: 'Asistencias hoy', valor: '...', icono: 'how_to_reg' },
      { titulo: 'Membresías por vencer', valor: '...', icono: 'event_busy' },
    ])
    async function cargarKpisDashboard() {
      try {
        // Ejecutar el endpoint de actualizar días restantes antes de cargar dashboard
        fetch('http://localhost:8080/backend/public/api/gym/actualizar-dias-restantes', {
          method: 'GET'
        }).catch(() => {})

        const response = await fetch('http://localhost:8080/backend/public/api/gym/dashboard')
        const data = await response.json()
        if (data && typeof data === 'object') {
          kpis.value = [
            { titulo: 'Ventas del día', valor: formatCurrency(data.ventas_dia), icono: 'attach_money' },
            { titulo: 'Ventas del mes', valor: formatCurrency(data.ventas_mes), icono: 'calendar_today' },
            { titulo: 'Clientes registrados', valor: data.clientes_registrados, icono: 'people' },
            { titulo: 'Membresías activas', valor: data.membresias_activas, icono: 'card_membership' },
            { titulo: 'Asistencias hoy', valor: data.asistencias_hoy, icono: 'how_to_reg' },
            { titulo: 'Membresías por vencer', valor: data.membresias_por_vencer, icono: 'event_busy' },
          ]
        }
      } catch (e) {
        // Si hay error, deja los valores en '...'
      }
    }
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
    let chartInstance = null
    onMounted(async () => {
      // Inicializar reloj y fecha
      actualizarFechaHora()
      intervalo = setInterval(actualizarFechaHora, 1000)

      await Promise.all([
        cargarEntradasSemana(),
        cargarKpisDashboard()
      ])
      // Gráfica de barras: Entradas al gimnasio
      chartInstance = new Chart(barrasRef.value, {
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
    })

    onUnmounted(() => {
      if (intervalo) clearInterval(intervalo)
    })

    return {
      barrasRef,
      fechaFormateada,
      horaFormateada,
      datosBarras,
      kpis,
      accesos,
      membresiasPorVencer,
      ultimosClientes,
      productosMasVendidos,
      productosStockBajo
    }
  },

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
