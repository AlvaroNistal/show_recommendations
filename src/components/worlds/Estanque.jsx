import { useEffect, useState } from 'react'
import { speak } from '../../lib/tts.js'

const POND_COLORS = ['bg-blue-100 border-blue-300', 'bg-teal-100 border-teal-300', 'bg-cyan-100 border-cyan-300']
const POND_LABELS = ['🪣 A', '🪣 B', '🪣 C']

export default function Estanque({ config, audioOn, onComplete }) {
  const { total, ponds, targetPerPond, emoji } = config

  // Each creature has an index 0..(total-1) and an assignment (null | 0..ponds-1)
  const [assignments, setAssignments] = useState(Array(total).fill(null))
  const [done, setDone] = useState(false)

  const pondCounts = Array.from({ length: ponds }, (_, p) =>
    assignments.filter((a) => a === p).length
  )
  const allAssigned = assignments.every((a) => a !== null)
  const allEqual = pondCounts.every((c) => c === targetPerPond)
  const complete = allAssigned && allEqual

  useEffect(() => {
    if (complete && !done) {
      setDone(true)
      if (audioOn) speak('¡Perfecto! ¡Están repartidos en partes iguales!', 'es-ES')
      setTimeout(() => onComplete(), 1400)
    }
  }, [complete, done, audioOn, onComplete])

  function tapCreature(index) {
    if (done) return
    setAssignments((prev) => {
      const next = [...prev]
      const cur = prev[index]
      if (cur === null) {
        next[index] = 0
      } else if (cur < ponds - 1) {
        next[index] = cur + 1
      } else {
        next[index] = null
      }
      return next
    })
  }

  // Unassigned creatures pool
  const unassigned = assignments.map((a, i) => (a === null ? i : -1)).filter((i) => i >= 0)

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-5 px-4">
      {/* Unassigned pool */}
      <div className="flex min-h-16 w-full max-w-sm flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3">
        <span className="absolute text-sm text-slate-400">
          {unassigned.length === 0 ? '¡Todos asignados!' : ''}
        </span>
        {unassigned.map((i) => (
          <button
            key={i}
            onClick={() => tapCreature(i)}
            className="animate-pop text-4xl transition active:scale-75"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Ponds */}
      <div className={`flex w-full max-w-sm gap-3 ${ponds === 3 ? 'flex-wrap justify-center' : ''}`}>
        {Array.from({ length: ponds }, (_, p) => {
          const count = pondCounts[p]
          const isFull = count === targetPerPond
          return (
            <div
              key={p}
              className={`flex flex-1 min-w-24 flex-col items-center rounded-2xl border-2 p-3 transition-colors ${
                isFull ? 'border-emerald-400 bg-emerald-50' : POND_COLORS[p]
              }`}
            >
              <span className="mb-1 text-sm font-bold text-slate-500">{POND_LABELS[p]}</span>
              <div className="flex flex-wrap justify-center gap-1">
                {assignments
                  .map((a, i) => ({ a, i }))
                  .filter(({ a }) => a === p)
                  .map(({ i }) => (
                    <button
                      key={i}
                      onClick={() => tapCreature(i)}
                      className="text-3xl transition active:scale-75"
                    >
                      {emoji}
                    </button>
                  ))}
              </div>
              <span className={`mt-1 text-xl font-black ${isFull ? 'text-emerald-600' : 'text-slate-500'}`}>
                {count}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-sm text-slate-400">Toca un animal para moverlo</p>

      {/* Live check */}
      {allAssigned && !allEqual && (
        <p className="text-base font-bold text-rose-500">
          Necesitas {targetPerPond} en cada estanque
        </p>
      )}
    </div>
  )
}
