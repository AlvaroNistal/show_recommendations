import { useEffect, useState } from 'react'
import { speak } from '../../lib/tts.js'

const POND_STYLES = [
  'border-blue-300 bg-blue-50',
  'border-teal-300 bg-teal-50',
  'border-violet-300 bg-violet-50',
]
const POND_LABELS = ['A', 'B', 'C']

export default function Estanque({ config, audioOn, onComplete }) {
  const { total, ponds, targetPerPond, emoji } = config

  const [pondCounts, setPondCounts] = useState(Array(ponds).fill(0))
  const [done, setDone] = useState(false)

  const assigned = pondCounts.reduce((s, c) => s + c, 0)
  const remaining = total - assigned
  const allAssigned = remaining === 0
  const allEqual = pondCounts.every((c) => c === targetPerPond)

  useEffect(() => {
    if (allAssigned && allEqual && !done) {
      setDone(true)
      if (audioOn) speak('¡Perfecto! ¡Están repartidos en partes iguales!', 'es-ES')
      setTimeout(() => onComplete(), 1400)
    }
  }, [allAssigned, allEqual, done, audioOn, onComplete])

  function addToPond(p) {
    if (remaining === 0 || done) return
    setPondCounts((prev) => {
      const next = [...prev]
      next[p]++
      return next
    })
  }

  function restart() {
    setPondCounts(Array(ponds).fill(0))
    setDone(false)
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4">

      {/* Creature progress strip */}
      <div className="flex flex-wrap justify-center gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`text-3xl transition-opacity ${i < assigned ? 'opacity-100' : 'opacity-25'}`}>
            {emoji}
          </span>
        ))}
      </div>

      {/* Active creature / done state */}
      {!allAssigned ? (
        <div className="flex flex-col items-center gap-2">
          <span className="animate-bounce-soft text-8xl">{emoji}</span>
          <span className="text-lg font-bold text-slate-600">¿A qué estanque va?</span>
        </div>
      ) : allEqual ? (
        <div className="text-5xl">⚖️</div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-center text-lg font-bold text-rose-500">
            ¡No son iguales! Necesitas {targetPerPond} en cada estanque.
          </p>
          <button
            onClick={restart}
            className="rounded-full bg-violet-500 px-6 py-3 text-lg font-black text-white shadow-lg transition active:scale-95"
          >
            Empezar de nuevo
          </button>
        </div>
      )}

      {/* Pond buttons */}
      <div className={`flex w-full max-w-sm gap-4 ${ponds === 3 ? 'flex-wrap justify-center' : ''}`}>
        {Array.from({ length: ponds }, (_, p) => {
          const count = pondCounts[p]
          const full = count === targetPerPond
          return (
            <button
              key={p}
              onClick={() => addToPond(p)}
              disabled={allAssigned || done}
              className={`flex flex-1 min-w-28 flex-col items-center gap-2 rounded-3xl border-4 p-4 shadow transition active:scale-95 disabled:cursor-default ${
                full ? 'border-emerald-400 bg-emerald-50' : POND_STYLES[p]
              }`}
            >
              <span className="text-base font-black text-slate-600">
                Estanque {POND_LABELS[p]}
              </span>
              <div className="flex min-h-10 flex-wrap justify-center gap-1">
                {Array.from({ length: count }, (_, i) => (
                  <span key={i} className="text-2xl leading-none">{emoji}</span>
                ))}
              </div>
              <span className={`text-3xl font-black ${full ? 'text-emerald-600' : 'text-slate-700'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
