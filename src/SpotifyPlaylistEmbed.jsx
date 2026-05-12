import { memo, useEffect, useRef } from 'react'

/** Playlist shown in the embed — keep in sync with Spotify embed settings. */
export const SPOTIFY_PLAYLIST_URI = 'spotify:playlist:1lx62RzEtZlqd3SGfiJCtE'

const IFRAME_API_SRC = 'https://open.spotify.com/embed/iframe-api/v1'
const EMBED_HEIGHT = 352

/**
 * Spotify’s official embed (iFrame API). Same playlist as before, but we get real
 * `playback_update` events for UI (e.g. the Music button) without guessing from Media Session.
 *
 * Pass `onPlaybackChange` from `useState`’s setter (stable) so the memoized child does not need
 * to re-render when the parent updates.
 *
 * Wrapped in `memo(..., () => true)` so parent state updates don’t replace the embed node.
 */
function SpotifyPlaylistEmbedInner({ onPlaybackChange }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const el = hostRef.current
    if (!el) return

    let cancelled = false
    /** @type {{ destroy?: () => void } | null} */
    let controller = null

    const notify = (playing) => {
      onPlaybackChange?.(playing)
    }

    const start = (IFrameAPI) => {
      if (cancelled || !hostRef.current) return
      IFrameAPI.createController(
        hostRef.current,
        {
          uri: SPOTIFY_PLAYLIST_URI,
          width: '100%',
          height: String(EMBED_HEIGHT),
        },
        (EmbedController) => {
          controller = EmbedController
          EmbedController.addListener('playback_update', (e) => {
            const d = e?.data
            if (!d) return
            const active = !d.isPaused && !d.isBuffering
            notify(active)
          })
        },
      )
    }

    const existing = window.SpotifyIframeApi
    if (existing) {
      start(existing)
    } else {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        window.SpotifyIframeApi = IFrameAPI
        start(IFrameAPI)
      }
      if (!document.querySelector(`script[src="${IFRAME_API_SRC}"]`)) {
        const s = document.createElement('script')
        s.src = IFRAME_API_SRC
        s.async = true
        document.body.appendChild(s)
      }
    }

    return () => {
      cancelled = true
      try {
        controller?.destroy?.()
      } catch {
        /* ignore */
      }
      controller = null
      notify(false)
    }
  }, [onPlaybackChange])

  return (
    <div
      ref={hostRef}
      className="spotify-embed-api-host"
      style={{
        width: '100%',
        minHeight: EMBED_HEIGHT,
        borderRadius: 12,
        overflow: 'hidden',
      }}
    />
  )
}

export const SpotifyPlaylistEmbed = memo(SpotifyPlaylistEmbedInner, () => true)
