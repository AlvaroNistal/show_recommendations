import { useState } from 'react'
import { PROFILES } from '../exercises/index.js'
import { getChild, resetChild, updateChild } from '../lib/storage.js'

function TierDots({ tier, max }) {
  return (
    <span className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-3 w-3 rounded-full ${i <= tier ? 'bg-violet-500' : 'bg-slate-200'}`} />
      ))}
    </span>
  )
}

function ChildCard({ profile }) {
  const [child, setChild] = useState(() => getChild(profile.id))
  const [confirmReset, setConfirmReset] = useState(false)

  const lastPlayed = child.lastPlayed
    ? new Date(child.lastPlayed).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
    : 'todavía no ha jugado'

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{profile.avatar}</span>
          <div>
            <div className="text-2xl font-black text-slate-700">{profile.name}</div>
            <div className="text-xs font-semibold text-slate-400">Última sesión: {lastPlayed}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-amber-500">⭐ {child.stars}</div>
          <div className="text-xs font-semibold text-slate-400">{child.completed} ejercicios</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {profile.templates.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2">
            <span className="text-sm font-bold text-slate-600">
              {t.icon} {t.name}
              <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black uppercase text-slate-500">
                {t.subject === 'math' ? 'Mates' : 'English'}
              </span>
            </span>
            <TierDots tier={child.mastery[t.id] ?? 0} max={t.tiers} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-500">
          <input
            type="checkbox"
            checked={child.audio}
            onChange={(e) => {
              const audio = e.target.checked
              updateChild(profile.id, (c) => ({ ...c, audio }))
              setChild((c) => ({ ...c, audio }))
            }}
            className="h-5 w-5 accent-violet-500"
          />
          Voz activada
        </label>
        {confirmReset ? (
          <span className="flex gap-2">
            <button
              onClick={() => {
                resetChild(profile.id)
                setChild(getChild(profile.id))
                setConfirmReset(false)
              }}
              className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white"
            >
              Sí, borrar
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600"
            >
              No
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="text-xs font-bold text-slate-400 underline"
          >
            Reiniciar progreso
          </button>
        )}
      </div>
    </div>
  )
}

export default function ParentArea({ onBack }) {
  return (
    <div className="flex min-h-dvh flex-col items-center gap-6 bg-slate-100 p-6">
      <h1 className="mt-4 text-2xl font-black text-slate-700">👨‍👩‍👧‍👦 Zona de padres</h1>
      <p className="max-w-md text-center text-sm text-slate-500">
        Progreso guardado en este dispositivo. Los puntos morados muestran el nivel alcanzado en cada juego.
      </p>
      {PROFILES.map((p) => (
        <ChildCard key={p.id} profile={p} />
      ))}
      <button
        onClick={onBack}
        className="rounded-full bg-white px-8 py-3 text-lg font-black text-slate-600 shadow transition active:scale-95"
      >
        ← Volver
      </button>
    </div>
  )
}
