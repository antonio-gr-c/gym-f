<template>
  <div class="contenedor-login">
    <!-- Lado izquierdo con logo fijo -->
    <div class="lado-izquierdo">
      <img :src="logo" alt="Logo" class="logo" />
    </div>

    <!-- Lado derecho con formulario centrado -->
    <div class="lado-derecho">
      <div class="formulario">
        <h2>Bienvenido</h2>
        <p class="reloj">{{ reloj }}</p>
        <form @submit.prevent="verificarTelefono">
          <div class="campo">
            <label for="telefono">Número de teléfono</label>
            <input
              type="text"
              id="telefono"
              v-model="telefono"
              required
              maxlength="10"
              placeholder="Ej. 9510000000"
            />
          </div>
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Swal from 'sweetalert2'
import logo from '../assets/images/logo.png'

const telefono = ref('')
const reloj = ref('')
const capitalizar = texto => texto.charAt(0).toUpperCase() + texto.slice(1)

const actualizarReloj = () => {
  const ahora = new Date()
  const fecha = ahora.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const hora = ahora.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  reloj.value = `${capitalizar(fecha)}\n🕒 ${hora}`
}


let intervalo

onMounted(() => {
  actualizarReloj()
  intervalo = setInterval(actualizarReloj, 1000)
})

onUnmounted(() => {
  clearInterval(intervalo)
})

const usuarios = [
  {
    nombre: 'Fani',
    telefono: '9513009236',
    fecha_vencimiento: '2025-08-02',
    plan: 'Paquete 2 - Gym + Entrenador',
    promocion: 'Febrero - Amor y Amistad',
  },
  {
    nombre: 'Antonio',
    telefono: '9516577535',
    fecha_vencimiento: '2025-07-20',
    plan: 'Paquete 1 - Mensualidad Gym',
    promocion: 'Mes del Padre',
  },
  {
    nombre: 'Tadeo',
    telefono: '9510000000',
    fecha_vencimiento: '2025-07-25',
    plan: 'Paquete 4 - Gym + Entrenador + Fisioterapia',
    promocion: 'Inicio de año',
  },
]

const verificarTelefono = () => {
  const usuario = usuarios.find(u => u.telefono === telefono.value)

  if (!usuario) {
    Swal.fire({
      icon: 'error',
      title: 'No encontrado',
      text: 'Este número no está registrado.',
    })
    return
  }

  const hoy = new Date()
  const vencimiento = new Date(usuario.fecha_vencimiento)
  const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24))

  if (diasRestantes < 0) {
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      html: `
        <p>Tu membresía venció el <strong>${usuario.fecha_vencimiento}</strong>.</p>
        <hr/>
        <p><strong>Plan:</strong> ${usuario.plan}</p>
        <p><strong>Promoción:</strong> ${usuario.promocion}</p>
      `,
    })
  } else if (diasRestantes <= 5) {
    Swal.fire({
      icon: 'warning',
      title: `¡Hola, ${usuario.nombre}!`,
      html: `
        <p>Tu membresía está por vencer. Faltan <strong>${diasRestantes} día(s)</strong>.</p>
        <hr/>
        <p><strong>Plan:</strong> ${usuario.plan}</p>
        <p><strong>Promoción:</strong> ${usuario.promocion}</p>
      `,
    })
  } else {
    Swal.fire({
      icon: 'success',
      title: `¡Hola, ${usuario.nombre}!`,
      html: `
        <p>Acceso aprobado. Faltan <strong>${diasRestantes} día(s)</strong>.</p>
        <hr/>
        <p><strong>Plan:</strong> ${usuario.plan}</p>
        <p><strong>Promoción:</strong> ${usuario.promocion}</p>
      `,
    })
  }

  telefono.value = ''
}
</script>

<style scoped>
html,
body {
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
}

.contenedor-login {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.lado-izquierdo {
  width: 50%;
  background-color: #02040f;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  max-width: 90%;
  max-height: 80%;
  object-fit: contain;
}

.lado-derecho {
  width: 50%;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
}

.formulario {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.formulario h2 {
  margin-bottom: 0.8rem;
}

.reloj {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 500;
  white-space: pre-line; /* Importante para que el salto de línea funcione */
  line-height: 1.6;
}


.campo {
  margin-bottom: 1.2rem;
  text-align: left;
}

.campo label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.campo input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #02040f;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #93b84f;
}

@media screen and (max-width: 768px) {
  .contenedor-login {
    flex-direction: column;
  }

  .lado-izquierdo,
  .lado-derecho {
    width: 100%;
    height: 50vh;
  }

  .logo {
    max-height: 60%;
  }
}
</style>
