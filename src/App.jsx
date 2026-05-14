import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { OpeningSequence, DEFAULT_LETTER_MESSAGE } from "./OpeningSequence.jsx";
import { SpotifyPlaylistEmbed } from "./SpotifyPlaylistEmbed.jsx";
import galleryImg6438 from "./assets/gallery/IMG_6438.PNG";
import galleryImg6439 from "./assets/gallery/IMG_6439.PNG";
import galleryImg6441 from "./assets/gallery/IMG_6441.PNG";
import galleryImg6442 from "./assets/gallery/IMG_6442.PNG";
import galleryImg6443 from "./assets/gallery/IMG_6443.PNG";
import galleryImg6444 from "./assets/gallery/IMG_6444.PNG";
import galleryImg6445 from "./assets/gallery/IMG_6445.PNG";
import galleryImg6446 from "./assets/gallery/IMG_6446.PNG";
import galleryImg6447 from "./assets/gallery/IMG_6447.PNG";
import galleryImg6449 from "./assets/gallery/IMG_6449.PNG";
import profileImg from "./assets/gallery/profile.PNG";
import {
  BIRTH_DATE,
  BIRTH_DAY_SNAPSHOT,
  ERA_SNIPPET,
  HUBBLE_ON_MAY16,
  ON_THIS_DAY_EVENTS,
  SHARED_BIRTHDAYS,
} from "./may16FactSheetData.js";
import hubbleHcg90Img from "./assets/hubble-hickson-compact-group-90.png";
import { FLORIDA_MAN_MAY16_HEADLINES } from "./floridaManMay16Data.js";
import "./App.css";

/** Replace with your full letter — or edit the default in `OpeningSequence.jsx`. */
const LETTER_TO_CASSIDY = DEFAULT_LETTER_MESSAGE;

/**
 * Would-you-rather prompts. `question` shows at the top; `a` / `b` are the two answers.
 * `pickForHer` is what *you* guessed she’d choose (`'a'` or `'b'`) — edit anytime.
 */
const WYR_QUESTIONS = [
  {
    id: "wyr-sunsets",
    question: "Sunsets or sunrises?",
    a: "Sunsets",
    b: "Sunrises",
    pickForHer: "a",
  },
  {
    id: "wyr-ice-cream-cake",
    question: "Ice cream or cake?",
    a: "Ice cream",
    b: "Cake",
    pickForHer: "a",
  },
  {
    id: "wyr-ig-tt",
    question: "Instagram or TikTok?",
    a: "Instagram",
    b: "TikTok",
    pickForHer: "b",
  },
  {
    id: "wyr-jewelry",
    question: "Gold or silver jewelry?",
    a: "Gold",
    b: "Silver",
    pickForHer: "a",
  },
  {
    id: "wyr-movies",
    question: "Romantic movie or horror movie?",
    a: "Romantic movie",
    b: "Horror movie",
    pickForHer: "a",
  },
  {
    id: "wyr-picnic-brunch",
    question: "Picnic or brunch?",
    a: "Picnic",
    b: "Brunch",
    pickForHer: "b",
  },
  {
    id: "wyr-flowers-choc",
    question: "Flowers or chocolates?",
    a: "Flowers",
    b: "Chocolates",
    pickForHer: "a",
  },
  {
    id: "wyr-sushi-italian",
    question: "Sushi or Italian food?",
    a: "Sushi",
    b: "Italian food",
    pickForHer: "a",
  },
  {
    id: "wyr-dress-jeans",
    question: "Dress or jeans?",
    a: "Dress",
    b: "Jeans",
    pickForHer: "a",
  },
  {
    id: "wyr-city-island",
    question: "City life or island life?",
    a: "City life",
    b: "Island life",
    pickForHer: "a",
  },
  {
    id: "wyr-coffee",
    question: "Iced coffee or hot coffee?",
    a: "Iced coffee",
    b: "Hot coffee",
    pickForHer: "a",
  },
  {
    id: "wyr-cook-bake",
    question: "Cooking or baking?",
    a: "Cooking",
    b: "Baking",
    pickForHer: "b",
  },
  {
    id: "wyr-letters-gifts",
    question: "Love letters or surprise gifts?",
    a: "Love letters",
    b: "Surprise gifts",
    pickForHer: "a",
  },
  {
    id: "wyr-makeup",
    question: "Makeup or natural look?",
    a: "Makeup",
    b: "Natural look",
    pickForHer: "a",
  },
  {
    id: "wyr-sing-dance",
    question: "Singing or dancing?",
    a: "Singing",
    b: "Dancing",
    pickForHer: "a",
  },
  {
    id: "wyr-berries",
    question: "Strawberries or watermelon?",
    a: "Strawberries",
    b: "Watermelon",
    pickForHer: "a",
  },
  {
    id: "wyr-cakes",
    question: "Chocolate cake or cheesecake?",
    a: "Chocolate cake",
    b: "Cheesecake",
    pickForHer: "b",
  },
];

