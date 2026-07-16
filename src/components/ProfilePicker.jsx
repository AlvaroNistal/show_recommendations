import { useRef, useState } from 'react'
import { PROFILES } from '../exercises/index.js'
import { speak } from '../lib/tts.js'

// Parent gate: hold for 3 seconds — trivial for adults, hard for a 4-year-old.
function HoldButton({ onUnlock }) {
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)

  function start() {
    const t0 = Date.now()
    intervalRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / 3000)
      setProgress(p)
      if (p >= 1) {
        clearInterval(intervalRef.current)
        setProgress(0)
        onUnlock()
      }
    }, 50)
  }

  function stop() {
    clearInterval(intervalRef.current)
    setProgress(0)
  }

  return (
    <button
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onContextMenu={(e) => e.preventDefault()}
      className="relative overflow-hidden rounded-full bg-white/70 px-6 py-3 text-sm font-bold text-slate-500 shadow"
    >
      <span
        className="absolute inset-y-0 left-0 bg-violet-200 transition-none"
        style={{ width: `${progress * 100}%` }}
      />
      <span className="relative">👨‍👩‍👧‍👦 Padres (mantén pulsado)</span>
    </button>
  )
}

export default function ProfilePicker({ onPick, onParent }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-gradient-to-b from-violet-100 to-amber-50 p-6">
      <h1 className="text-center text-4xl font-black text-violet-600">
        🌟 Aprende Conmigo
      </h1>
      <p className="text-xl font-bold text-slate-500">¿Quién va a jugar hoy?</p>

      <div className="flex flex-wrap items-center justify-center gap-8">
        {PROFILES.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              // A user gesture here also unlocks speech synthesis on mobile.
              speak(`¡Hola ${p.name}! ¡Vamos a jugar!`, 'es-ES')
              onPick(p)
            }}
            className={`flex h-52 w-52 flex-col items-center justify-center gap-3 rounded-[2.5rem] border-b-8 border-white/60 bg-white shadow-xl transition hover:scale-105 active:scale-95 ring-4 ${p.theme.ring}`}
          >
            <span className="animate-bounce-soft text-7xl">{p.avatar}</span>
            <span className="text-3xl font-black text-slate-700">{p.name}</span>
          </button>
        ))}
      </div>

      <HoldButton onUnlock={onParent} />
    </div>
  )
}
