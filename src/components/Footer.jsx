import React, { useState } from 'react'
import LegalModal from './LegalModal'
import { Mail } from 'lucide-react'

const links = [
  { label: 'Terms & Conditions', doc: 'terms' },
  { label: 'Privacy Policy', doc: 'privacy' },
  { label: 'Refund Policy', doc: 'refund' },
  { label: 'Cookies Policy', doc: 'cookies' },
  { label: 'Disclaimer', doc: 'disclaimer' },
]

export default function Footer() {
  const [activeDoc, setActiveDoc] = useState(null)

  return (
    <>
      <footer
        className="px-4 lg:px-6 py-5 mt-auto"
        style={{ borderTop: '1px solid #1e2330' }}
      >
        {/* Disclaimer text */}
        <p className="text-xs leading-relaxed text-center mb-4" style={{ color: '#5a6880' }}>
          ControlNode provides market intelligence for <span style={{ color: '#6b7a96' }}>informational purposes only</span>. Nothing on this platform constitutes financial advice, investment advice, or a recommendation to buy or sell any asset. Third-party content (including embedded videos) is provided for informational purposes — ControlNode does not own or control this content. Always consult a qualified financial advisor. M&N Consulting LLC.
        </p>

        {/* Links row */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-3">
          {links.map((link) => (
            <button
              key={link.doc}
              onClick={() => setActiveDoc(link.doc)}
              className="text-xs transition-colors hover:opacity-80"
              style={{ color: '#6b7a96' }}
              onMouseEnter={e => e.target.style.color = '#3b82f6'}
              onMouseLeave={e => e.target.style.color = '#4a5568'}
            >
              {link.label}
            </button>
          ))}
          <a
            href="mailto:clientcare@leadkast.com"
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: '#6b7a96' }}
            onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
            onMouseLeave={e => e.currentTarget.style.color = '#4a5568'}
          >
            <Mail size={11} />
            Contact
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-center" style={{ color: '#5a6880' }}>
          © {new Date().getFullYear()} M&N Consulting LLC · ControlNode · All rights reserved
        </p>
      </footer>

      {/* Legal Modal */}
      {activeDoc && (
        <LegalModal doc={activeDoc} onClose={() => setActiveDoc(null)} />
      )}
    </>
  )
}
