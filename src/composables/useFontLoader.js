import { ref, watch } from 'vue'

export function useFontLoader() {
  const loadedFonts = ref(new Set())
  const isLoading = ref(false)

  // Popular Google Fonts that are commonly used
  const popularGoogleFonts = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Raleway', 'Poppins', 'Nunito',
    'Playfair Display', 'Merriweather', 'Source Sans Pro', 'Quicksand', 'Oswald',
    'Ubuntu', 'Crimson Text', 'Libre Baskerville', 'PT Sans', 'Noto Sans',
    'Inter', 'Fira Sans', 'Work Sans', 'Barlow', 'DM Sans', 'Mulish', 'Rubik',
    // Monospace/Typewriter fonts for distraction-free mode
    'Special Elite', 'Courier Prime', 'Anonymous Pro', 'Inconsolata', 'Source Code Pro',
    'JetBrains Mono', 'Fira Code', 'IBM Plex Mono', 'Roboto Mono', 'Space Mono'
  ]

  // System fonts that don't need to be loaded from Google Fonts
  const systemFonts = [
    'Arial', 'Helvetica', 'Times', 'Times New Roman', 'Georgia', 'Verdana', 
    'Courier', 'Courier New', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'
  ]

  const isSystemFont = (fontName) => {
    const cleanName = fontName.replace(/['"]/g, '').trim().toLowerCase()
    return systemFonts.some(font => cleanName.includes(font.toLowerCase()))
  }

  const isGoogleFont = (fontName) => {
    const cleanName = fontName.replace(/['"]/g, '').trim()
    return popularGoogleFonts.some(font => 
      cleanName.toLowerCase().includes(font.toLowerCase())
    )
  }

  const cleanFontName = (fontName) => {
    return fontName.replace(/['"]/g, '').trim().replace(/\s+/g, '+')
  }

  const loadGoogleFont = (fontName, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!fontName || isSystemFont(fontName)) {
        resolve('System font, no loading needed')
        return
      }

      const cleanName = cleanFontName(fontName)
      const fontId = `google-font-${cleanName.toLowerCase()}`

      // Check if already loaded
      if (loadedFonts.value.has(cleanName) || document.getElementById(fontId)) {
        resolve('Font already loaded')
        return
      }

      isLoading.value = true

      // Default options
      const {
        weights = '300;400;500;600;700',
        subsets = '',
        display = 'swap'
      } = options

      // Build Google Fonts URL
      let fontUrl = `https://fonts.googleapis.com/css2?family=${cleanName}:wght@${weights}`
      
      if (subsets) {
        fontUrl += `&subset=${subsets}`
      }
      
      fontUrl += `&display=${display}`

      // Add preconnect links if they don't exist
      if (!document.querySelector('link[href="https://fonts.googleapis.com"]')) {
        const preconnect1 = document.createElement('link')
        preconnect1.rel = 'preconnect'
        preconnect1.href = 'https://fonts.googleapis.com'
        document.head.appendChild(preconnect1)

        const preconnect2 = document.createElement('link')
        preconnect2.rel = 'preconnect'
        preconnect2.href = 'https://fonts.gstatic.com'
        preconnect2.crossOrigin = 'anonymous'
        document.head.appendChild(preconnect2)
      }

      // Create and load the font stylesheet
      const fontLink = document.createElement('link')
      fontLink.rel = 'stylesheet'
      fontLink.href = fontUrl
      fontLink.id = fontId

      fontLink.onload = () => {
        loadedFonts.value.add(cleanName)
        isLoading.value = false
        console.log(`✓ Google Font loaded: ${fontName}`)
        resolve(`Font loaded: ${fontName}`)
      }

      fontLink.onerror = () => {
        isLoading.value = false
        console.warn(`✗ Failed to load Google Font: ${fontName}`)
        reject(new Error(`Failed to load font: ${fontName}`))
      }

      document.head.appendChild(fontLink)
    })
  }

  const preloadFonts = async (fontList) => {
    const promises = fontList.map(font => loadGoogleFont(font))
    return Promise.allSettled(promises)
  }

  const removeFontFromDOM = (fontName) => {
    const cleanName = cleanFontName(fontName)
    const fontId = `google-font-${cleanName.toLowerCase()}`
    const fontLink = document.getElementById(fontId)
    
    if (fontLink) {
      fontLink.remove()
      loadedFonts.value.delete(cleanName)
      console.log(`Font removed: ${fontName}`)
    }
  }

  const getFontSuggestions = (query) => {
    if (!query) return popularGoogleFonts.slice(0, 10)
    
    const lowerQuery = query.toLowerCase()
    return popularGoogleFonts.filter(font => 
      font.toLowerCase().includes(lowerQuery)
    ).slice(0, 10)
  }

  return {
    loadedFonts: loadedFonts.value,
    isLoading,
    loadGoogleFont,
    preloadFonts,
    removeFontFromDOM,
    getFontSuggestions,
    isSystemFont,
    isGoogleFont,
    popularGoogleFonts,
    systemFonts
  }
}