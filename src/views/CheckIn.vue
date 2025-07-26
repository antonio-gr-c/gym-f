<template>
  <div class="contenedor-login">
    <!-- Botón casita -->
    <span class="material-icons casita" @click="irAlLogin" title="Volver al inicio">home</span>

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
import { useRouter } from 'vue-router'
const router = useRouter()

const irAlLogin = () => {
  router.push('/login') // Asegúrate que la ruta esté bien configurada
}


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

// Eliminar mock de usuarios y usar API

const verificarTelefono = async () => {
  if (!telefono.value) return;
  try {
    const res = await fetch('http://localhost:8080/backend/public/api/gym/acceso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefono: telefono.value })
    });
    const data = await res.json();
    if (!res.ok) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error de servidor' });
      return;
    }
    if (!data.acceso) {
      Swal.fire({ icon: 'error', title: 'Acceso denegado', text: data.mensaje || 'Acceso denegado' });
    } else {
      // acceso true
      let icon = 'success';
      let title = '¡Acceso aprobado!';
      let dias = data.dias_restantes;
      if (dias <= 5) {
        icon = 'warning';
        title = '¡Atención!';
      }
      Swal.fire({
        icon,
        title,
        html: `
          <p>${dias <= 5 ? `Tu membresía está por vencer. Faltan <strong>${dias} día(s)</strong>.` : `Faltan <strong>${dias} día(s)</strong> de membresía.`}</p>
          <hr/>
          <p><strong>Plan:</strong> ${data.paquete || ''}</p>
        `
      });
    }
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar al servidor.' });
  }
  telefono.value = '';
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
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
.casita {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2.2rem;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s ease, color 0.2s;
  color: #02040f;
}
.casita:hover {
  transform: scale(1.2);
  color: #93b84f;
}

</style>
