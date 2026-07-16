import { useEffect, useState } from 'react'
import { speak } from '../../lib/tts.js'

export default function Balanza({ config, audioOn, onComplete }) {
  const [leftItems, setLeftItems] = useState([])
  const [justBalanced, setJustBalanced] = useState(false)

  const leftTotal = leftItems.reduce((s, it) => s + it.value, 0)
  const rightTotal = config.rightItems.reduce((s, it) => s + it.value, 0)
  const diff = leftTotal - rightTotal // negative = left lighter (right side dips)
  const balanced = diff === 0 && leftItems.length > 0

  const tiltDeg = Math.max(-18, Math.min(18, diff * 4))

  useEffect(() => {
    if (balanced && !justBalanced) {
      setJustBalanced(true)
      if (audioOn) speak('¡Equilibrada! ¡Muy bien!', 'es-ES')
      setTimeout(() => onComplete(), 1200)
    }
  }, [balanced, justBalanced, audioOn, onComplete])

  function addItem(item) {
    if (leftTotal + item.value > rightTotal + 5) return
    setLeftItems((prev) => [...prev, item])
    setJustBalanced(false)
  }

  function removeItem(index) {
    setLeftItems((prev) => prev.filter((_, i) => i !== index))
    setJustBalanced(false)
  }

  const statusLabel = balanced
    ? '⚖️ ¡Equilibrada!'
    : diff < 0
      ? '↗️ Falta peso'
      : diff > 0
        ? '↙️ Demasiado peso'
        : ''

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 px-4">
      {/* Scale visual */}
      <div className="relative flex h-48 w-full max-w-sm items-end justify-center">
        {/* Stand post */}
        <div className="absolute bottom-0 left-1/2 z-10 h-20 w-3 -translate-x-1/2 rounded-full bg-amber-700" />

        {/* Beam container — rotates around center */}
        <div
          className="balance-beam absolute flex w-72 items-end justify-between"
          style={{ bottom: '4.5rem', transform: `rotateZ(${tiltDeg}deg)` }}
        >
          {/* Left pan */}
          <div
            className="flex flex-col items-center"
            style={{ transform: `rotateZ(${-tiltDeg}deg)` }}
          >
            <div className="h-10 w-0.5 bg-amber-600" />
            <div
              className={`flex min-h-12 min-w-16 flex-wrap content-center justify-center gap-1 rounded-xl border-2 p-2 text-2xl transition-colors ${
                balanced
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-amber-300 bg-amber-50'
              }`}
            >
              {leftItems.map((it, i) => (
                <button
                  key={i}
                  onClick={() => removeItem(i)}
                  className="leading-none transition active:scale-75"
                >
                  {it.emoji}
                </button>
              ))}
              {leftItems.length === 0 && (
                <span className="text-lg text-amber-300">?</span>
              )}
            </div>
          </div>

          {/* Beam bar */}
          <div className="h-2 flex-1 rounded-full bg-amber-700" />

          {/* Right pan */}
          <div
            className="flex flex-col items-center"
            style={{ transform: `rotateZ(${-tiltDeg}deg)` }}
          >
            <div className="h-10 w-0.5 bg-amber-600" />
            <div className="flex min-h-12 min-w-16 flex-wrap content-center justify-center gap-1 rounded-xl border-2 border-amber-300 bg-amber-50 p-2 text-2xl">
              {config.rightItems.map((it, i) => (
                <span key={i} className="leading-none">
                  {it.emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weight totals */}
      <div className="flex w-full max-w-xs items-center justify-between px-2 text-lg font-bold text-slate-600">
        <span>{leftTotal > 0 ? `= ${leftTotal}` : ''}</span>
        <span
          className={`text-center text-base font-black transition-colors ${balanced ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          {statusLabel}
        </span>
        <span>= {rightTotal}</span>
      </div>

      {/* Weight legend for mixed weights */}
      {config.palette.length > 1 && (
        <div className="flex gap-4 text-sm text-slate-500">
          {config.palette.map((w) => (
            <span key={w.emoji}>
              {w.emoji} = {w.value}
            </span>
          ))}
        </div>
      )}

      {/* Palette — tap to add to left pan */}
      <div className="flex gap-4">
        {config.palette.map((item) => (
          <button
            key={item.emoji}
            onClick={() => addItem(item)}
            disabled={justBalanced}
            className="flex min-h-20 min-w-20 flex-col items-center justify-center gap-1 rounded-3xl border-b-8 border-violet-200 bg-white p-4 text-5xl shadow-lg transition active:translate-y-1 active:border-b-4 disabled:opacity-40"
          >
            {item.emoji}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-400">
        Toca una pesa para añadirla · Toca el pan para quitarla
      </p>
    </div>
  )
}
