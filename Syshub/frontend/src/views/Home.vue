<template>
  <div class="space-y-16">
    <!-- HERO SECTION -->
    <section class="py-16 md:py-24">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <!-- Contenido Hero -->
        <div class="space-y-6">
          <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bienvenido a Syshub
          </h1>
          <p class="text-xl text-gray-600 leading-relaxed">
            El ecosistema digital de aprendizaje continuo para la Facultad de Ingeniería en Sistemas. 
            Conecta con compañeros, comparte proyectos y crece profesionalmente.
          </p>
          <div class="flex gap-4 flex-wrap">
            <router-link
              to="/register"
              class="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg"
            >
              Comenzar Ahora
            </router-link>
            <button
              @click="scrollToSection('caracteristicas')"
              class="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors text-lg"
            >
              Saber Más
            </button>
          </div>
          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">500+</div>
              <p class="text-gray-600">Estudiantes</p>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600">150+</div>
              <p class="text-gray-600">Proyectos</p>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-pink-600">1000+</div>
              <p class="text-gray-600">Temas Activos</p>
            </div>
          </div>
        </div>

        <!-- Ilustración Hero -->
        <div class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-12 h-96 flex items-center justify-center">
          <div class="text-center">
            <div class="text-7xl mb-4">🚀</div>
            <h3 class="text-2xl font-bold text-gray-800">Innovación y Colaboración</h3>
            <p class="text-gray-600 mt-2">Conecta, Aprende, Crece</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CARACTERÍSTICAS SECTION -->
    <section id="caracteristicas" class="py-16">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4">¿Por qué elegir Syshub?</h2>
        <p class="text-xl text-gray-600">Descubre las características que te ayudarán a crecer como ingeniero en sistemas</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon="📚"
          title="Repositorio de Proyectos"
          description="Comparte y colabora en proyectos académicos. Acceso a versiones, documentación y referencias."
          color="#3b82f6"
        />
        <FeatureCard
          icon="💬"
          title="Foros de Discusión"
          description="Participa en discusiones activas, resuelve dudas y aprende de tus compañeros."
          color="#8b5cf6"
        />
        <FeatureCard
          icon="👥"
          title="Red de Estudiantes"
          description="Conecta con otros estudiantes, crea equipos de trabajo y expande tu red profesional."
          color="#ec4899"
        />
        <FeatureCard
          icon="🔐"
          title="Seguridad y Privacidad"
          description="Tus datos están protegidos. Control total sobre quién accede a tus proyectos."
          color="#10b981"
        />
        <FeatureCard
          icon="📊"
          title="Análitica y Seguimiento"
          description="Visualiza tu progreso, contribuciones y estadísticas de aprendizaje."
          color="#f59e0b"
        />
        <FeatureCard
          icon="🎓"
          title="Recursos Educativos"
          description="Acceso a tutoriales, guías y contenido especializado para tu crecimiento."
          color="#06b6d4"
        />
      </div>
    </section>


    <!-- FAQ PREVIEW SECTION -->
    <section class="py-16">
      <h2 class="text-4xl font-bold mb-12 text-center">Preguntas Frecuentes</h2>
      
      <div class="space-y-6 max-w-3xl mx-auto">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <h3 class="text-xl font-bold mb-2">¿Es gratis usar Syshub?</h3>
          <p class="text-gray-600">Sí, Syshub es completamente gratuito para todos los estudiantes de la Facultad de Ingeniería en Sistemas.</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
          <h3 class="text-xl font-bold mb-2">¿Cómo comparto mis proyectos?</h3>
          <p class="text-gray-600">Una vez registrado, puedes crear proyectos, agregar descripción, documentación y invitar colaboradores.</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-600">
          <h3 class="text-xl font-bold mb-2">¿Puedo colaborar con otros estudiantes?</h3>
          <p class="text-gray-600">Absolutamente. Puedes crear equipos, invitar miembros y trabajar colaborativamente en tiempo real.</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <h3 class="text-xl font-bold mb-2">¿Qué soporte técnico hay disponible?</h3>
          <p class="text-gray-600">Contamos con documentación completa, tutoriales en video, y un equipo de soporte disponible 24/7.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import FeatureCard from '@/components/FeatureCard.vue'

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Animaciones suaves */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

section {
  animation: fadeInUp 0.8s ease-out;
}
</style>
