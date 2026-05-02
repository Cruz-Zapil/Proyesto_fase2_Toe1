import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type AdminSection =
  | 'overview'
  | 'moderation'
  | 'users'
  | 'division'
  | 'career'
  | 'course'
  | 'offer'
  | 'teacher-requests'
  | 'student-requests'

export const useAdminUiStore = defineStore('admin-ui', () => {
  const menuOpen = ref(false)
  const activeSection = ref<AdminSection>('overview')

  const activeLabel = computed(() => activeSection.value)

  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }

  function openMenu() {
    menuOpen.value = true
  }

  function closeMenu() {
    menuOpen.value = false
  }

  function selectSection(section: AdminSection) {
    activeSection.value = section
    menuOpen.value = false
  }

  return {
    menuOpen,
    activeSection,
    activeLabel,
    toggleMenu,
    openMenu,
    closeMenu,
    selectSection,
  }
})
