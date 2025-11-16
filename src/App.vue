<template>
  <div v-if="this.$root.session.settings">
    <Start />
  </div>
  <div v-if="!this.$root.session.settings">
    <WelcomeScreen />
  </div>

  <CardModal v-if="$root.session.EditCard" :key="$root.EditCardrefresh" />


  <ImageManager v-if="$root.imagemanager" />
  <PopupManager />
  <PWAPrompt />
  <Version3Import v-if="v3import" />
  <!--
  Hidden File open element
  this is used byt the fileManage.js to trigger a file open dialogue
 -->
  <input type="file" id="wavemakerHiddenPicker" name="upload" accept=".wm4" @change="file_load" style="display: none" />
</template>

<script>
import './css/wavemakerInterface.css'
import './css/transitions.css'
import myPackage from "../package.json"
import fileManage from './mixins/fileManage.js'
import dexieDB from './mixins/dexieDB.js'
import templateObjects from './mixins/templateObjects.js'
import GoogleDriveApi from './mixins/GoogleDriveApi.js'
import PopupManager from '@/components/popups/PopupManager.vue'
import WelcomeScreen from '@/components/WelcomeScreen.vue'
import Start from '@/components/Start.vue'
import { v4 as uuid } from "uuid";
import Languages from "./lang.json";
import CardModal from "@/components/universal/CardModal.vue"
import ImageManager from "@/components/universal/ImageManager.vue"
import Version3Import from "./utilitystuff/version3Importer.vue"
import PWAPrompt from "@/components/PWAPrompt.vue"
import { usePWA } from '@/composables/usePWA.js'
import { useFontLoader } from '@/composables/useFontLoader.js'
export default {
  name: 'App',
  mixins: [fileManage, dexieDB, GoogleDriveApi, templateObjects],
  setup() {
    const { initVitePWA } = usePWA()
    const { loadGoogleFont, preloadFonts, getFontSuggestions } = useFontLoader()
    return { 
      initVitePWA, 
      loadGoogleFont, 
      preloadFonts, 
      getFontSuggestions 
    }
  },
  components: {
    PopupManager,
    WelcomeScreen,
    Start,
    CardModal,
    ImageManager,
    Version3Import,
    PWAPrompt
  },
  watch: {
    // Watch for font changes and load Google Fonts dynamically
    '$root.session.settings.documentprefs.font': {
      async handler(newFont) {
        if (newFont) {
          try {
            await this.loadGoogleFont(newFont);
            document.documentElement.style.setProperty('--pageEditor-font', newFont);
          } catch (error) {
            console.warn('Font loading failed, using fallback:', error);
            document.documentElement.style.setProperty('--pageEditor-font', newFont);
          }
        }
      },
      deep: false
    },
    // Watch for distraction-free font changes
    '$root.session.settings.documentprefs.distractionfree_font': {
      async handler(newFont) {
        if (newFont) {
          try {
            await this.loadGoogleFont(newFont);
            document.documentElement.style.setProperty('--distractionfree-font', newFont);
          } catch (error) {
            console.warn('Distraction-free font loading failed, using fallback:', error);
            document.documentElement.style.setProperty('--distractionfree-font', newFont);
          }
        }
      },
      deep: false
    }
  },
  /*
   watch: {  // for dev
    session: {
      // handler(newValue, oldValue) {
        handler(newValue) {
        localStorage.setItem("wmDev", JSON.stringify(newValue));
      },
      deep: true
    }
  },
  */
  data() {
    return {
      myPackage,
      EditCardrefresh: null,
      theme: "default",
      themeList: [
        { name: "Default Wavemaker", file: "wavemaker" },
        { name: "Light Theme", file: "light" },
        { name: "Blue Sky", file: "bluesky" }
      ],
      lhspin: true,
      rhspin: true,
      navbar: false,
      togglenav: true,
      show: false,
      popup: {
        name: null
      },
      lang: "en",
      language: Languages,
      setlang: null,
      uuid,
      session: {},
      navshow: true,
      imagemanager: false,
      v3import: false,
      fullWordCount: 0
    }
  },
  methods: {
    // Update font settings and load Google Fonts if needed
    async updateDocumentFont() {
      const settings = this.$root.session?.settings?.documentprefs;
      if (settings) {
        // Load main editor font
        if (settings.font) {
          try {
            await this.loadGoogleFont(settings.font);
            document.documentElement.style.setProperty('--pageEditor-font', settings.font);
          } catch (error) {
            console.warn('Main font loading failed, using fallback:', error);
            document.documentElement.style.setProperty('--pageEditor-font', settings.font);
          }
        }
        
        // Load distraction-free font
        if (settings.distractionfree_font) {
          try {
            await this.loadGoogleFont(settings.distractionfree_font);
            document.documentElement.style.setProperty('--distractionfree-font', settings.distractionfree_font);
          } catch (error) {
            console.warn('Distraction-free font loading failed, using fallback:', error);
            document.documentElement.style.setProperty('--distractionfree-font', settings.distractionfree_font);
          }
        }
      }
    },

    async calcFullWordCount() {
      let counter = 0
      if (this.$root.session.writer.selected) {
        let arr = await this.$root.db.Files.where({ writerid: this.$root.session.writer.selected.uuid }).toArray()
        arr.forEach(file => {
          let words = 0
          if (file.wordcount) {
            words = parseInt(file.wordcount)
          }
          if (!file.excludefromwordcount) {
            counter = counter + parseInt(words)
          }
        })
      }
      this.fullWordCount = counter

      //log the full wordcount
      if (!this.$root.session.writer.selected.log) {
        this.$root.session.writer.selected.log = {}
      }
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = yyyy + "-" + mm + "-" + dd
      this.$root.session.writer.selected.log[today] = this.fullWordCount
    },
    switchLang() {
      localStorage.setItem("wmLang", this.lang)
      this.updateLang()
    },
    updateLang() {

      this.setlang = this.$root.language[this.$root.lang]
      /*
            Object.keys(this.$root.language[this.$root.lang]).forEach((section)=>{
              Object.keys(section).forEach(item =>{
                this.setlang[section][item] = this.$root.language[this.$root.lang][section][item]
              })
            
            })
              */

    },

    openInNew(d) {
      var w = window.innerWidth - ((window.innerWidth / 100) * 5);
      var h = window.innerHeight - ((window.innerHeight / 100) * 5);
      if (d === "planningboard") {
        window.open("/?sc=" + d + "&sel=" + this.$root.session.writer.selected.uuid, "PlanningBoard", "width=" + w + "px,height=" + h + "px");
        return false
      }
      // otherwise it's a URL - may need to check for the old https here
      window.open(d, "Info", "width=" + w + "px,height=" + h + "px");
    },

    wordCounter(str) {
      let count = 0
      if (str) {
        if (this.lang === "cn") {
          // chinese so count characters and multiply by 0.7 for esitmate
          str = str.replace(/(<([^>]+)>)/gi, "");
          str.replaceAll(" ", "")
          count = parseInt(str.length * 0.7)
        } else {
          str = str.replace(/(<([^>]+)>)/gi, " ");
          count = str.split(" ").filter(function (n) {
            return n != "";
          }).length;
        }
      }
      return count
    },
    niceDate(timestamp) {
      var d = new Date(timestamp)
      return d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    },
    screensizefixes() {
      let w = window.innerWidth
      if (w < 720) {
        this.lhspin = false
        this.rhspin = false
        this.navbar = false
        this.togglenav = true
      }
      if (w > 720) {
        this.lhspin = true
        this.rhspin = true
        this.navbar = true
        this.togglenav = false
      }
    },
    SpecialKeys(e) {
      /* */
      if (e.shiftKey && e.key === "Enter") {
        console.log("Session :", JSON.parse(JSON.stringify(this.session)));
      }
      /*
      if (e.ctrlKey && e.key === "Enter") {
        console.log(this.pretty(this.session));
        let params = "?selectedProject=" + this.session.selectedProject;
        params += "&selectedTool=" + this.session.selectedTool;
        params += "&selectedToolId=" + this.session.selectedToolId;
        window.history.replaceState(null, null, params);
      }
      */
    },
    switchTheme() {
      document.getElementById("themeSwitch").href = "themes/" + this.theme + ".css";
      localStorage.setItem("wmTheme", this.theme)
    },
    unloadEvent(e) {
      // Cancel the event
      e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
      // Chrome requires returnValue to be set
      e.returnValue = "";
    }
  },
  async mounted() {
    // see if we are alreay running a project
    let settingsCheck = await this.$root.db.Settings.toArray()
    if (settingsCheck) {
      this.$root.session.settings = settingsCheck[0]
    }
    if (localStorage.getItem("wmTheme")) {
      this.theme = localStorage.getItem("wmTheme")
      this.switchTheme()
    }

    if (localStorage.getItem("wmLang") && localStorage.getItem("wmLang") != "undefined") {
      this.lang = localStorage.getItem("wmLang")
    } else {
      this.lang = "en"
    }
    this.updateLang();
    window.addEventListener("keydown", this.SpecialKeys);
    // set the text direction  on load - this looks like it might be a bit buggy for rtl  - will need to run tests
    document.body.dir = this.$root.setlang.textdirection
    this.screensizefixes()
    
    // Load initial fonts if settings exist
    if (this.$root.session?.settings?.documentprefs) {
      this.updateDocumentFont();
    }
    
    // Initialize PWA functionality
    this.initVitePWA()
  },
  created() {
    window.addEventListener("resize", this.screensizefixes);
  },
  unmount() {
    window.removeEventListener("resize", this.screensizefixes);
  }
}
</script>


