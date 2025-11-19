import { useEffect } from 'react'
import ContactPage from './components/ContactPage'
import PageContent from './components/PageContent'

type LegacyConstructor<TInstance = Record<string, unknown>> = new (...args: unknown[]) => TInstance

interface FooterComponentInstance {
  render: () => void
}

interface GreetingPopupInstance {
  destroy?: () => void
}

// Extend Window interface for legacy scripts
declare global {
  interface Window {
    KMENavigation?: LegacyConstructor
    navigationModule?: unknown
    FooterComponent?: LegacyConstructor<FooterComponentInstance>
    GreetingPopup?: LegacyConstructor<GreetingPopupInstance>
    greetingPopupInstance?: GreetingPopupInstance
  }
}

const sharedScripts = [
  '/assets/js/main.js?v=2',
  '/assets/js/modules/navigation.js?v=6',
  '/assets/js/animations-phase1.js',
  '/assets/js/animations-phase2.js',
  '/assets/js/animations-phase3.js',
  '/assets/js/components/footer.js',
  '/assets/js/utils/scroll-snap.js',
]

const homeExtraScripts = ['/assets/js/greeting-popup.js?v=2']
const contactExtraScripts = ['/assets/js/pages/contact.js']

const isContactPage = typeof window !== 'undefined' && window.location.pathname.includes('/pages/contact')
const currentScripts = isContactPage ? [...sharedScripts, ...contactExtraScripts] : [...sharedScripts, ...homeExtraScripts]

function App() {
  useEffect(() => {
    const appendedScripts = currentScripts
      .map((src) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          return null
        }

        const script = document.createElement('script')
        script.src = src
        script.async = false
        script.dataset.legacy = 'true'
        document.body.appendChild(script)
        return script
      })
      .filter((script): script is HTMLScriptElement => script !== null)

    // Re-initialize navigation after scripts load
    const initializeNavigation = () => {
      setTimeout(() => {
        if (window.KMENavigation && !window.navigationModule) {
          try {
            window.navigationModule = new window.KMENavigation()
            console.log('Navigation initialized successfully')
          } catch (err) {
            console.error('Navigation initialization failed:', err)
          }
        }
      }, 200)
    }

    if (appendedScripts.length > 0) {
      appendedScripts[appendedScripts.length - 1].addEventListener('load', initializeNavigation)
    } else {
      initializeNavigation()
    }

    // Initialize footer after scripts load
    const initializeFooter = () => {
      setTimeout(() => {
        if (window.FooterComponent && !document.querySelector('#footer')) {
          const footer = new window.FooterComponent()
          footer.render()
        }
      }, 300)
    }

    if (appendedScripts.length > 0) {
      appendedScripts[appendedScripts.length - 1].addEventListener('load', initializeFooter)
    } else {
      initializeFooter()
    }

    // Initialize greeting popup for homepage
    const initializeGreetingPopup = () => {
      setTimeout(() => {
        if (window.GreetingPopup && document.getElementById('anaiPopup')) {
          if (!window.greetingPopupInstance) {
            window.greetingPopupInstance = new window.GreetingPopup()
          }
        }
      }, 400)
    }

    if (appendedScripts.length > 0) {
      appendedScripts[appendedScripts.length - 1].addEventListener('load', initializeGreetingPopup)
    } else {
      initializeGreetingPopup()
    }

    return () => {
      appendedScripts.forEach((script) => {
        if (script.dataset.legacy === 'true') {
          script.remove()
        }
      })
    }
  }, [])

  useEffect(() => {
    const hideLoadingOverlay = () => {
      document.body.classList.add('app-ready')
      document.getElementById('loading')?.classList.add('hidden')
    }

    const fallback = window.setTimeout(hideLoadingOverlay, 2000)
    window.addEventListener('load', hideLoadingOverlay)

    return () => {
      window.clearTimeout(fallback)
      window.removeEventListener('load', hideLoadingOverlay)
    }
  }, [])

  if (isContactPage) {
    return <ContactPage />
  }

  return <PageContent />
}

export default App
