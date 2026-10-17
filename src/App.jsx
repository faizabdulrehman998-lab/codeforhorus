const TITLE_1 = 'KHISHIG'.split('')
const TITLE_2 = 'ENTERPRISES'.split('')

function CodeIcon() {
  return (
    <svg viewBox="0 0 64 64" className="code-icon" aria-hidden="true">
      <defs>
        <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4da6ff" />
          <stop offset="55%" stopColor="#1e7fff" />
          <stop offset="100%" stopColor="#0a54e6" />
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      {/* terminal chevrons */}
      <path
        d="M18 22 L10 32 L18 42"
        fill="none"
        stroke="url(#blueGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 20 L40 32 L34 44"
        fill="none"
        stroke="url(#blueGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* cursor underscore */}
      <line
        x1="46"
        y1="44"
        x2="54"
        y2="44"
        stroke="url(#blueGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        className="cursor-line"
      />
      {/* glass shine sweep */}
      <path d="M14 0 H30 L20 64 H6 Z" fill="url(#shine)" opacity="0.25" />
    </svg>
  )
}

export default function App() {
  return (
    <main className="landing">
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />

      <div className="hero">
        <div className="glass-card">
          <CodeIcon />
        </div>

        <h1 className="title" aria-label="Khishig Enterprises">
          <span className="line">
            {TITLE_1.map((ch, i) => (
              <span
                key={`k${i}`}
                className="letter"
                style={{ animationDelay: `${0.7 + i * 0.055}s` }}
              >
                {ch}
              </span>
            ))}
          </span>
          <span className="line sub-line">
            {TITLE_2.map((ch, i) => (
              <span
                key={`e${i}`}
                className="letter"
                style={{ animationDelay: `${1.05 + i * 0.055}s` }}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>

        <p className="tagline">
          <span className="tagline-inner">Building the future, one commit at a time</span>
        </p>
      </div>
    </main>
  )
}
