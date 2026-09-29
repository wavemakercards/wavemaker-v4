<template>
  <p v-if="$root.GoogleDriveApi.error" class="drive-error" role="alert">
    {{ $root.GoogleDriveApi.error }}
  </p>

  <button v-if="!$root.GoogleDriveApi.loggedin" @click="$root.GoogleDriveSignIn()"
    class="interfaceBtn GoogleDrive">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.71 3.5 1.15 15l3.43 6 6.55-11.5M9.73 15 6.3 21h13.12l3.43-6M22.28 14 15.42 2H8.58l6.85 12Z" />
    </svg>
    {{ this.$root.setlang.google.info }}
  </button>

  <div v-else class="drive-panel">
    <section v-if="$root.session.settings" class="drive-save-panel">
      <div class="drive-section-heading">
        <div>
          <span class="drive-eyebrow">Google Drive</span>
          <h3>{{ this.$root.setlang.google.saveinfo }}</h3>
          <p>{{ this.$root.session.settings.ProjectName }}</p>
        </div>
        <button @click="$root.GoogleDriveWriteFile()" class="interfaceBtn drive-save-button"
          :disabled="$root.GoogleDriveApi.loading">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13 19c0 .34.04.67.09 1H6.5C5 20 3.69 19.5 2.61 18.43 1.54 17.38 1 16.09 1 14.58c0-1.3.39-2.46 1.17-3.48S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4c1.95 0 3.6.68 4.96 2.04S19 9.05 19 11c1.15.13 2.1.63 2.86 1.5.51.57.84 1.21 1 1.92C21.82 13.54 20.5 13 19 13c-3.31 0-6 2.69-6 6Zm3-1h2v4h2v-4h2l-3-3-3 3Z" />
          </svg>
          {{ this.$root.setlang.google.save }}
        </button>
      </div>
    </section>

    <section class="drive-files-panel">
      <div class="drive-section-heading drive-files-heading">
        <div>
          <span class="drive-eyebrow">Cloud files</span>
          <h3>{{ this.$root.setlang.google.files }}</h3>
        </div>
        <button @click="$root.GoogleDriveApi.files = []; $root.GoogleDriveListFiles();"
          class="drive-refresh" aria-label="Refresh files" title="Refresh files"
          :disabled="$root.GoogleDriveApi.searching">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 14.5c1.11 0 2.11.45 2.83 1.17L22 14.5v4h-4l1.77-1.77A2.5 2.5 0 1 0 18 21c.82 0 1.54-.39 2-1h1.71a4.5 4.5 0 1 1-3.71-6.5ZM10 4l2 2h8c1.1 0 2 .9 2 2v5c-1-.62-2.21-1-3.5-1A6.5 6.5 0 0 0 12 18.5c0 .5.06 1 .17 1.5H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h6Z" />
          </svg>
        </button>
      </div>

      <div v-if="$root.GoogleDriveApi.searching" class="drive-loading" role="status">
        Loading files...
      </div>
      <div v-else-if="$root.GoogleDriveApi.files.length" class="drive-file-list">
        <div v-for="(f, i) in $root.GoogleDriveApi.files" :key="f.id || i">
          <button @click="openFile(f)" class="file">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2Zm0 12H4V8h16v10Z" />
            </svg>
            <span class="file-copy">
              <strong>{{ f.name }}</strong>
              <span class="smalltext">{{ formatFileSize(f.size) }} · {{ formatDate(f.modifiedTime) }}</span>
            </span>
          </button>
        </div>
      </div>
      <p v-else class="drive-empty">No Wavemaker files found in Google Drive.</p>
    </section>

    <footer class="drive-footer">
      <button @click="$root.GoogleDriveSignOut" class="drive-account-button">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 10c-4.42 0-8 1.79-8 4v2h9.5a6.5 6.5 0 0 1 .45-5.86A12.8 12.8 0 0 0 10 14Zm7.5-1A4.5 4.5 0 1 0 22 17.5a4.5 4.5 0 0 0-4.5-4.5Zm0 7a2.5 2.5 0 1 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5Z" />
        </svg>
        {{ this.$root.setlang.google.logout }}
      </button>
      <button class="drive-close-button" @click="$root.popup.name = null">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m14.59 8-2.59 2.59L9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8Z" />
        </svg>
        {{ this.$root.setlang.google.close }}
      </button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "GoogleDrive",
  methods: {
    async openFile(file) {
      if (!confirm("Opening this file will replace the current project. Continue?")) return
      await this.$root.GoogleDriveReadFile(file)
    },
    formatFileSize(size) {
      if (!size) return "Size unavailable"
      const bytes = Number(size)
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    },
    formatDate(timestamp) {
      if (!timestamp) return "Date unavailable"
      return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(timestamp))
    }
  }
}
</script>

