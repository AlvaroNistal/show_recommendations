import { useEffect, useRef, useState } from 'react'
import Exercise from './Exercise.jsx'
import MicroWorld from './MicroWorld.jsx'
import SurpriseEvent from './SurpriseEvent.jsx'
import { CelebrationOverlay } from './Celebration.jsx'
import { speak, stopSpeaking } from '../lib/tts.js'
import { getChild, updateChild } from '../lib/storage.js'
import { sample, shuffle } from '../lib/random.js'
import { PRAISE_ES, PRAISE_EN, SURPRISE_EVENTS, STICKERS } from '../content/vocabulary.js'

const CELEBRATION_MS = 1600
const STICKER_MS = 2600
const MISSION_TARGET = 5 // fuel cells per mission

// Shuffle template IDs ensuring the first ID differs from the last of the previous batch.
function shuffleNoRepeat(ids, lastId) {
  let result = shuffle(ids)
  let tries = 0
  while (result[0] === lastId && tries++ < 30) result = shuffle(ids)
  return result
}

// What to say aloud when tapping a choice (also used in prediction phase).
function choiceLabel(choice) {
  switch (choice.type) {
    case 'text':       return choice.value
    case 'emoji':      return choice.id
    case 'color':      return choice.id
    case 'emojiGroup': return String(choice.value.length)
    default:           return null
  }
}

