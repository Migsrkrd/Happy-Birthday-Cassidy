import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { OpeningSequence, DEFAULT_LETTER_MESSAGE } from './OpeningSequence.jsx'
import { SpotifyPlaylistEmbed } from './SpotifyPlaylistEmbed.jsx'
import './App.css'

/** Replace with your full letter — or edit the default in `OpeningSequence.jsx`. */
const LETTER_TO_CASSIDY = DEFAULT_LETTER_MESSAGE

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
  const [playlistIntroDone, setPlaylistIntroDone] = useState(false)
  const [playlistPopupOpen, setPlaylistPopupOpen] = useState(false)
  const [embedPlaying, setEmbedPlaying] = useState(false)
  const [burst, setBurst] = useState([])

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

  useEffect(() => {
    if (!playlistPopupOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setPlaylistPopupOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playlistPopupOpen])

  useEffect(() => {
    if (!playlistPopupOpen || !playlistIntroDone) return
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [playlistPopupOpen, playlistIntroDone])

  if (!openingDone) {
    return (
      <OpeningSequence
        letterMessage={LETTER_TO_CASSIDY}
        onContinue={() => setOpeningDone(true)}
      />
    )
  }

  const embedHostClass = [
    'playlist-embed-host',
    !playlistIntroDone ? 'playlist-embed-host--gate' : 'playlist-embed-host--main',
    playlistIntroDone &&
      (playlistPopupOpen ? 'playlist-embed-host--main-popup' : 'playlist-embed-host--main-hidden'),
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div
        className={embedHostClass}
        id="playlist-embed-host"
        role={playlistIntroDone && playlistPopupOpen ? 'dialog' : undefined}
        aria-modal={playlistIntroDone && playlistPopupOpen ? true : undefined}
        aria-label={playlistIntroDone && playlistPopupOpen ? 'Spotify playlist' : undefined}
      >
        <div className="playlist-embed-host__glow" aria-hidden="true" />
        {playlistIntroDone && playlistPopupOpen && (
          <div className="playlist-embed-host__popup-bar">
            <p className="playlist-embed-host__popup-title">Playlist</p>
            <button
              type="button"
              className="playlist-embed-host__popup-close"
              onClick={() => setPlaylistPopupOpen(false)}
              aria-label="Close playlist"
            >
              ×
            </button>
          </div>
        )}
        <div className="playlist-embed-host__frame">
          <SpotifyPlaylistEmbed onPlaybackChange={setEmbedPlaying} />
        </div>
      </div>

      {!playlistIntroDone && (
        <div className="playlist-gate-ui">
          <header className="playlist-gate-ui__header">
            <p className="playlist-gate-ui__eyebrow">Soundtrack</p>
            <h1 className="playlist-gate-ui__title">Pick a song</h1>
            <p className="playlist-gate-ui__sub">
              After you continue, the player hides so the site stays clean. Tap <strong>Music</strong> (bottom
              left) anytime to open the full playlist — same player, so your song keeps going.
            </p>
          </header>
          <div className="playlist-gate-ui__pass" aria-hidden="true" />
          <footer className="playlist-gate-ui__footer">
            <button
              type="button"
              className="btn btn--primary playlist-gate-ui__cta"
              onClick={() => setPlaylistIntroDone(true)}
            >
              Continue to the birthday site
            </button>
          </footer>
        </div>
      )}

      {playlistIntroDone && (
        <>
          <div className={`app app--enter${playlistIntroDone ? ' app--with-playlist-dock' : ''}`}>
            <div className="app__bg" aria-hidden="true" />
            <FloatingDecor />

      <header className="hero">
        <div className="hero__ribbon" aria-hidden="true">
          <span className="hero__ribbon-dot" />
          <span className="hero__ribbon-dot" />
          <span className="hero__ribbon-dot" />
        </div>
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

          {playlistPopupOpen && (
            <div
              className="playlist-modal-backdrop"
              role="presentation"
              onClick={() => setPlaylistPopupOpen(false)}
            />
          )}

          <button
            type="button"
            className={`music-fab${embedPlaying ? ' music-fab--beat' : ''}`}
            onClick={() => setPlaylistPopupOpen((o) => !o)}
            aria-label={playlistPopupOpen ? 'Close playlist' : 'Open playlist'}
            aria-expanded={playlistPopupOpen}
            aria-controls="playlist-embed-host"
          >
            <span className="music-fab__label">Music</span>
            <span className="music-fab__viz" aria-hidden="true">
              <span className="music-fab__viz-bar" />
              <span className="music-fab__viz-bar" />
              <span className="music-fab__viz-bar" />
            </span>
          </button>
        </>
      )}
    </>
  )
}

export default App
