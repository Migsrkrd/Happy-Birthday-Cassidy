import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import './OpeningSequence.css'

/**
 * Long letter — replace with your real message (paragraphs welcome).
 */
export const DEFAULT_LETTER_MESSAGE = `Cassidy,

This is where your long message will live. You can write as much as you want here—stories, memories, inside jokes, a list of things you love about her, plans you’re excited for, whatever feels right.

Take all the space you need. Line breaks and multiple paragraphs work fine.

When you’re ready for the rest of the birthday site, she’ll tap Continue.

— With love`

/** Deterministic PRNG for stable balloon layout per id */
function mulberry32(seed) {
  return function rand() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randomMotion(seed) {
  const rnd = mulberry32(seed * 977 + 1337)
  const px = (mn, mx) => `${(mn + rnd() * (mx - mn)).toFixed(1)}px`
  const vh = (mn, mx) => `${(mn + rnd() * (mx - mn)).toFixed(2)}vh`
  return {
    '--bx0': px(-16, 16),
    '--by0': '0px',
    '--bx1': px(-58, 58),
    '--by1': vh(-16, -29),
    '--bx2': px(-62, 62),
    '--by2': vh(-36, -54),
    '--bx3': px(-58, 58),
    '--by3': vh(-58, -84),
    '--bx4': px(-48, 48),
    '--by4': vh(-112, -142),
  }
}

/** Four compatible cubic paths for SMIL morph (same command structure). */
function slitherStringPaths(seed) {
  const rnd = mulberry32(seed * 4999 + 101)
  const mk = () => {
    const c1x = 2 + rnd() * 9
    const c1y = 22 + rnd() * 38
    const c2x = 14 + rnd() * 10
    const c2y = 52 + rnd() * 38
    const e1x = 7 + rnd() * 10
    const e1y = 88 + rnd() * 28
    const c3x = 2 + rnd() * 9
    const c3y = 118 + rnd() * 42
    const c4x = 13 + rnd() * 10
    const c4y = 152 + rnd() * 38
    const e2x = 8 + rnd() * 8
    const e2y = 206 + rnd() * 14
    const f = (n) => n.toFixed(1)
    return `M 12 1 C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(e1x)} ${f(e1y)} C ${f(c3x)} ${f(c3y)}, ${f(c4x)} ${f(c4y)}, ${f(e2x)} ${f(e2y)}`
  }
  return [mk(), mk(), mk(), mk()]
}

const BALLOON_PRESETS = [
  { main: '#ff5c9a', deep: '#d4146e', light: '#ffc2de', string: 'rgba(255, 200, 230, 0.75)' },
  { main: '#7b68ee', deep: '#483d8b', light: '#c8c0ff', string: 'rgba(200, 195, 255, 0.7)' },
  { main: '#3ecb9c', deep: '#0d8f6a', light: '#b8ffe8', string: 'rgba(170, 240, 220, 0.65)' },
  { main: '#ffb347', deep: '#e85d04', light: '#ffe4b5', string: 'rgba(255, 210, 170, 0.75)' },
  { main: '#6ec8ff', deep: '#1e6fd9', light: '#d4efff', string: 'rgba(180, 220, 255, 0.7)' },
  { main: '#e879f9', deep: '#a21caf', light: '#fbcfe8', string: 'rgba(245, 200, 250, 0.72)' },
  { main: '#f472b6', deep: '#be185d', light: '#fce7f3', string: 'rgba(255, 190, 220, 0.72)' },
  { main: '#34d399', deep: '#047857', light: '#d1fae5', string: 'rgba(180, 235, 210, 0.65)' },
  { main: '#fcd34d', deep: '#b45309', light: '#fef3c7', string: 'rgba(255, 230, 160, 0.75)' },
  { main: '#a78bfa', deep: '#5b21b6', light: '#ede9fe', string: 'rgba(210, 200, 255, 0.7)' },
]

function BalloonSvg({ gradId, colors }) {
  return (
    <svg
      className="opening-balloon-svg"
      viewBox="0 0 100 118"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.light} />
          <stop offset="45%" stopColor={colors.main} />
          <stop offset="100%" stopColor={colors.deep} />
        </linearGradient>
        <radialGradient id={`${gradId}-shine`} cx="32%" cy="28%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="35%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="48" rx="38" ry="46" fill={`url(#${gradId})`} />
      <ellipse cx="50" cy="48" rx="38" ry="46" fill={`url(#${gradId}-shine)`} />
      <path
        d="M50 91 Q47.2 93.2 45.2 96.2 L47.8 95 Q50 93.8 52.2 95 L54.8 96.2 Q52.8 93.2 50 91Z"
        fill={colors.deep}
        opacity="0.94"
      />
      <path
        d="M49.2 91 L50 99.5 L50.8 91"
        fill="none"
        stroke={colors.deep}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BalloonStringPath({ stroke, paths, durSec, begin }) {
  const values = `${paths.join(';')};${paths[0]}`
  const keyTimes = '0;0.25;0.5;0.75;1'
  const keySplines = '0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1'

  return (
    <svg
      className="opening-balloon-string-svg"
      viewBox="0 0 24 220"
      preserveAspectRatio="xMidYMin meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke={stroke}
        strokeWidth="2.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={paths[0]}
      >
        <animate
          attributeName="d"
          dur={`${durSec}s`}
          begin={begin}
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes={keyTimes}
          keySplines={keySplines}
          values={values}
        />
      </path>
    </svg>
  )
}

function BalloonInstance({
  id,
  left,
  delay,
  duration,
  scale,
  colors,
  tiltDelay,
  stringBegin,
  motionVars,
  stringPaths,
  stringDurSec,
}) {
  const gradId = `bbg-${id}`

  return (
    <div className="opening-balloon-wrap" style={{ left }}>
      <div
        className="opening-balloon-rig"
        style={{
          '--rise-dur': duration,
          '--rise-delay': delay,
          '--balloon-scale': scale,
          ...motionVars,
        }}
      >
        <div className="opening-balloon-pack">
          <div
            className="opening-balloon-tilt"
            style={{ animationDelay: tiltDelay }}
          >
            <div className="opening-balloon-bubble">
              <BalloonSvg gradId={gradId} colors={colors} />
            </div>
            <BalloonStringPath
              stroke={colors.string}
              paths={stringPaths}
              durSec={stringDurSec}
              begin={stringBegin}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Balloons() {
  const balloons = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const rnd = mulberry32(i * 99991 + 42)
        const left = `${(4 + rnd() * 90).toFixed(2)}%`
        const scale = `${(0.58 + rnd() * 0.42).toFixed(3)}`
        const duration = `${(12.5 + rnd() * 5.5).toFixed(2)}s`
        const delay = `${(rnd() * 2.8).toFixed(2)}s`
        const tiltDelay = `${(rnd() * 1.4).toFixed(2)}s`
        const stringBegin = `${(rnd() * 1.1).toFixed(2)}s`
        const stringDurSec = 1.05 + rnd() * 0.95
        const motionVars = randomMotion(i + 1)
        const stringPaths = slitherStringPaths(i + 1)
        return {
          id: i,
          left,
          delay,
          duration,
          scale,
          colors: BALLOON_PRESETS[i % BALLOON_PRESETS.length],
          tiltDelay,
          stringBegin,
          motionVars,
          stringPaths,
          stringDurSec,
        }
      }),
    [],
  )

  return (
    <div className="opening-balloons" aria-hidden="true">
      {balloons.map((b) => (
        <BalloonInstance key={b.id} {...b} />
      ))}
    </div>
  )
}

export function OpeningSequence({ letterMessage = DEFAULT_LETTER_MESSAGE, onContinue }) {
  const [phase, setPhase] = useState('celebration')
  const [showSkip, setShowSkip] = useState(false)
  const [letterEntered, setLetterEntered] = useState(false)
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(0)
  const spawnTimerRef = useRef(0)
  const addBurstRef = useRef(() => {})
  const spawnLoopActiveRef = useRef(false)

  useEffect(() => {
    const t = window.setTimeout(() => setShowSkip(true), 5000)
    return () => window.clearTimeout(t)
  }, [])

  const goToLetter = useCallback(() => {
    setPhase('letter')
    window.setTimeout(() => setLetterEntered(true), 80)
  }, [])

  useEffect(() => {
    if (phase !== 'celebration') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * DPR)
      canvas.height = Math.floor(h * DPR)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const explode = (x, y, power = 1) => {
      const count = Math.floor((78 + Math.random() * 64) * power)
      const pool = particlesRef.current
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.55
        const speed = (1.6 + Math.random() * 7.2) * power
        const hue = Math.random() * 360
        const sat = 65 + Math.random() * 32
        const light = 52 + Math.random() * 38
        const roll = Math.random()
        let size
        if (roll < 0.18) size = 0.45 + Math.random() * 1.1
        else if (roll < 0.62) size = 1.1 + Math.random() * 2.9
        else size = 2.9 + Math.random() * 5.2

        const decay = 0.0055 + Math.random() * 0.02
        const type = Math.random() < 0.14 ? 'star' : Math.random() < 0.08 ? 'dash' : 'dot'

        pool.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay,
          hue,
          sat,
          light,
          size,
          type,
          spin: (Math.random() - 0.5) * 0.35,
        })
      }
    }

    addBurstRef.current = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      explode(x, y, 1.12)
    }

    const autoBurst = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      explode(w * (0.1 + Math.random() * 0.8), h * (0.1 + Math.random() * 0.36), 0.88 + Math.random() * 0.22)
      if (Math.random() < 0.35) {
        window.setTimeout(() => {
          explode(w * (0.12 + Math.random() * 0.76), h * (0.12 + Math.random() * 0.34), 0.65)
        }, 80 + Math.random() * 120)
      }
    }

    autoBurst()

    spawnLoopActiveRef.current = true
    const scheduleNextBurst = () => {
      if (!spawnLoopActiveRef.current) return
      const wait = 280 + Math.random() * 420
      spawnTimerRef.current = window.setTimeout(() => {
        autoBurst()
        scheduleNextBurst()
      }, wait)
    }
    scheduleNextBurst()

    const drawStar = (px, py, r, rot) => {
      const spikes = 4
      ctx.save()
      ctx.translate(px, py)
      ctx.rotate(rot)
      ctx.beginPath()
      for (let i = 0; i < spikes * 2; i++) {
        const rad = i % 2 === 0 ? r : r * 0.42
        const a = (Math.PI / spikes) * i - Math.PI / 2
        const sx = Math.cos(a) * rad
        const sy = Math.sin(a) * rad
        if (i === 0) ctx.moveTo(sx, sy)
        else ctx.lineTo(sx, sy)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const tick = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.fillStyle = '#020204'
      ctx.fillRect(0, 0, w, h)

      const pool = particlesRef.current
      const next = []
      for (const p of pool) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.052
        p.vx *= 0.992
        p.life -= p.decay

        if (p.life > 0 && p.y < h + 48) {
          const alpha = Math.max(0, p.life)
          const L = p.light + p.life * 22
          ctx.fillStyle = `hsl(${p.hue}, ${p.sat}%, ${Math.min(96, L)}%)`
          ctx.globalAlpha = alpha

          if (p.type === 'star') {
            drawStar(p.x, p.y, p.size * 1.15, p.life * 8 * p.spin + p.spin * 3)
          } else if (p.type === 'dash') {
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.life * 6 * p.spin)
            ctx.fillRect(-p.size, -p.size * 0.35, p.size * 2, p.size * 0.7)
            ctx.restore()
          } else {
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fill()
          }
          next.push(p)
        }
      }
      particlesRef.current = next
      ctx.globalAlpha = 1

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      spawnLoopActiveRef.current = false
      window.clearTimeout(spawnTimerRef.current)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
      particlesRef.current = []
    }
  }, [phase])

  const handleStagePointerDown = (e) => {
    if (phase !== 'celebration') return
    if (e.target.closest('.opening__skip')) return
    addBurstRef.current(e.clientX, e.clientY)
  }

  if (phase === 'letter') {
    return (
      <div className={`opening opening--letter ${letterEntered ? 'opening--letter-visible' : ''}`}>
        <div className="opening__letter-inner">
          <div className="opening__message-scroll">
            <p className="opening__message">{letterMessage}</p>
          </div>
          <button type="button" className="opening__continue" onClick={onContinue}>
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="opening opening--celebration"
      onPointerDown={handleStagePointerDown}
      role="presentation"
    >
      <canvas ref={canvasRef} className="opening__canvas" aria-hidden="true" />
      <Balloons />
      <p className="opening__hint">Tap anywhere for more fireworks</p>
      {showSkip && (
        <button
          type="button"
          className="opening__skip"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={goToLetter}
        >
          Skip
        </button>
      )}
    </div>
  )
}
