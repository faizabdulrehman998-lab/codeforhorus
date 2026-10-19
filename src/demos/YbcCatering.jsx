import { useEffect, useState } from 'react'
import './ybc.css'

const LOGO = '/ybc-logo.jpg'

const ABOUT_PARAGRAPHS = {
  intro:
    "Welcome to YBC Catering Services (Yahya Biryani Center)—the home of Karachi's authentic, slow-cooked clay pot masterpieces. Located in the heart of Shah Faisal Colony, we have spent years perfecting the art of traditional catering, turning everyday meals and milestone events into unforgettable culinary experiences.",
  matka:
    "We don't just cook food; we preserve tradition. YBC is famous across Karachi for our signature Matka (Clay Pot) Biryani & Pulao, where premium meat and fragrant basmati rice are slow-infused with secret spices inside traditional earthenware. From our rich, melt-in-your-mouth Beef Nalli Pulao to our crowd-pleasing SBP Haleem Pulao and fusion Chinese dishes, every bite delivers the true, uncompromised flavor of Karachi street food.",
  scale:
    "Whether you are ordering a single box for a Friday family lunch or need 50+ custom Deghs for a grand wedding, corporate event, or communal Niaz, YBC handles it all with absolute precision. We strictly prioritize premium ingredients, flawless hygiene, and punctual delivery to ensure your guests leave fully satisfied.",
}

const PHONES = ['+92 347 2033483', '+92 319 3552169', '+92 312 1070579']
const ADDRESS = '3/793, Shah Faisal Colony #3 (Near HBL Bank), Shah Faisal Town, Karachi.'

function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="ybc-splash">
      <div className="ybc-splash-inner">
        <div className="ybc-splash-logo-wrap">
          <img className="ybc-splash-logo" src={LOGO} alt="YBC Yahya Biryani Center logo" />
        </div>
        <div className="ybc-splash-title">
          <span className="ybc-wordmark-red">YBC</span>
          <span className="ybc-wordmark-white">Caterings</span>
        </div>
      </div>
    </div>
  )
}

function HomeView({ onOpenAbout, onStub }) {
  return (
    <div className="ybc-home">
      <header className="ybc-hero">
        <div className="ybc-hero-logo-wrap">
          <img className="ybc-hero-logo" src={LOGO} alt="YBC Yahya Biryani Center logo" />
        </div>
        <h1 className="ybc-hero-title">
          <span className="ybc-wordmark-red">YBC</span>
          <span className="ybc-wordmark-white">Caterings</span>
        </h1>
      </header>

      <p className="ybc-intro">
        Welcome to YBC Catering Services (Yahya Biryani Center)—the home of Karachi's authentic,
        slow-cooked clay pot masterpieces. Located in the heart of Shah Faisal Colony, we have spent
        years perfecting the art of traditional catering, turning everyday meals and milestone events
        into unforgettable culinary experiences....
      </p>

      <div className="ybc-option-cards">
        <button type="button" className="ybc-option-card" onClick={onOpenAbout}>
          <span className="ybc-option-emoji">📖</span>
          <h2>About</h2>
          <p>Learn the story behind YBC — our Matka magic, our specialties, and the tradition we preserve in every dish.</p>
        </button>

        <button type="button" className="ybc-option-card" onClick={() => onStub('Orders')}>
          <span className="ybc-option-emoji">🧾</span>
          <h2>Orders</h2>
          <p>Craving a single box for family lunch? Place your YBC biryani and pulao orders for delivery across Karachi.</p>
        </button>

        <button type="button" className="ybc-option-card" onClick={() => onStub('Caterings')}>
          <span className="ybc-option-emoji">🎉</span>
          <h2>Caterings</h2>
          <p>Weddings, corporate events, or communal Niaz — book 50+ custom Deghs with flawless hygiene and punctual delivery.</p>
        </button>
      </div>
    </div>
  )
}

function AboutView({ onBack }) {
  return (
    <div className="ybc-about">
      <button type="button" className="ybc-back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="ybc-about-logo-wrap">
        <img className="ybc-about-logo" src={LOGO} alt="YBC Yahya Biryani Center logo" />
      </div>

      <p className="ybc-about-p">{ABOUT_PARAGRAPHS.intro}</p>

      <h2 className="ybc-glass-heading">The Matka Magic &amp; Our Specialties.</h2>
      <p className="ybc-about-p">{ABOUT_PARAGRAPHS.matka}</p>

      <h2 className="ybc-glass-heading">From Small Cravings to Grand Celebrations.</h2>
      <p className="ybc-about-p">{ABOUT_PARAGRAPHS.scale}</p>

      <h2 className="ybc-glass-heading">Taste the Tradition Today</h2>
      <p className="ybc-about-p">Conveniently located near 3 Number Chowrangi, our kitchen is always ready to serve you.</p>

      <div className="ybc-contact-cards">
        <div className="ybc-contact-card">
          <span className="ybc-contact-label">📍 Find Us:</span>
          <p>{ADDRESS}</p>
        </div>
        <div className="ybc-contact-card">
          <span className="ybc-contact-label">📞 Book Your Next Event:</span>
          <p>
            {PHONES.map((p, i) => (
              <span key={p}>
                <a href={`tel:${p.replace(/\s/g, '')}`}>{p}</a>
                {i < PHONES.length - 1 && ' | '}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  )
}

function StubOverlay({ title, onClose }) {
  return (
    <div className="ybc-stub-overlay" onClick={onClose} role="presentation">
      <div className="ybc-stub-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <span className="ybc-stub-emoji">🚧</span>
        <h2>{title}</h2>
        <p>Oops, you're all caught up — because we're making a trial website!</p>
        <button type="button" className="ybc-stub-close" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  )
}

export default function YbcCatering() {
  const [phase, setPhase] = useState('splash')
  const [view, setView] = useState('home')
  const [stub, setStub] = useState(null)

  return (
    <div className="ybc-shell">
      {phase === 'splash' && <Splash onDone={() => setPhase('ready')} />}
      {phase === 'ready' && (
        <div className="ybc-landing">
          {view === 'home' ? (
            <HomeView onOpenAbout={() => setView('about')} onStub={setStub} />
          ) : (
            <AboutView onBack={() => setView('home')} />
          )}
        </div>
      )}
      {stub && <StubOverlay title={stub} onClose={() => setStub(null)} />}
    </div>
  )
}
