import { useEffect } from 'react'
import { Confetti } from './Celebration.jsx'
import { speak } from '../lib/tts.js'

// Closing screen celebrates what the kid did today — they chose to stop,
// and that choice is rewarded, never guilted (PRD 4.4 / UX principles).
export default function Summary({ profile, summary, onCollection, onHome }) {
  useEffect(() => {
    speak(
      `¡Muy bien, ${profile.name}! Hoy has ganado ${summary.starsToday} ${summary.starsToday === 1 ? 'estrella' : 'estrellas'}. ¡Hasta pronto!`,
      'es-ES',
    )
  }, [profile, summary])

  return (
    <div className={`flex min-h-dvh flex-col items-center justify-center gap-6 bg-gradient-to-b ${profile.theme.bg} p-6`}>
      <Confetti count={36} />
      <div className="animate-star-fly text-8xl">{profile.avatar}</div>
      <h1 className="text-center text-4xl font-black text-violet-600">¡Muy bien, {profile.name}!</h1>

      <div className="flex gap-4">
        <div className="animate-pop flex flex-col items-center gap-1 rounded-3xl bg-white/90 px-8 py-5 shadow-lg">
          <span className="text-5xl">⭐</span>
          <span className="text-4xl font-black text-amber-500">{summary.starsToday}</span>
          <span className="text-sm font-bold text-slate-400">estrellas hoy</span>
        </div>
        <div className="animate-pop flex flex-col items-center gap-1 rounded-3xl bg-white/90 px-8 py-5 shadow-lg" style={{ animationDelay: '150ms' }}>
          <span className="text-5xl">🎯</span>
          <span className="text-4xl font-black text-sky-500">{summary.completedToday}</span>
          <span className="text-sm font-bold text-slate-400">juegos</span>
        </div>
      </div>

      {summary.newStickers.length > 0 && (
        <div className="animate-pop flex flex-col items-center gap-2 rounded-3xl bg-white/90 px-8 py-5 shadow-lg" style={{ animationDelay: '300ms' }}>
          <span className="text-lg font-black text-violet-500">¡Nuevos amigos!</span>
          <div className="flex gap-3 text-5xl">
            {summary.newStickers.map((s) => (
              <span key={s.id} className="animate-bounce-soft">{s.emoji}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <button
          onClick={onCollection}
          className="rounded-full bg-violet-500 px-8 py-4 text-xl font-black text-white shadow-lg transition active:scale-95"
        >
          🧸 Mi colección
        </button>
        <button
          onClick={onHome}
          className="rounded-full bg-white px-8 py-4 text-xl font-black text-slate-600 shadow-lg transition active:scale-95"
        >
          🏠 Salir
        </button>
      </div>
    </div>
  )
}
