import './Footer.css'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v8h4v-8h3l1-4h-4V9c0-.6.4-1 1-1z"
        fill="currentColor"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M4 4l16 16M20 4L4 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon },
  { label: 'X', href: 'https://x.com', icon: XIcon },
] as const

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__legal">
        <span>2026 WebMec, Inc</span>
        <a href="/privacidade">Privacidade</a>
        <a href="/termos">Termos</a>
      </div>
      <div className="footer__social">
        {socialLinks.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="footer__social-link"
          >
            <Icon />
          </a>
        ))}
      </div>
    </footer>
  )
}