export default function Session({ profile, onDone }) {
  const { templates } = profile

  // Warm-up effect (PRD 4.3): start one tier below last mastery, floor 0.
  const [tierState, setTierState] = useState(() => {
    const child = getChild(profile.id)
    const state = {}
    for (const t of templates) {
      const mastered = child.mastery[t.id] ?? 0
      state[t.id] = {
        tier: Math.min(Math.max(0, mastered - 1), t.tiers - 1),
        correctStreak: 0,
        wrongStreak: 0,
      }
    }
    return state
  })

  const [audioOn, setAudioOn] = useState(() => getChild(profile.id).audio)
  const [order, setOrder] = useState(() => shuffleNoRepeat(templates.map((t) => t.id), null))
  const [orderIndex, setOrderIndex] = useState(0)
  const [exercise, setExercise] = useState(() => {
    const t = templates.find((tp) => tp.id === order[0]) ?? templates[0]
    return { template: t, ...t.generate(0) }
  })

  // Prediction phase (for exercises with .prediction data)
  const [predPhase, setPredPhase] = useState(false)

  const [wrongIds, setWrongIds] = useState([])
  const [attemptWrong, setAttemptWrong] = useState(false)
  const [celebration, setCelebration] = useState(null) // {text, emoji, subtext}
  const [starsToday, setStarsToday] = useState(0)
  const [completedToday, setCompletedToday] = useState(0)
  const [newStickers, setNewStickers] = useState([])
  const [missionDone, setMissionDone] = useState(false)
  const [surpriseEvent, setSurpriseEvent] = useState(null)
  const timerRef = useRef(null)

  // Regenerate first exercise at warmed-up tier and check for prediction.
  useEffect(() => {
    const t = templates.find((tp) => tp.id === order[0]) ?? templates[0]
    const generated = t.generate(tierState[t.id].tier)
    setExercise({ template: t, ...generated })
    setPredPhase(!!generated.prediction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Speak each new prompt automatically (audio-first for pre-readers).
  useEffect(() => {
    if (!audioOn || !exercise) return
    const promptSpeech = predPhase && exercise.prediction
      ? exercise.prediction.prompt.speech
      : exercise.prompt.speech
    const lang = exercise.prompt.lang
    const id = setTimeout(() => speak(promptSpeech, lang), 350)
    return () => clearTimeout(id)
  }, [exercise, predPhase, audioOn])

  useEffect(() => () => {
    stopSpeaking()
    clearTimeout(timerRef.current)
  }, [])

  const isEnglish = exercise.template.subject === 'english'

  function nextExercise(updatedTiers) {
    const lastId = order[orderIndex]
    const nextIndex = orderIndex + 1
    let nextOrder = order
    let idx = nextIndex
    if (nextIndex >= order.length) {
      nextOrder = shuffleNoRepeat(templates.map((t) => t.id), lastId)
      idx = 0
      setOrder(nextOrder)
    }
    setOrderIndex(idx)
    const t = templates.find((tp) => tp.id === nextOrder[idx])
    const generated = t.generate(updatedTiers[t.id].tier)
    setExercise({ template: t, ...generated })
    setPredPhase(!!generated.prediction)
    setWrongIds([])
    setAttemptWrong(false)
    setCelebration(null)
  }

  function handlePrediction(choice) {
    if (audioOn) {
      const label = choiceLabel(choice)
      if (label) speak(label, exercise.prompt.lang)
    }
    setTimeout(() => {
      if (audioOn) speak('¡Ahora cuéntalos!', 'es-ES')
      setPredPhase(false)
    }, 400)
  }

  // Shared post-correct logic for both regular answers and world completions.
  function handleCorrect(updatedTiers) {
    let unlocked = []
    const child = updateChild(profile.id, (c) => {
      const stars = c.stars + 1
      unlocked = STICKERS.filter((st) => stars >= st.cost && !c.stickers.includes(st.id))
      const mastery = { ...c.mastery }
      for (const tpl of templates) {
        mastery[tpl.id] = Math.max(mastery[tpl.id] ?? 0, updatedTiers[tpl.id].tier)
      }
      return {
        ...c,
        stars,
        completed: c.completed + 1,
        mastery,
        stickers: [...c.stickers, ...unlocked.map((u) => u.id)],
        lastPlayed: new Date().toISOString(),
        audio: audioOn,
      }
    })
    void child

    const newTotal = starsToday + 1
    setStarsToday(newTotal)
    setCompletedToday((n) => n + 1)
    if (unlocked.length > 0) setNewStickers((prev) => [...prev, ...unlocked])

    // Mission complete check
    if (newTotal === MISSION_TARGET && !missionDone) {
      setMissionDone(true)
    }

    // Surprise event (10% chance, not on sticker or mission complete)
    if (!missionDone && unlocked.length === 0 && Math.random() < 0.1) {
      const evt = sample(SURPRISE_EVENTS)
      setSurpriseEvent(evt)
      setTimeout(() => setSurpriseEvent(null), 2000)
    }

    const praise = sample(isEnglish ? PRAISE_EN : PRAISE_ES)
    if (unlocked.length > 0) {
      const st = unlocked[0]
      setCelebration({ text: '¡Nuevo amigo!', emoji: st.emoji, subtext: st.name })
      if (audioOn) speak(`${sample(PRAISE_ES)} ¡Has ganado un nuevo amigo: ${st.name}!`, 'es-ES')
      timerRef.current = setTimeout(() => nextExercise(updatedTiers), STICKER_MS)
    } else {
      setCelebration({ text: praise, emoji: sample(['🎉', '🌟', '🥳', '💫', '🎈']) })
      if (audioOn) speak(praise, exercise.prompt.lang)
      timerRef.current = setTimeout(() => nextExercise(updatedTiers), CELEBRATION_MS)
    }
  }

  function handleAnswer(choiceId) {
    if (celebration) return
    const t = exercise.template

    if (choiceId !== exercise.answerId) {
      setWrongIds((w) => [...w, choiceId])
      if (audioOn) {
        speak(exercise.hint?.speech ?? exercise.prompt.speech, exercise.prompt.lang)
      }
      if (!attemptWrong) {
        setAttemptWrong(true)
        setTierState((prev) => {
          const s = prev[t.id]
          const wrongStreak = s.wrongStreak + 1
          const droppedTier = wrongStreak >= 2 ? Math.max(0, s.tier - 1) : s.tier
          return {
            ...prev,
            [t.id]: {
              tier: droppedTier,
              correctStreak: 0,
              wrongStreak: wrongStreak >= 2 ? 0 : wrongStreak,
            },
          }
        })
      }
      return
    }

    // Correct!
    const cleanSolve = !attemptWrong
    const updatedTiers = { ...tierState }
    const s = tierState[t.id]
    if (cleanSolve) {
      const correctStreak = s.correctStreak + 1
      const leveledUp = correctStreak >= 3
      updatedTiers[t.id] = {
        tier: leveledUp ? Math.min(t.tiers - 1, s.tier + 1) : s.tier,
        correctStreak: leveledUp ? 0 : correctStreak,
        wrongStreak: 0,
      }
    }
    setTierState(updatedTiers)
    handleCorrect(updatedTiers)
  }

  // World exercises always count as clean solves (no wrong-answer state in worlds).
  function handleWorldComplete() {
    if (celebration) return
    const t = exercise.template
    const updatedTiers = { ...tierState }
    const s = tierState[t.id]
    const correctStreak = s.correctStreak + 1
    const leveledUp = correctStreak >= 3
    updatedTiers[t.id] = {
      tier: leveledUp ? Math.min(t.tiers - 1, s.tier + 1) : s.tier,
      correctStreak: leveledUp ? 0 : correctStreak,
      wrongStreak: 0,
    }
    setTierState(updatedTiers)
    handleCorrect(updatedTiers)
  }

  function finishSession() {
    stopSpeaking()
    clearTimeout(timerRef.current)
    onDone({ starsToday, completedToday, newStickers })
  }

  function toggleAudio() {
    const next = !audioOn
    setAudioOn(next)
    if (!next) stopSpeaking()
    updateChild(profile.id, (c) => ({ ...c, audio: next }))
  }

  // Prediction phase rendering
  if (predPhase && exercise.prediction) {
    const pred = exercise.prediction
    return (
      <div className={`flex min-h-dvh flex-col bg-gradient-to-b ${profile.theme.bg}`}>
        <MissionHeader starsToday={starsToday} profile={profile} onAudio={toggleAudio} audioOn={audioOn} onDone={finishSession} />
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => audioOn && speak(pred.prompt.speech, exercise.prompt.lang)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-500 text-2xl text-white shadow-lg transition active:scale-90"
            >
              🔊
            </button>
            <h2 className="text-center text-3xl font-black text-slate-700">{pred.prompt.text}</h2>
          </div>
          {pred.display.map((item, i) => (
            <PredDisplayItem key={i} item={item} />
          ))}
          <div className="flex flex-wrap items-center justify-center gap-5">
            {pred.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handlePrediction(choice)}
                className="flex min-h-24 min-w-24 items-center justify-center rounded-3xl border-b-8 border-amber-200 bg-white p-4 shadow-lg transition active:translate-y-1 active:border-b-4 hover:bg-amber-50"
              >
                <PredChoiceContent choice={choice} />
              </button>
            ))}
          </div>
        </div>
        <footer className="p-4 text-center text-sm font-semibold text-slate-400">
          {exercise.template.icon} {exercise.template.name} · ¿Cuál crees tú?
        </footer>
      </div>
    )
  }

  return (
    <div className={`flex min-h-dvh flex-col bg-gradient-to-b ${profile.theme.bg}`}>
      <MissionHeader starsToday={starsToday} profile={profile} onAudio={toggleAudio} audioOn={audioOn} onDone={finishSession} />

      {exercise.worldType ? (
        <MicroWorld
          exercise={exercise}
          audioOn={audioOn}
          onComplete={handleWorldComplete}
        />
      ) : (
        <Exercise
          exercise={exercise}
          audioOn={audioOn}
          onAnswer={handleAnswer}
          wrongIds={wrongIds}
          locked={celebration !== null}
        />
      )}

      {/* World prompt header */}
      {exercise.worldType && (
        <div className="px-4 py-2 text-center">
          <h2 className="text-2xl font-black text-slate-700">{exercise.prompt.text}</h2>
        </div>
      )}

      <footer className="p-4 text-center text-sm font-semibold text-slate-400">
        {exercise.template.icon} {exercise.template.name}
      </footer>

      {celebration && (
        <CelebrationOverlay text={celebration.text} emoji={celebration.emoji} subtext={celebration.subtext} />
      )}

      {missionDone && !celebration && (
        <MissionComplete onDone={finishSession} />
      )}

      <SurpriseEvent event={surpriseEvent} />
    </div>
  )
}