<style scoped>
.GoogleDrive {
  width: 100%;
  margin: 8px 0 0;
}

.drive-panel {
  --drive-border: color-mix(in srgb, currentColor 14%, transparent);
  text-align: left;
  color:#000;
}

.drive-save-panel,
.drive-files-panel {
    border-radius: 6px;
  padding: 18px;
  border: 1px solid var(--drive-border);
  background: color-mix(in srgb, var(--paper) 70%, transparent);
}

.drive-save-panel {
  border-top: 3px solid var(--primary);
  margin-bottom: 18px;
}

.drive-section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.drive-section-heading h3 {
  margin: 3px 0 0;
  font-size: 1.25rem;
}

.drive-section-heading p {
  margin: 5px 0 0;
  opacity: 0.72;
}

.drive-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

.drive-save-button {
  flex: 0 0 auto;
  margin-top: 0;
}

.drive-save-button:disabled,
.drive-refresh:disabled {
  cursor: wait;
  opacity: 0.55;
}

.drive-files-heading {
  margin-bottom: 14px;
}

.drive-refresh {
  display: grid;
  width: 50px;
  height: 50px;
  padding: 0;
  place-items: center;
  border: 1px solid var(--drive-border);
  border-radius: 50%;
  background: transparent;
  color: inherit;
  fill: currentColor;
  cursor: pointer;
}

.drive-refresh svg {
  width: 30px;
  height: 30px;
}

.drive-refresh:hover,
.drive-refresh:focus-visible {
  background: var(--button-hover);
  color: var(--button-hover-f);
}

.drive-loading,
.drive-empty {
  padding: 24px 0 10px;
  text-align: center;
  opacity: 0.65;
}

.drive-file-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 12px;
}

.file {
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 52px 16px 16px;
  border: 1px solid var(--drive-border);
  border-radius: 6px;
  background: var(--paper);
  color: var(--paper-f);
  fill: var(--paper-f);
  text-align: left;
  cursor: pointer;
}

.file strong {
  display: block;
  overflow: hidden;
  font-size: 1.05rem;
  font-weight: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-copy {
  min-width: 0;
}

.file svg {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 30px;
  height: 30px;
}

.file:hover,
.file:focus-visible {
  background: var(--button-hover);
  color: var(--button-hover-f);
  fill: var(--button-hover-f);
}

.smalltext {
  display: block;
  margin-top: 4px;
  font-size: 0.78rem;
  opacity: 0.65;
}

@media (max-width: 560px) {
  .drive-file-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.drive-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-top: 18px;
}

.drive-account-button,
.drive-close-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 7px 12px;
  border: 1px solid var(--drive-border);
  border-radius: 5px;
  background: transparent;
  color: inherit;
  fill: currentColor;
  cursor: pointer;
}

.drive-account-button svg,
.drive-close-button svg {
  width: 18px;
  height: 18px;
}

.drive-account-button:hover,
.drive-account-button:focus-visible,
.drive-close-button:hover,
.drive-close-button:focus-visible {
  background: var(--button-hover);
  color: var(--button-hover-f);
  fill: var(--button-hover-f);
}

.drive-error {
  margin: 0 0 12px;
  padding: 10px 12px;
  border-left: 3px solid var(--error, #b00020);
  background: color-mix(in srgb, var(--error, #b00020) 12%, transparent);
  color: var(--error, #b00020);
  font-weight: 600;
}

@media (max-width: 480px) {
  .drive-save-panel,
  .drive-files-panel {
    padding: 14px;
  }

  .drive-section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .drive-save-button {
    width: 100%;
  }

  .drive-refresh {
    align-self: flex-end;
    margin-top: -42px;
  }
}
</style>
