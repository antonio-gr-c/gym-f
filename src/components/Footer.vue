<template>
  <!-- Footer -->
  <footer class="footer-section">
    <div class="footer-container">
      <!-- Logo -->
      <div class="footer-logo">
        <img :src="logo" alt="Corinthya Logo" />
      </div>

      <!-- Dirección -->
      <div class="footer-direccion">
        <a href="https://maps.app.goo.gl/BhGSnnxiVvwQHJTL9" target="_blank" rel="noopener" class="footer-direccion-link">
          Avenida Universidad 100, Universidad,<br/>
          Exhacienda Candiani, <strong>68130 Santa Cruz Xoxocotlán, Oax</strong><br/>
          Local A14, Piso 1
        </a>
      </div>

      <!-- Aviso y redes sociales -->
      <div class="footer-accion">
        <ul class="footer-redes-lista">
          <li>
            <a
              href="https://www.facebook.com/corinthya/?locale=es_LA"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
            >
              Facebook
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/corinthyamodatextil/?hl=es"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              href="https://wa.link/hb3d1p"
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp"
            >
              WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logo from '../assets/images/logo.png'
</script>

<style scoped>
@import '../assets/colors.css';
.footer-section {
  background-color: var(--negro-profundo);
  color: var(--blanco);
  padding: 4rem 0;
  box-shadow: 0 -8px 32px rgba(0,0,0,0.18), 0 -1.5px 0 rgba(0,0,0,0.08); /* Sombra superior para dividir del FAQ */
  z-index: 2;
  position: relative;
}
.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 2.5rem;
}
.footer-logo img {
  height: 100px;
  object-fit: contain;
}
.footer-direccion {
  flex: 1 1 400px;
  text-align: center;
  font-size: 1rem;
  line-height: 1.5;
  margin: 1rem 0;
}
.footer-direccion-link {
  color: var(--blanco);
  text-decoration: underline;
  font-size: 1rem;
  line-height: 1.5;
  transition: color 0.3s;
}
.footer-direccion-link:hover {
  color: var(--ambar-intenso);
}
.footer-accion {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.footer-redes-lista {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
}
.footer-redes-lista li a {
  color: var(--blanco);
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s;
}
.footer-redes-lista li a:hover {
  color: var(--ambar-intenso);
}
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 0 1rem;
  }
  .footer-direccion {
    order: 2;
    margin-bottom: -250px;
  }
  .footer-logo {
    order: 1;
  }
  .footer-accion {
    order: 3;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  .footer-redes-lista {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
}
</style>
