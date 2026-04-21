<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="max-w-7xl mx-auto py-8 px-4">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-20 py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 class="text-2xl font-bold mb-4">Syshub</h3>
            <p class="text-gray-400">Ecosistema digital de aprendizaje continuo para la Facultad de Ingeniería en Sistemas</p>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">Enlaces</h4>
            <ul class="space-y-2 text-gray-400">
              <li><router-link to="/" class="hover:text-white transition">Inicio</router-link></li>
              <li><router-link to="/projects" class="hover:text-white transition">Proyectos</router-link></li>
              <li><router-link to="/forums" class="hover:text-white transition">Foros</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">Contacto</h4>
            <p class="text-gray-400">Email: info@syshub.edu</p>
            <p class="text-gray-400">Facultad de Ingeniería en Sistemas</p>
          </div>
        </div>
        <div class="border-t border-gray-700 pt-8">
          <p class="text-center text-gray-400">&copy; 2026 Syshub. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