/** Photo carousel — swap `caption` / `alt` strings for your real memories. */
const GALLERY_SLIDES = [
  {
    src: galleryImg6446,
    alt: "A photo from our gallery",
    caption: "Some of my favorite moments with you.",
  },
  {
    src: galleryImg6447,
    alt: "A photo from our gallery",
    caption: "A night out at the bars",
  },
  {
    src: galleryImg6439,
    alt: "A photo from our gallery",
    caption: "Sharks game night",
  },
  {
    src: galleryImg6449,
    alt: "A photo from our gallery",
    caption: "Good dinners",
  },
  {
    src: galleryImg6441,
    alt: "A photo from our gallery",
    caption: "More Sharks game nights",
  },
  {
    src: galleryImg6438,
    alt: "A photo from our gallery",
    caption: "Meeting Randy Hahn",
  },
  {
    src: galleryImg6442,
    alt: "A photo from our gallery",
    caption: "More Sharks game nights",
  },
  {
    src: galleryImg6443,
    alt: "A photo from our gallery",
    caption: "More Sharks game nights",
  },
  {
    src: galleryImg6444,
    alt: "A photo from our gallery",
    caption: "My LEAST favorite meme you've sent me",
  },
  {
    src: galleryImg6445,
    alt: "A photo from our gallery",
    caption: "My favorite meme you've sent me",
  },
  {
    src: galleryImg6446,
    alt: "A photo from our gallery",
    caption: "We really need to take more pictures together. Happy birthday, Cassidy.",
  },
];

const RELATIONSHIP_TIMELINE = [
  {
    year: "2015",
    detail: "We first met in Mr. Hilgers' history class at Leland High.",
  },
  {
    year: "2020",
    detail:
      "We hung out for the first time with friends at a downtown San Jose bar, and somehow ended up debating the color of Harry Potter pixies.",
  },
  {
    year: "2022",
    detail: "When you were away at college, we still found ways to stay close and keep in touch.",
  },
  {
    year: "2024",
    detail: "We started spending more time together and growing into a real friendship.",
  },
  {
    year: "2026",
    detail: "Our first date happened, and our relationship officially began.",
  },
];

const THINK_OF_YOU_IMAGES = Object.values(
  import.meta.glob("./assets/think-of-you/*.{jpg,jpeg,png,webp,avif}", {
    eager: true,
    import: "default",
  }),
).sort((a, b) => String(a).localeCompare(String(b)));
const PROJECT_STATS = [
  { label: "Lines of code", value: "3,506+" },
  { label: "Source files", value: "7" },
  { label: "Photos included", value: String(GALLERY_SLIDES.length + THINK_OF_YOU_IMAGES.length + 1) },
  { label: "Years of history", value: String(RELATIONSHIP_TIMELINE.length) },
];

