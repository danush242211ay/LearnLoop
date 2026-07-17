import { useRef } from 'react'

export default function OtpInput({ length = 6, value, onChange }) {
  const inputsRef = useRef([])
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  function setDigit(i, char) {
    const next = digits.slice()
    next[i] = char
    onChange(next.join(''))
  }

  function handleChange(e, i) {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    setDigit(i, char)
    if (char && i < length - 1) inputsRef.current[i + 1]?.focus()
  }

  function handleKeyDown(e, i) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus()
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      e.preventDefault()
      onChange(pasted.padEnd(length, '').slice(0, length).trimEnd())
      const lastIndex = Math.min(pasted.length, length) - 1
      inputsRef.current[lastIndex]?.focus()
    }
  }

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="h-14 w-full max-w-[52px] rounded-xl border border-hairline bg-surface2 text-center
                     font-mono text-xl font-semibold text-ink transition-colors
                     focus:border-amber/60 focus:outline-none"
        />
      ))}
    </div>
  )
}
