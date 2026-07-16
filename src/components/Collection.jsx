import { STICKERS } from '../content/vocabulary.js'
import { getChild } from '../lib/storage.js'

export default function Collection({ profile, onBack }) {
  const child = getChild(profile.id)
  const next = STICKERS.find((s) => !child.stickers.includes(s.id))

  return (
    <div className={`flex min-h-dvh flex-col items-center gap-6 bg-gradient-to-b ${profile.theme.bg} p-6`}>
      <h1 className="mt-4 text-3xl font-black text-violet-600">🧸 Los amigos de {profile.name}</h1>
      <div className="flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 shadow">
        <span className="text-xl font-black text-amber-500">⭐ {child.stars}</span>
        {next && (
          <span className="text-sm font-bold text-slate-400">
            · el siguiente amigo llega con {next.cost} ⭐
          </span>
        )}
      </div>

      <div className="grid max-w-lg grid-cols-3 gap-4 sm:grid-cols-4">
        {STICKERS.map((s, i) => {
          const owned = child.stickers.includes(s.id)
          return (
            <div
              key={s.id}
              className={`animate-pop flex h-28 flex-col items-center justify-center gap-1 rounded-3xl shadow ${
                owned ? 'bg-white' : 'bg-white/40'
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className={`text-4xl ${owned ? '' : 'opacity-30 grayscale'}`}>{owned ? s.emoji : '❔'}</span>
              <span className={`text-xs font-bold ${owned ? 'text-slate-600' : 'text-slate-400'}`}>
                {owned ? s.name : `${s.cost} ⭐`}
              </span>
            </div>
          )
        })}
      </div>

      <button
        onClick={onBack}
        className="mt-2 rounded-full bg-white px-8 py-4 text-xl font-black text-slate-600 shadow-lg transition active:scale-95"
      >
        🏠 Volver
      </button>
    </div>
  )
}
