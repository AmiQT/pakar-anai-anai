import { useEffect } from 'react'
import PageContent from './components/PageContent'

const legacyScripts = [
  '/assets/js/main.js?v=2',
  '/assets/js/modules/navigation.js?v=6',
  '/assets/js/animations-phase1.js',
  '/assets/js/animations-phase2.js',
  '/assets/js/animations-phase3.js',
  '/assets/js/components/footer.js',
  '/assets/js/greeting-popup.js?v=2',
  '/assets/js/utils/scroll-snap.js',
  '/assets/js/utils/section-pagination.js',
]

function App() {
  useEffect(() => {
    const appendedScripts = legacyScripts
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

    return () => {
      appendedScripts.forEach((script) => {
        if (script.dataset.legacy === 'true') {
          script.remove()
        }
      })
    }
  }, [])

  return <PageContent />
}

export default App