function PhotoGallerySection() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDir, setSlideDir] = useState(0);
  const [pendingIndex, setPendingIndex] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);
  const [trackTransitionOn, setTrackTransitionOn] = useState(false);
  const touchStartXRef = useRef(null);
  const touchDeltaXRef = useRef(0);
  const carouselRef = useRef(null);
  const n = GALLERY_SLIDES.length;
  const safeIndex = ((slideIndex % n) + n) % n;
  const slide = GALLERY_SLIDES[safeIndex];
  const prevIndex = ((safeIndex - 1 + n) % n + n) % n;
  const nextIndex = (safeIndex + 1) % n;

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onFocusOut = (e) => {
      const rt = e.relatedTarget;
      if (rt && el.contains(rt)) return;
      setSlideIndex(0);
    };
    el.addEventListener("focusout", onFocusOut);
    return () => el.removeEventListener("focusout", onFocusOut);
  }, []);

  const startSlide = useCallback(
    (dir) => {
      if (isSliding) return;
      const next = dir > 0 ? nextIndex : prevIndex;
      setSlideDir(dir);
      setPendingIndex(next);
      setIsSliding(true);
      setTrackTransitionOn(false);
      setTrackOffset(dir > 0 ? 0 : -50);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setTrackTransitionOn(true);
          setTrackOffset(dir > 0 ? -50 : 0);
        });
      });
    },
    [isSliding, nextIndex, prevIndex],
  );

  const goPrev = useCallback(() => {
    startSlide(-1);
  }, [startSlide]);

  const goNext = useCallback(() => {
    startSlide(1);
  }, [startSlide]);

  const onSlideEnd = useCallback(() => {
    if (!isSliding) return;
    setSlideIndex(pendingIndex);
    setIsSliding(false);
    setTrackTransitionOn(false);
    setTrackOffset(0);
  }, [isSliding, pendingIndex]);

  const onTouchStart = useCallback(
    (e) => {
      if (isSliding) return;
      touchStartXRef.current = e.touches[0]?.clientX ?? null;
      touchDeltaXRef.current = 0;
    },
    [isSliding],
  );

  const onTouchMove = useCallback((e) => {
    if (touchStartXRef.current == null) return;
    const x = e.touches[0]?.clientX ?? touchStartXRef.current;
    touchDeltaXRef.current = x - touchStartXRef.current;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (touchStartXRef.current == null || isSliding) return;
    const dx = touchDeltaXRef.current;
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    if (dx > 0) goPrev();
  }, [goNext, goPrev, isSliding]);

  const visibleSlides = isSliding
    ? slideDir > 0
      ? [safeIndex, pendingIndex]
      : [pendingIndex, safeIndex]
    : [safeIndex];

  return (
    <Reveal
      as="section"
      className="section gallery-carousel-section"
      delay={70}
      aria-labelledby="gallery-heading"
    >
      <h2 className="section__title" id="gallery-heading">
        <span className="section__title-icon" aria-hidden="true">
          📷
        </span>{" "}
        Us, on film
      </h2>
      <p className="section__lead">Flip through a few of my favorites</p>

      <div
        ref={carouselRef}
        className="gallery-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Photo memories"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goPrev();
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goNext();
          }
        }}
      >
        <div className="gallery-carousel__row">
          <figure
            className="gallery-carousel__figure"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
          >
            <div
              className={`gallery-carousel__track${trackTransitionOn ? " gallery-carousel__track--animating" : ""}`}
              style={{
                width: `${visibleSlides.length * 100}%`,
                transform: `translateX(${trackOffset}%)`,
              }}
              onTransitionEnd={onSlideEnd}
            >
              {visibleSlides.map((idx) => {
                const s = GALLERY_SLIDES[idx];
                return (
                  <img
                    key={`${idx}-${s.src}`}
                    className="gallery-carousel__img"
                    style={{ width: `${100 / visibleSlides.length}%` }}
                    src={s.src}
                    alt={s.alt}
                    loading="lazy"
                    decoding="async"
                  />
                );
              })}
            </div>
            <button
              type="button"
              className="gallery-carousel__arrow gallery-carousel__arrow--prev"
              onClick={goPrev}
              aria-label="Previous photo"
            >
              <svg
                className="gallery-carousel__arrow-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M14.5 5.5L8.5 12L14.5 18.5"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="gallery-carousel__arrow gallery-carousel__arrow--next"
              onClick={goNext}
              aria-label="Next photo"
            >
              <svg
                className="gallery-carousel__arrow-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9.5 5.5L15.5 12L9.5 18.5"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </figure>
        </div>

        <p className="gallery-carousel__caption" aria-live="polite">
          {slide.caption}
        </p>
        <p className="gallery-carousel__counter" aria-hidden="true">
          {safeIndex + 1} / {n}
        </p>
      </div>
    </Reveal>
  );
}

