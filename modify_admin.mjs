import fs from 'fs'

const path = '/home/CruzZapil/Escritorio/Proyecto final/Teo1/Syshub/frontend/src/views/Admin.vue'
let content = fs.readFileSync(path, 'utf8')

// Add menu item
const regexMenuItems = /const menuItems[^\]]*\]/m
content = content.replace(regexMenuItems, (match) => {
  if (match.includes("'moderation'")) return match
  let temp = match.replace(/\]\s*$/, "  { key: 'moderation', label: 'Moderación', description: 'Contenidos ocultos', icon: '🛡️' },\n]")
  return temp
})

// Insert component logic into template
if (!content.includes('ModerationPanel')) {
  // Let's see how <section> is rendered.
  // Actually, inside `<transition name="fade" mode="out-in">` maybe?
  const viewRouterOrComponentMap = `import ModerationPanel from '../components/ModerationPanel.vue'`
  
  if (content.includes('<script setup lang="ts">')) {
     content = content.replace('<script setup lang="ts">', '<script setup lang="ts">\n' + viewRouterOrComponentMap)
  }
}

const sectionRegex = /(<section v-else-if="adminUi\.activeSection === 'student-requests'"[\s\S]*?<\/section>)/

content = content.replace(sectionRegex, (match) => {
   return match + `\n\n        <section v-else-if="adminUi.activeSection === 'moderation'" class="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow border border-blue-100">
          <ModerationPanel />
        </section>`
})


fs.writeFileSync(path, content)
