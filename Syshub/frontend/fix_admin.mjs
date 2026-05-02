import fs from 'fs';

const storeFile = 'src/stores/adminUiStore.ts';
let store = fs.readFileSync(storeFile, 'utf8');
if (!store.includes("| 'moderation'")) {
  store = store.replace("| 'overview'", "| 'overview'\n  | 'moderation'");
  fs.writeFileSync(storeFile, store);
}

const file = 'src/views/Admin.vue';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import ModerationPanel')) {
  content = content.replace(
      "import { useAdminUiStore, type AdminSection } from '@/stores/adminUiStore'",
      "import ModerationPanel from '../components/ModerationPanel.vue'\nimport { useAdminUiStore, type AdminSection } from '@/stores/adminUiStore'"
  );
  
  content = content.replace(
      "const menuItems: { key: AdminSection; label: string; description: string; icon: string }[] = [",
      "const menuItems: { key: AdminSection; label: string; description: string; icon: string }[] = [\n  { key: 'moderation', label: 'Moderación', description: 'Contenidos ocultos', icon: '🛡️' },"
  );
  
  // Inject the component render manually...
  // In <template>: ... <- Pending Student Requests List --> </div>
  // Let's add it right before `</main>` at the end.
  const injectComp = `
        <- Moderation Panel -->
        <ModerationPanel v-if="currentSection === 'moderation'" />
  `;
  content = content.replace("</main>", injectComp + "\n      </main>");
  
  fs.writeFileSync(file, content);
}
console.log('Fixed Admin.vue');
