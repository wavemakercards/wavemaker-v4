<template>
  <!-- Install App Prompt -->
  <div v-if="canInstall" class="pwa-prompt install-prompt">
    <div class="pwa-prompt-content">
      <div class="pwa-prompt-icon">📱</div>
      <div class="pwa-prompt-text">
        <h3>Install Wavemaker Cards</h3>
        <p>Install this app for a better experience with offline access and faster loading.</p>
      </div>
      <div class="pwa-prompt-actions">
        <button @click="installPWA" class="pwa-btn primary">Install</button>
        <button @click="closeInstallPrompt" class="pwa-btn secondary">Not now</button>
      </div>
    </div>
  </div>

  <!-- Update Available Prompt -->
  <div v-if="needRefresh" class="pwa-prompt update-prompt">
    <div class="pwa-prompt-content">
      <div class="pwa-prompt-icon">🔄</div>
      <div class="pwa-prompt-text">
        <h3>Update Available</h3>
        <p>A new version of Wavemaker Cards is available. Update now to get the latest features and improvements.</p>
      </div>
      <div class="pwa-prompt-actions">
        <button @click="handleUpdateApp" class="pwa-btn primary">Update Now</button>
        <button @click="closeUpdatePrompt" class="pwa-btn secondary">Later</button>
      </div>
    </div>
  </div>

  <!-- Offline Ready Notification -->
  <div v-if="offlineReady" class="pwa-prompt offline-ready">
    <div class="pwa-prompt-content">
      <div class="pwa-prompt-icon">✅</div>
      <div class="pwa-prompt-text">
        <h3>Ready to work offline</h3>
        <p>App cached successfully. You can now use Wavemaker Cards offline.</p>
      </div>
      <div class="pwa-prompt-actions">
        <button @click="closeOfflinePrompt" class="pwa-btn primary">Got it</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePWA } from '@/composables/usePWA.js'
import { watch } from 'vue'

const {
  needRefresh,
  offlineReady,
  canInstall,
  installPWA,
  updateApp,
  closeUpdatePrompt,
  closeInstallPrompt,
  closeOfflinePrompt
} = usePWA()

// Debug logging
watch(needRefresh, (newVal) => {
  console.log('PWA needRefresh changed:', newVal)
})

watch(offlineReady, (newVal) => {
  console.log('PWA offlineReady changed:', newVal)
})

watch(canInstall, (newVal) => {
  console.log('PWA canInstall changed:', newVal)
})

// Enhanced update function with logging
const handleUpdateApp = async () => {
  console.log('Update button clicked')
  try {
    await updateApp()
  } catch (error) {
    console.error('Update failed:', error)
  }
}
</script>

<style scoped>
.pwa-prompt {
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 350px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 10000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.pwa-prompt-content {
  padding: 20px;
}

.pwa-prompt-icon {
  font-size: 24px;
  margin-bottom: 12px;
}

.pwa-prompt-text h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.pwa-prompt-text p {
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.4;
  color: #666;
}

.pwa-prompt-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.pwa-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pwa-btn.primary {
  background: #424242;
  color: white;
}

.pwa-btn.primary:hover {
  background: #303030;
}

.pwa-btn.secondary {
  background: #f5f5f5;
  color: #666;
}

.pwa-btn.secondary:hover {
  background: #e0e0e0;
}

.install-prompt {
  border-left: 4px solid #4CAF50;
}

.update-prompt {
  border-left: 4px solid #2196F3;
}

.offline-ready {
  border-left: 4px solid #FF9800;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .pwa-prompt {
    background: #2a2a2a;
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .pwa-prompt-text h3 {
    color: #ffffff;
  }
  
  .pwa-prompt-text p {
    color: #cccccc;
  }
  
  .pwa-btn.secondary {
    background: #3a3a3a;
    color: #cccccc;
  }
  
  .pwa-btn.secondary:hover {
    background: #4a4a4a;
  }
}

/* Mobile responsive */
@media (max-width: 480px) {
  .pwa-prompt {
    bottom: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .pwa-prompt-actions {
    flex-direction: column;
  }
  
  .pwa-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>