// ── Mission header ────────────────────────────────────────────────────────────

function MissionHeader({ starsToday, profile, onAudio, audioOn, onDone }) {
  return (
    <header className="flex items-center justify-between p-4">
      {/* Rocket mission progress */}
      <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow">
        <span className="text-xl">🚀</span>
        <div className="flex gap-1">
          {Array.from({ length: MISSION_TARGET }, (_, i) => (
            <span
              key={i}
              className={`text-lg transition-transform ${i < starsToday ? 'animate-fuel-fill' : 'opacity-25'}`}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAudio}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-xl shadow transition active:scale-90"
          aria-label={audioOn ? 'Silenciar' : 'Activar sonido'}
        >
          {audioOn ? '🔊' : '🔇'}
        </button>
        <button
          onClick={onDone}
          className="rounded-full bg-white/80 px-5 py-3 text-lg font-bold text-slate-600 shadow transition active:scale-95"
        >
          ✅ He terminado
        </button>
      </div>
    </header>
  )
}

// ── Mission complete overlay ──────────────────────────────────────────────────

function MissionComplete({ onDone }) {
  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="animate-mission-drop flex flex-col items-center gap-4 rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-7xl">🚀</div>
        <h2 className="text-3xl font-black text-slate-700">¡Misión completa!</h2>
        <p className="text-center text-slate-500">
          ¡Has conseguido {MISSION_TARGET} células de combustible!
        </p>
        <div className="flex gap-1 text-3xl">
          {Array.from({ length: MISSION_TARGET }, (_, i) => (
            <span key={i} className="animate-bounce-soft" style={{ animationDelay: `${i * 0.1}s` }}>
              ⭐
            </span>
          ))}
        </div>
        <button
          onClick={onDone}
          className="mt-2 rounded-full bg-violet-500 px-8 py-4 text-xl font-black text-white shadow-lg transition active:scale-95"
        >
          ¡Terminar!
        </button>
      </div>
    </div>
  )
}

// ── Helpers for prediction phase (same logic as Exercise.jsx) ─────────────────

function PredDisplayItem({ item }) {
  if (item.type === 'emojis') {
    return (
      <div className="flex max-w-md flex-wrap items-center justify-center gap-2 text-5xl">
        {item.value.map((e, i) => (
          <span key={i} className="animate-pop" style={{ animationDelay: `${i * 70}ms` }}>
            {e}
          </span>
        ))}
      </div>
    )
  }
  return null
}

function PredChoiceContent({ choice }) {
  if (choice.type === 'text') return <span className="text-5xl font-black text-slate-700">{choice.value}</span>
  if (choice.type === 'emoji') return <span className="text-6xl">{choice.value}</span>
  return null
}
