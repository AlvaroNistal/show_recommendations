import { useEffect, useState } from 'react'
import { speak } from '../../lib/tts.js'

export default function Balanza({ config, audioOn, onComplete }) {
  const [leftItems, setLeftItems] = useState([])
  const [justBalanced, setJustBalanced] = useState(false)

  const leftTotal = leftItems.reduce((s, it) => s + it.value, 0)
  const rightTotal = config.rightItems.reduce((s, it) => s + it.value, 0)
  const diff = leftTotal - rightTotal   // negative = left is lighter
  const balanced = diff === 0 && leftItems.length > 0

  // Plates physically rise/fall: lighter side floats up, heavier sinks down
  const leftY = Math.max(-28, Math.min(28, diff * 7))
  const rightY = -leftY

  useEffect(() => {
    if (balanced && !justBalanced) {
      setJustBalanced(true)
      if (audioOn) speak('¡Equilibrada! ¡Muy bien!', 'es-ES')
      setTimeout(() => onComplete(), 1200)
    }
  }, [balanced, justBalanced, audioOn, onComplete])

  function addItem(item) {
    if (leftTotal >= rightTotal + 6) return   // hard cap: don't let it go way over
    setLeftItems((prev) => [...prev, item])
    setJustBalanced(false)
  }

  function removeItem(index) {
    setLeftItems((prev) => prev.filter((_, i) => i !== index))
    setJustBalanced(false)
  }

  const statusEmoji = balanced ? '⚖️' : diff < 0 ? '⬆️' : '⬇️'
  const statusText  = balanced ? '¡Equilibrada!' : diff < 0 ? 'Falta peso' : 'Demasiado'

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4">

      {/* The two plates */}
      <div className="flex w-full max-w-sm items-end justify-center gap-6">

        {/* Left plate — child adds here */}
        <div
          className="flex flex-col items-center gap-2 transition-transform duration-500"
          style={{ transform: `translateY(${leftY}px)` }}
        >
          <div
            className={`flex min-h-28 w-36 flex-wrap content-center items-center justify-center gap-2 rounded-3xl border-4 p-3 text-4xl transition-colors duration-300 ${
              balanced
                ? 'border-emerald-400 bg-emerald-50'
                : leftItems.length === 0
                  ? 'border-dashed border-slate-300 bg-slate-50'
                  : 'border-amber-300 bg-amber-50'
            }`}
          >
            {leftItems.length === 0 ? (
              <span className="text-3xl text-slate-300">+</span>
            ) : (
              leftItems.map((it, i) => (
                <button
                  key={i}
                  onClick={() => removeItem(i)}
                  className="leading-none transition active:scale-75"
                  aria-label="Quitar"
                >
                  {it.emoji}
                </button>
              ))
            )}
          </div>
          <span className="text-3xl font-black text-slate-700">{leftTotal}</span>
          <span className="text-sm font-semibold text-slate-400">Tu lado</span>
        </div>

        {/* Central status */}
        <div className="flex flex-col items-center gap-1 pb-10">
          <span className="text-4xl">{statusEmoji}</span>
          <span className={`text-xs font-bold ${balanced ? 'text-emerald-600' : 'text-slate-400'}`}>
            {statusText}
          </span>
        </div>

        {/* Right plate — fixed target */}
        <div
          className="flex flex-col items-center gap-2 transition-transform duration-500"
          style={{ transform: `translateY(${rightY}px)` }}
        >
          <div className="flex min-h-28 w-36 flex-wrap content-center items-center justify-center gap-2 rounded-3xl border-4 border-slate-300 bg-white p-3 text-4xl shadow">
            {config.rightItems.map((it, i) => (
              <span key={i} className="leading-none">{it.emoji}</span>
            ))}
          </div>
          <span className="text-3xl font-black text-slate-700">{rightTotal}</span>
          <span className="text-sm font-semibold text-slate-400">Objetivo</span>
        </div>
      </div>

      {/* Weight palette */}
      <div className="flex flex-wrap justify-center gap-4">
        {config.palette.map((item) => (
          <button
            key={item.emoji}
            onClick={() => addItem(item)}
            disabled={justBalanced}
            className="flex min-h-20 min-w-20 flex-col items-center justify-center gap-1 rounded-3xl border-b-8 border-violet-200 bg-white px-4 py-3 shadow-lg transition active:translate-y-1 active:border-b-4 disabled:opacity-40"
          >
            <span className="text-4xl leading-none">{item.emoji}</span>
            {config.palette.length > 1 && (
              <span className="text-lg font-black text-slate-500">= {item.value}</span>
            )}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-400">
        Toca una pesa para añadir · Toca tu lado para quitar
      </p>
    </div>
  )
}
