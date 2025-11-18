import { contactPageMarkup } from '../content/contactMarkup'
import '../styles/contact.css'

const ContactPage = () => (
  <>
    <div dangerouslySetInnerHTML={{ __html: contactPageMarkup }} />
    <div id="loading" className="loading-overlay">
      <div className="loading-spinner" />
    </div>
  </>
)

export default ContactPage
