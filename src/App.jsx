import { useMemo, useRef, useState } from 'react'
import './App.css'
import thankYouImg from './assets/thank-you.webp'

function StarIcon({ className = '' }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
    </svg>
  )
}

function RatingOption({ value, isSelected, onSelect, buttonRef }) {
  const label = String(value)
  return (
    <button
      type="button"
      className={`rating-option ${isSelected ? 'rating-option--selected' : ''}`}
      aria-pressed={isSelected}
      aria-label={`Rate ${label}`}
      onClick={() => onSelect(value)}
      ref={buttonRef}
    >
      {label}
    </button>
  )
}

function RatingCard() {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const options = useMemo(() => [1, 2, 3, 4, 5], [])
  const buttonsRef = useRef([])

  const handleKeyNav = (e) => {
    if (submitted) return
    const currentIndex = selected ? options.indexOf(selected) : -1
    let nextIndex = currentIndex
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
      e.preventDefault()
    }
    if (nextIndex !== currentIndex && nextIndex >= 0) {
      const nextValue = options[nextIndex]
      setSelected(nextValue)
      const btn = buttonsRef.current[nextIndex]
      if (btn) btn.focus()
    }
  }

  if (submitted) {
    return (
      <section className="rating-card" aria-live="polite">
        <img
          className="rating-illustration"
          src={thankYouImg}
          alt="Receipt on phone illustration"
        />
        <div className="rating-badge" role="status">You selected {selected} out of {options.length}</div>
        <h1 className="rating-title">Thank you!</h1>
        <p className="rating-description">We appreciate you taking the time to rate your experience. If you ever need more support, don’t hesitate to get in touch.</p>
      </section>
    )
  }

  return (
    <section className="rating-card" onKeyDown={handleKeyNav}>
      <div className="rating-star" aria-hidden="true">
        <StarIcon />
      </div>
      <h1 className="rating-title">How did we do?</h1>
      <p className="rating-description">Please let us know how we did with your support request. All feedback is appreciated to help us improve our offering!</p>

      <div className="rating-options" role="group" aria-label="Rating">
        {options.map((n, i) => (
          <RatingOption
            key={n}
            value={n}
            isSelected={selected === n}
            onSelect={setSelected}
            buttonRef={(el) => (buttonsRef.current[i] = el)}
          />
        ))}
      </div>

      <button
        type="button"
        className={`submit-button ${selected ? '' : 'submit-button--disabled'}`}
        disabled={!selected}
        onClick={() => selected && setSubmitted(true)}
      >
        SUBMIT
      </button>
    </section>
  )
}

export default function App() {
  return (
    <main className="app-shell">
      <RatingCard />
    </main>
  )
}
