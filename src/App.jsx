import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { OpeningSequence, DEFAULT_LETTER_MESSAGE } from './OpeningSequence.jsx'
import './App.css'

/** Replace with your full letter — or edit the default in `OpeningSequence.jsx`. */
const LETTER_TO_CASSIDY = DEFAULT_LETTER_MESSAGE

const REASONS = [
  { emoji: '🌸', text: 'You make ordinary days feel like a soft filter on the world.' },
  { emoji: '🎀', text: 'Your kindness has zero competition. It wins every time.' },
  { emoji: '☕', text: 'Even your “just checking in” texts feel like a warm hug.' },
  { emoji: '🌙', text: 'You’re the cozy end to my chaotic days.' },
  { emoji: '🧁', text: 'You deserve cake for breakfast and stars with your name on them.' },
  { emoji: '🦋', text: 'Being around you feels like the first warm day of spring.' },
  { emoji: '💌', text: 'I’m endlessly lucky I get to cheer for you in this life.' },
  { emoji: '🎂', text: 'Today is officially: celebrate Cassidy at maximum volume.' },
]

const WISHES = [
  'May your year sparkle louder than confetti.',
  'May every playlist shuffle land on your favorite song.',
  'May your coffee always be the perfect temperature.',
  'May plot twists be only the happy kind.',
  'May you feel as adored as you make everyone else feel.',
]

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true)
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const { ref, visible } = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

function FloatingDecor() {
  const items = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${(i * 47) % 92 + 4}%`,
        delay: `${(i * 0.31) % 6}s`,
        duration: `${7 + (i % 6)}s`,
        size: `${0.85 + (i % 5) * 0.15}rem`,
        symbol: ['♡', '💕', '✨', '💖', '🌷'][i % 5],
      })),
    [],
  )
  return (
    <div className="floating-decor" aria-hidden="true">
      {items.map((h) => (
        <span
          key={h.id}
          className="floating-decor__piece"
          style={{
            left: h.left,
            animationDelay: h.delay,
            animationDuration: h.duration,
            fontSize: h.size,
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  )
}

function App() {
  const [openingDone, setOpeningDone] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)
  const [wishIndex, setWishIndex] = useState(0)
  const [burst, setBurst] = useState([])

  const cycleWish = useCallback(() => {
    setWishIndex((i) => (i + 1) % WISHES.length)
  }, [])

  const loveBurst = useCallback(() => {
    const id = Date.now()
    const next = Array.from({ length: 28 }, (_, i) => ({
      key: `${id}-${i}`,
      x: (Math.random() - 0.5) * 160,
      y: -80 - Math.random() * 120,
      rot: (Math.random() - 0.5) * 540,
      hue: 300 + Math.random() * 45,
      delay: Math.random() * 0.12,
      shape: i % 3,
    }))
    setBurst(next)
    window.setTimeout(() => setBurst([]), 2200)
  }, [])

  if (!openingDone) {
    return (
      <OpeningSequence
        letterMessage={LETTER_TO_CASSIDY}
        onContinue={() => setOpeningDone(true)}
      />
    )
  }

  return (
    <div className="app app--enter">
      <div className="app__bg" aria-hidden="true" />
      <FloatingDecor />

      <header className="hero">
        <div className="hero__ribbon" aria-hidden="true">
          <span className="hero__ribbon-dot" />
          <span className="hero__ribbon-dot" />
          <span className="hero__ribbon-dot" />
        </div>
        <p className="hero__eyebrow animate-pop">Psst… Cassidy…</p>
        <h1 className="hero__title">
          {['Happy', 'Birthday,', 'Cassidy!'].map((word, i) => (
            <span key={word} className="hero__word" style={{ animationDelay: `${200 + i * 140}ms` }}>
              {word}{' '}
            </span>
          ))}
        </h1>
        <p className="hero__sub animate-rise" style={{ animationDelay: '0.65s' }}>
          This tiny corner of the internet is 100% yours today.{' '}
          <span className="hero__heart" aria-label="love">
            💕
          </span>
        </p>
        <button type="button" className="btn btn--primary hero__cta" onClick={loveBurst}>
          Tap for a sparkle explosion
        </button>
        <div className="burst-layer" aria-hidden="true">
          {burst.map((p) => (
            <span
              key={p.key}
              className={`burst-piece burst-piece--${p.shape}`}
              style={{
                '--bx': `${p.x}px`,
                '--by': `${p.y}px`,
                '--br': `${p.rot}deg`,
                '--bh': p.hue,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      </header>

      <main className="main">
        <Reveal as="section" className="section section--banner">
          <div className="banner">
            <span className="banner__icon animate-wiggle">🎉</span>
            <p className="banner__text">
              Official decree: you are required to accept compliments, cake, and at least one ridiculous dance
              break.
            </p>
          </div>
        </Reveal>

        <Reveal as="section" className="section" delay={80}>
          <h2 className="section__title">
            <span className="section__title-icon">✨</span> Reasons you’re wonderful
          </h2>
          <p className="section__lead">Hover each card — they get shy and then extra sparkly.</p>
          <ul className="reason-grid">
            {REASONS.map((r) => (
              <li key={r.text} className="reason-card-wrap">
                <article className="reason-card">
                  <span className="reason-card__emoji">{r.emoji}</span>
                  <p className="reason-card__text">{r.text}</p>
                </article>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" className="section section--split" delay={60}>
          <div className="gift-panel">
            <h2 className="section__title">
              <span className="section__title-icon">🎁</span> A gift for you
            </h2>
            <p className="section__lead">Go on — the bow is basically begging to be opened.</p>
            <button
              type="button"
              className={`gift-box ${giftOpen ? 'gift-box--open' : ''}`}
              onClick={() => setGiftOpen((v) => !v)}
              aria-expanded={giftOpen}
            >
              <span className="gift-box__lid" />
              <span className="gift-box__bow" />
              <span className="gift-box__body" />
              <span className={`gift-box__note ${giftOpen ? 'gift-box__note--show' : ''}`}>
                Infinite hugs on demand, one very proud partner, and permission to be celebrated loudly.
              </span>
            </button>
          </div>

          <div className="wish-panel">
            <h2 className="section__title">
              <span className="section__title-icon">🌟</span> Birthday wishes
            </h2>
            <p className="section__lead">Each click pulls a new wish out of the wish-cloud.</p>
            <div className="wish-cloud">
              <p className="wish-cloud__text" key={wishIndex}>
                {WISHES[wishIndex]}
              </p>
              <button type="button" className="btn btn--ghost wish-cloud__btn" onClick={cycleWish}>
                Another wish ✦
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section section--marquee" delay={40}>
          <div className="marquee" aria-hidden="true">
            <div className="marquee__track">
              <span>Cassidy is amazing</span>
              <span>★</span>
              <span>Best day ever</span>
              <span>★</span>
              <span>More cake please</span>
              <span>★</span>
              <span>You’re loved</span>
              <span>★</span>
              <span>Cassidy is amazing</span>
              <span>★</span>
              <span>Best day ever</span>
              <span>★</span>
              <span>More cake please</span>
              <span>★</span>
              <span>You’re loved</span>
              <span>★</span>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section section--footer" delay={100}>
          <footer className="footer">
            <p className="footer__line">
              Made with love — and a lot of pink CSS — just for you.
            </p>
            <p className="footer__hearts" aria-hidden="true">
              <span>♡</span>
              <span>♡</span>
              <span>♡</span>
            </p>
          </footer>
        </Reveal>
      </main>
    </div>
  )
}

export default App
