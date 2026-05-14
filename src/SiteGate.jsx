import { useCallback, useState } from 'react'
import './SiteGate.css'

const STORAGE_KEY = 'hb-cassidy-site-unlock-v1'

function normalizeAnswer(text) {
  return text.trim().toLowerCase()
}

/** SHA-256 of UTF-8 string → lowercase hex (matches Node script output). */
async function sha256Hex(text) {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function readStoredUnlock(hash) {
  if (!hash) return true
  try {
    return sessionStorage.getItem(STORAGE_KEY) === hash
  } catch {
    return false
  }
}

export default function SiteGate({ children }) {
  const expectedHash = import.meta.env.VITE_SITE_ACCESS_HASH?.trim() ?? ''
  const question =
    import.meta.env.VITE_SITE_ACCESS_QUESTION?.trim() ||
    'Answer below to open your birthday surprise.'
  const [unlocked, setUnlocked] = useState(() => readStoredUnlock(expectedHash))
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [answerVisible, setAnswerVisible] = useState(false)

  const tryUnlock = useCallback(async () => {
    if (!expectedHash) return
    setError(false)
    const entered = normalizeAnswer(input)
    if (!entered) {
      setError(true)
      return
    }
    const hex = await sha256Hex(entered)
    if (hex === expectedHash) {
      try {
        sessionStorage.setItem(STORAGE_KEY, expectedHash)
      } catch {
        /* still unlock for this tab session */
      }
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
    }
  }, [expectedHash, input])

  if (!expectedHash || unlocked) {
    return children
  }

  return (
    <div className="site-gate">
      <div className="site-gate__card">
        <p className="site-gate__eyebrow">Just for you</p>
        <h1 className="site-gate__title">{question}</h1>
        <p className="site-gate__hint">Type your answer — capitalization doesn&apos;t matter.</p>
        <form
          className="site-gate__form"
          onSubmit={(e) => {
            e.preventDefault()
            void tryUnlock()
          }}
        >
          <label className="site-gate__label" htmlFor="site-gate-answer">
            Your answer
          </label>
          <div className="site-gate__field">
            <input
              id="site-gate-answer"
              className={`site-gate__input${error ? ' site-gate__input--error' : ''}`}
              type={answerVisible ? 'text' : 'password'}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setError(false)
              }}
              placeholder="Type here…"
            />
            <button
              type="button"
              className="site-gate__toggle-visibility"
              onClick={() => setAnswerVisible((v) => !v)}
              aria-pressed={answerVisible}
              aria-label={answerVisible ? 'Hide answer' : 'Show answer'}
            >
              {answerVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          {error ? (
            <p className="site-gate__err" role="alert">
              Not quite — try again.
            </p>
          ) : null}
          <button type="submit" className="site-gate__submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
