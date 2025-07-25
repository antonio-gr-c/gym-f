<template>
  <div class="contenedor-login">
    <!-- Lado izquierdo: logo y color -->
    <div class="lado-izquierdo">
      <img :src="logo" alt="Logo" class="logo" />
    </div>

    <!-- Lado derecho: formulario -->
    <transition name="entrada">
      <div class="lado-derecho">
        <div class="formulario">
          <h2>Iniciar sesión</h2>
          <form @submit.prevent="iniciarSesion">
            <div class="campo">
              <label for="usuario">Usuario</label>
              <input type="text" id="usuario" v-model="usuario" required />
            </div>
            <div class="campo">
              <label for="contrasena">Contraseña</label>
              <input type="password" id="contrasena" v-model="contrasena" required />
            </div>
            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import logo from '../assets/images/logo.png'

const usuario = ref('')
const contrasena = ref('')
const router = useRouter()

const iniciarSesion = () => {
  if (usuario.value === '' || contrasena.value === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Campos vacíos',
      text: 'Por favor llena todos los campos.'
    })
    return
  }

  // Aquí pondrías tu lógica real de autenticación
  if (usuario.value === 'admin' && contrasena.value === 'admin') {
    Swal.fire({
      icon: 'success',
      title: 'Bienvenido',
      text: 'Inicio de sesión exitoso'
    }).then(() => {
      router.push('/')
    })
    // redirigir o guardar sesión...
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Credenciales incorrectas',
      text: 'Verifica tu usuario y contraseña.'
    })
  }
}
</script>

<style scoped>
@import '../assets/colors.css';
.contenedor-login {
  display: flex;
  height: 100vh;
  width: 100%;
}

.lado-izquierdo {
  flex: 1;
  background-color: var(--color-principal, #02040f);
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  max-width: 100%;
  height: 80%;
}

.lado-derecho {
  flex: 1;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: entrada 0.4s ease-out;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.formulario {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
}

.formulario h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.campo {
  margin-bottom: 1.2rem;
}

.campo label {
  display: block;
  margin-bottom: 0.5rem;
  color: #444;
}

.campo input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: var(--color-principal, #02040f);
  border: none;
  color: var(--color-texto-boton, #fff);
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: var(--color-acento, #93b84f);
}

@keyframes entrada {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