function TimelineSection() {
  return (
    <Reveal as="section" className="section timeline-section" delay={85} aria-labelledby="timeline-heading">
      <h2 className="section__title" id="timeline-heading">
        <span className="section__title-icon" aria-hidden="true">
          🗓️
        </span>{" "}
        Our timeline
      </h2>
      <p className="section__lead">A few moments that quietly led us here.</p>

      <ol className="timeline-list" aria-label="Relationship timeline">
        {RELATIONSHIP_TIMELINE.map((item) => (
          <li key={item.year} className="timeline-list__item">
            <p className="timeline-list__year">{item.year}</p>
            <p className="timeline-list__detail">{item.detail}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

function May16WorldSection() {
  const dateLine = `${BIRTH_DAY_SNAPSHOT.weekday}, ${BIRTH_DATE.month} ${BIRTH_DATE.day}, ${BIRTH_DATE.year}`;
  return (
    <Reveal
      as="section"
      className="section fact-sheet-section"
      delay={88}
      aria-labelledby="may16-heading"
    >
      <h2 className="section__title" id="may16-heading">
        <span className="section__title-icon" aria-hidden="true">
          🌍
        </span>{" "}
        The world on your birthday
      </h2>
      <p className="section__lead">
        Like those keepsake posters for newborns — a little of what May 16 was up to, and what
        {BIRTH_DATE.year} felt like when you showed up.
      </p>

      <div className="fact-sheet__snapshot" role="group" aria-label={`${dateLine} snapshot`}>
        <p className="fact-sheet__snapshot-date">{dateLine}</p>
        <ul className="fact-sheet__snapshot-list">
          <li>
            <strong>Moon</strong> — {BIRTH_DAY_SNAPSHOT.moonSummary}
          </li>
          <li>
            <strong>#1 single (U.S.)</strong> — &ldquo;{BIRTH_DAY_SNAPSHOT.chartTitle}&rdquo; by{" "}
            {BIRTH_DAY_SNAPSHOT.chartArtist}
          </li>
        </ul>
        <p className="fact-sheet__snapshot-note">{BIRTH_DAY_SNAPSHOT.chartNote}</p>
        <p className="fact-sheet__snapshot-note fact-sheet__snapshot-note--soft">
          {BIRTH_DAY_SNAPSHOT.moonDetail}
        </p>
      </div>

      <p className="fact-sheet__era">{ERA_SNIPPET}</p>

      <div className="fact-sheet__hubble-wrap">
        <h3 className="fact-sheet__subhead fact-sheet__subhead--hubble" id="may16-hubble-heading">
          What Hubble saw on May 16
        </h3>
        <p className="fact-sheet__hubble-deck" id="may16-hubble-deck">
          On May 16 in {HUBBLE_ON_MAY16.observationYear}, this was the view — three galaxies caught in
          the same frame.
        </p>
        <figure
          className="fact-sheet__hubble"
          aria-labelledby="may16-hubble-heading"
          aria-describedby="may16-hubble-deck may16-hubble-caption"
        >
          <div className="fact-sheet__hubble-frame">
            <img
              className="fact-sheet__hubble-img"
              src={hubbleHcg90Img}
              alt="Hubble Space Telescope image of Hickson Compact Group 90: three bright interacting galaxies — NGC 7173 left of center, distorted spiral NGC 7174 upper right, and elliptical NGC 7176 lower right — against a field of distant stars and galaxies."
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="fact-sheet__hubble-caption" id="may16-hubble-caption">
            <strong className="fact-sheet__hubble-title">{HUBBLE_ON_MAY16.title}</strong>
            <span className="fact-sheet__hubble-body"> {HUBBLE_ON_MAY16.body}</span>
            <span className="fact-sheet__hubble-credit">Image: {HUBBLE_ON_MAY16.credit}</span>
          </figcaption>
        </figure>
      </div>

      <h3 className="fact-sheet__subhead" id="may16-events-heading">
        This date in history
      </h3>
      <ul className="fact-sheet__events" aria-labelledby="may16-events-heading">
        {ON_THIS_DAY_EVENTS.map((e) => (
          <li key={e.year} className="fact-sheet__event">
            <span className="fact-sheet__event-year">{e.year}</span>
            <span className="fact-sheet__event-text">{e.text}</span>
          </li>
        ))}
      </ul>

      <h3 className="fact-sheet__subhead" id="may16-birthdays-heading">
        Some famous May 16 birthdays
      </h3>
      <p className="fact-sheet__birthday-lead" id="may16-birthdays-desc">
        You share the calendar with:
      </p>
      <ul className="fact-sheet__birthdays" aria-describedby="may16-birthdays-desc">
        {SHARED_BIRTHDAYS.map((p) => (
          <li key={p.name} className="fact-sheet__birthday-chip">
            {p.name}{" "}
            <span className="fact-sheet__birthday-year">({p.year})</span>
          </li>
        ))}
      </ul>

      <p className="fact-sheet__footnote">
        None of this had to happen for your birthday to matter — it&apos;s just fun context, like
        tiny footnotes in the margin of the universe.
      </p>
    </Reveal>
  );
}

function FloridaManMay16Section() {
  return (
    <Reveal
      as="section"
      className="section florida-man-section"
      delay={90}
      aria-labelledby="florida-man-heading"
    >
      <h2 className="section__title" id="florida-man-heading">
        <span className="section__title-icon" aria-hidden="true">
          🐊
        </span>{" "}
        Florida Man, May 16
      </h2>
      <p className="section__lead">
        Headlines that share your birthday on the calendar — absolutely not your energy, just peak
        peninsula chaos for the date.
      </p>
      <ul className="florida-man__list" aria-label="Florida Man headlines on May 16">
        {FLORIDA_MAN_MAY16_HEADLINES.map((item, idx) => (
          <li key={`${item.year}-${idx}`} className="florida-man__card">
            <span className="florida-man__year">{item.year}</span>
            <p className="florida-man__headline">{item.headline}</p>
          </li>
        ))}
      </ul>
      <p className="florida-man__footnote">
        Curated for laughs — you are not legally responsible for any of this.
      </p>
    </Reveal>
  );
}

function ThinkOfYouGridSection() {
  return (
    <Reveal
      as="section"
      className="section think-of-you-section"
      delay={95}
      aria-labelledby="think-of-you-heading"
    >
      <h2 className="section__title" id="think-of-you-heading">
        <span className="section__title-icon" aria-hidden="true">
          💭
        </span>{" "}
        Things that remind me of you
      </h2>
      <p className="section__lead">A little 3x3 mood board of Cassidy energy.</p>

      <div className="think-of-you-grid" role="list" aria-label="Things that remind me of you">
        {THINK_OF_YOU_IMAGES.map((src, idx) => (
          <figure className="think-of-you-grid__item" role="listitem" key={`${src}-${idx}`}>
            <img
              src={src}
              alt={`Thing that reminds me of you ${idx + 1}`}
              className="think-of-you-grid__img"
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </Reveal>
  );
}

function WyrResetButton({ onReset }) {
  return (
    <button
      type="button"
      className="wyr__reset wyr__reset--active"
      onClick={onReset}
      aria-label="Reset would you rather from the start"
      title="Reset"
    >
      <svg
        className="wyr__reset-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803 -3.7M4.031 9.865a8.25 8.25 0 0 1 13.803 -3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    </button>
  );
}

function WouldYouRatherSection() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);

  const resetAll = useCallback(() => {
    setIndex(0);
    setChoice(null);
  }, []);

  const total = WYR_QUESTIONS.length;
  const finished = index >= total;
  const q = !finished ? WYR_QUESTIONS[index] : null;
  const picked = choice !== null && q !== null;
  const match = picked && choice === q.pickForHer;

  const handlePick = useCallback(
    (letter) => {
      if (!q || choice !== null) return;
      setChoice(letter);
    },
    [q, choice],
  );

  const goNext = useCallback(() => {
    setIndex((i) => i + 1);
    setChoice(null);
  }, []);

  const showReset = index > 0 || choice !== null || finished;

  return (
    <Reveal
      as="section"
      className="section wyr"
      delay={50}
      aria-labelledby="wyr-heading"
    >
      <h2 className="section__title" id="wyr-heading">
        <span className="section__title-icon" aria-hidden="true">
          🤔
        </span>{" "}
        Would you rather…
      </h2>
      <p className="section__lead">
        Tap what you&apos;d pick, then see if I guessed the same for you.
      </p>

      {finished ? (
        <div className="wyr__panel wyr__panel--done">
          {showReset ? (
            <div className="wyr__panel-bar wyr__panel-bar--done">
              <WyrResetButton onReset={resetAll} />
            </div>
          ) : null}
          <p className="wyr__done-text">
            That&apos;s every round. You&apos;re kind of wonderful.
          </p>
          <button
            type="button"
            className="btn btn--ghost wyr__again"
            onClick={resetAll}
          >
            Play again
          </button>
        </div>
      ) : (
        <div className="wyr__panel">
          {showReset ? (
            <div className="wyr__panel-bar">
              <p className="wyr__progress" aria-live="polite">
                {index + 1} / {total}
              </p>
              <WyrResetButton onReset={resetAll} />
            </div>
          ) : (
            <p className="wyr__progress wyr__progress--solo" aria-live="polite">
              {index + 1} / {total}
            </p>
          )}

          <h3 className="wyr__question">{q.question}</h3>

          {picked ? (
            <p className="wyr__a11y-live" aria-live="polite">
              {match ? "Same as my guess." : "Different from my guess."}
            </p>
          ) : null}

          <div className="wyr__choices">
            <button
              type="button"
              className={[
                "wyr__choice",
                picked &&
                  choice === "a" &&
                  (match
                    ? "wyr__choice--picked wyr__choice--match"
                    : "wyr__choice--picked wyr__choice--miss"),
                picked && choice !== "a" ? "wyr__choice--idle" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={picked}
              onClick={() => handlePick("a")}
              aria-label={
                picked && choice === "a"
                  ? `You picked ${q.a}. ${match ? "Same as my guess." : "Different from my guess."}`
                  : picked
                    ? `${q.a}, not selected`
                    : `Answer A: ${q.a}`
              }
            >
              {picked && choice === "a" ? (
                <span
                  className="wyr__choice-face"
                  aria-hidden="true"
                  title={match ? "Match" : "No match"}
                >
                  {match ? "😊" : "😢"}
                </span>
              ) : null}
              <span className="wyr__choice-label">A</span>
              <span className="wyr__choice-text">{q.a}</span>
            </button>
            <button
              type="button"
              className={[
                "wyr__choice",
                picked &&
                  choice === "b" &&
                  (match
                    ? "wyr__choice--picked wyr__choice--match"
                    : "wyr__choice--picked wyr__choice--miss"),
                picked && choice !== "b" ? "wyr__choice--idle" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={picked}
              onClick={() => handlePick("b")}
              aria-label={
                picked && choice === "b"
                  ? `You picked ${q.b}. ${match ? "Same as my guess." : "Different from my guess."}`
                  : picked
                    ? `${q.b}, not selected`
                    : `Answer B: ${q.b}`
              }
            >
              {picked && choice === "b" ? (
                <span
                  className="wyr__choice-face"
                  aria-hidden="true"
                  title={match ? "Match" : "No match"}
                >
                  {match ? "😊" : "😢"}
                </span>
              ) : null}
              <span className="wyr__choice-label">B</span>
              <span className="wyr__choice-text">{q.b}</span>
            </button>
          </div>

          {picked ? (
            <div className="wyr__next-wrap">
              <button
                type="button"
                className="btn btn--primary wyr__next"
                onClick={goNext}
              >
                {index + 1 < total ? "Next question" : "Finish"}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </Reveal>
  );
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const { ref, visible } = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal--visible" : ""} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function FloatingDecor() {
  const items = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${((i * 47) % 92) + 4}%`,
        delay: `${(i * 0.31) % 6}s`,
        duration: `${7 + (i % 6)}s`,
        size: `${0.85 + (i % 5) * 0.15}rem`,
        symbol: ["♡", "💕", "✨", "💖", "🌷"][i % 5],
      })),
    [],
  );
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
  );
}

function App() {
  const [openingDone, setOpeningDone] = useState(false);
  const [playlistIntroDone, setPlaylistIntroDone] = useState(false);
  const [playlistPopupOpen, setPlaylistPopupOpen] = useState(false);
  const [embedPlaying, setEmbedPlaying] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (!playlistPopupOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPlaylistPopupOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playlistPopupOpen]);

  useEffect(() => {
    if (!playlistPopupOpen || !playlistIntroDone) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [playlistPopupOpen, playlistIntroDone]);

  useEffect(() => {
    if (!playlistIntroDone) return;
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 520);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [playlistIntroDone]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!openingDone) {
    return (
      <OpeningSequence
        letterMessage={LETTER_TO_CASSIDY}
        onContinue={() => setOpeningDone(true)}
      />
    );
  }

  const embedHostClass = [
    "playlist-embed-host",
    !playlistIntroDone
      ? "playlist-embed-host--gate"
      : "playlist-embed-host--main",
    playlistIntroDone &&
      (playlistPopupOpen
        ? "playlist-embed-host--main-popup"
        : "playlist-embed-host--main-hidden"),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        className={embedHostClass}
        id="playlist-embed-host"
        role={playlistIntroDone && playlistPopupOpen ? "dialog" : undefined}
        aria-modal={playlistIntroDone && playlistPopupOpen ? true : undefined}
        aria-label={
          playlistIntroDone && playlistPopupOpen
            ? "Spotify playlist"
            : undefined
        }
      >
        <div className="playlist-embed-host__glow" aria-hidden="true" />
        {!playlistIntroDone ? (
          <>
            <header className="playlist-gate-ui__header">
              <p className="playlist-gate-ui__eyebrow">Soundtrack</p>
              <h1 className="playlist-gate-ui__title">Pick a song</h1>
              <p className="playlist-gate-ui__sub">
                After you continue, the player hides so the site stays clean.
                Tap <strong>Music</strong> (bottom left) anytime to open the
                full playlist — same player, so your song keeps going.
              </p>
            </header>
            <div className="playlist-embed-host__frame">
              <SpotifyPlaylistEmbed onPlaybackChange={setEmbedPlaying} />
            </div>
            <footer className="playlist-gate-ui__footer">
              <button
                type="button"
                className="btn btn--primary playlist-gate-ui__cta"
                onClick={() => setPlaylistIntroDone(true)}
              >
                Continue to the birthday site
              </button>
            </footer>
          </>
        ) : (
          <>
            {playlistPopupOpen && (
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
          </>
        )}
      </div>

      {playlistIntroDone && (
        <>
          <div className="app__bg" aria-hidden="true" />
          <FloatingDecor />
          <div
            className={`app app--enter${playlistIntroDone ? " app--with-playlist-dock" : ""}`}
          >
            <header className="hero">
              <div className="hero__ribbon" aria-hidden="true">
                <span className="hero__ribbon-dot" />
                <span className="hero__ribbon-dot" />
                <span className="hero__ribbon-dot" />
              </div>
              <h1 className="hero__title">
                {["Happy", "Birthday,", "Cassidy!"].map((word, i) => (
                  <span
                    key={word}
                    className="hero__word"
                    style={{ animationDelay: `${200 + i * 140}ms` }}
                  >
                    {word}{" "}
                  </span>
                ))}
              </h1>
              <p
                className="hero__sub animate-rise"
                style={{ animationDelay: "0.65s" }}
              >
                This tiny corner of the internet is 100% yours today.{" "}
                <span className="hero__heart" aria-label="love">
                  💕
                </span>
              </p>
              <figure className="hero-quote-card">
                <img
                  className="hero-quote-card__photo"
                  src={profileImg}
                  alt="Cassidy portrait"
                  loading="lazy"
                  decoding="async"
                />
                <blockquote className="hero-quote-card__quote">
                  I have spent years looking at the world, thinking I was
                  complete on my own, but I was only a half-written story. You
                  are the missing lines, the right word that makes the whole
                  messy poem make sense. Finding you wasn&apos;t just a stroke
                  of luck; it was the profound, quiet realization that the
                  universe finally stopped being indifferent to me and gave me
                  exactly what I needed to be whole.
                </blockquote>
                <figcaption className="hero-quote-card__author">
                  — Mark Twain
                </figcaption>
              </figure>
            </header>

            <main className="main">
              <WouldYouRatherSection />

              <PhotoGallerySection />

              <TimelineSection />

              <May16WorldSection />

              <FloridaManMay16Section />

              <ThinkOfYouGridSection />

              <Reveal
                as="section"
                className="section section--footer"
                delay={100}
              >
                <footer className="footer">
                  <p className="footer__line">
                    Made with love and a lot of pink CSS just for you.
                  </p>
                  <dl className="footer__stats" aria-label="Project stats">
                    {PROJECT_STATS.map((stat) => (
                      <div className="footer__stat" key={stat.label}>
                        <dt className="footer__stat-value">{stat.value}</dt>
                        <dd className="footer__stat-label">{stat.label}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="footer__hearts" aria-hidden="true">
                    <span>♡</span>
                    <span>♡</span>
                    <span>♡</span>
                  </p>
                </footer>
              </Reveal>

              <Reveal
                as="section"
                className="section section--closing-signature"
                delay={120}
              >
                <div className="closing-signature" aria-label="Closing message">
                  <p className="closing-signature__headline">
                    Happy Birthday, Cassidy <span aria-hidden="true">💕</span>
                  </p>
                  <p className="closing-signature__signoff">Love, Mike</p>
                  <p className="closing-signature__date">May 16th 2026</p>
                </div>
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
            className={`music-fab${embedPlaying ? " music-fab--beat" : ""}`}
            onClick={() => setPlaylistPopupOpen((o) => !o)}
            aria-label={playlistPopupOpen ? "Close playlist" : "Open playlist"}
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

          {playlistIntroDone && showBackToTop && (
            <button
              type="button"
              className="back-to-top-pill"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              ↑ Top
            </button>
          )}
        </>
      )}
    </>
  );
}

export default App;
