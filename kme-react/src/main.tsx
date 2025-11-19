import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/bootstrap-theme.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createRoot(document.getElementById('root')!).render(<App />)
