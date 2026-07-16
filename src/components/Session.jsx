import { useEffect, useRef, useState } from 'react'
import Exercise from './Exercise.jsx'
import { CelebrationOverlay } from './Celebration.jsx'
import { speak, stopSpeaking } from '../lib/tts.js'
import { getChild, updateChild } from '../lib/storage.js'
import { sample, shuffle } from '../lib/random.js'
import { PRAISE_ES, PRAISE_EN, ENCOURAGE_ES, ENCOURAGE_EN, STICKERS } from '../content/vocabulary.js'

const CELEBRATION_MS = 1600
const STICKER_MS = 2600

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
  const [order, setOrder] = useState(() => shuffle(templates.map((t) => t.id)))
  const [orderIndex, setOrderIndex] = useState(0)
  const [exercise, setExercise] = useState(() => {
    const t = templates.find((tp) => tp.id === order[0]) ?? templates[0]
    return { template: t, ...t.generate(0) }
  })
  const [wrongIds, setWrongIds] = useState([])
  const [attemptWrong, setAttemptWrong] = useState(false)
  const [celebration, setCelebration] = useState(null) // {text, emoji, subtext}
  const [starsToday, setStarsToday] = useState(0)
  const [completedToday, setCompletedToday] = useState(0)
  const [newStickers, setNewStickers] = useState([])
  const timerRef = useRef(null)

  // Regenerate the first exercise at its warmed-up tier once on mount.
  useEffect(() => {
    const t = templates.find((tp) => tp.id === order[0]) ?? templates[0]
    setExercise({ template: t, ...t.generate(tierState[t.id].tier) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Speak each new prompt automatically (audio-first for pre-readers).
  useEffect(() => {
    if (!audioOn || !exercise) return
    const id = setTimeout(() => speak(exercise.prompt.speech, exercise.prompt.lang), 350)
    return () => clearTimeout(id)
  }, [exercise, audioOn])

  useEffect(() => () => {
    stopSpeaking()
    clearTimeout(timerRef.current)
  }, [])

  const isEnglish = exercise.template.subject === 'english'

  function nextExercise(updatedTiers) {
    const nextIndex = orderIndex + 1
    let nextOrder = order
    let idx = nextIndex
    if (nextIndex >= order.length) {
      nextOrder = shuffle(templates.map((t) => t.id))
      idx = 0
      setOrder(nextOrder)
    }
    setOrderIndex(idx)
    const t = templates.find((tp) => tp.id === nextOrder[idx])
    setExercise({ template: t, ...t.generate(updatedTiers[t.id].tier) })
    setWrongIds([])
    setAttemptWrong(false)
    setCelebration(null)
  }

  function handleAnswer(choiceId) {
    if (celebration) return
    const t = exercise.template

    if (choiceId !== exercise.answerId) {
      // Gentle hint + retry, never a fail state (PRD 4.4).
      setWrongIds((w) => [...w, choiceId])
      if (audioOn) {
        speak(exercise.hint?.speech ?? exercise.prompt.speech, exercise.prompt.lang)
      }
      if (!attemptWrong) {
        // Only the first miss of an exercise counts toward adaptivity.
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

    // Correct — star earned regardless of tier or retries (PRD 4.4).
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

    setStarsToday((n) => n + 1)
    setCompletedToday((n) => n + 1)
    if (unlocked.length > 0) setNewStickers((prev) => [...prev, ...unlocked])

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

  return (
    <div className={`flex min-h-dvh flex-col bg-gradient-to-b ${profile.theme.bg}`}>
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow">
          <span className="text-2xl">{profile.avatar}</span>
          <span className="text-xl font-black text-amber-500">⭐ {starsToday}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-xl shadow transition active:scale-90"
            aria-label={audioOn ? 'Silenciar' : 'Activar sonido'}
          >
            {audioOn ? '🔊' : '🔇'}
          </button>
          <button
            onClick={finishSession}
            className="rounded-full bg-white/80 px-5 py-3 text-lg font-bold text-slate-600 shadow transition active:scale-95"
          >
            ✅ He terminado
          </button>
        </div>
      </header>

      <Exercise
        exercise={exercise}
        audioOn={audioOn}
        onAnswer={handleAnswer}
        wrongIds={wrongIds}
        locked={celebration !== null}
      />

      <footer className="p-4 text-center text-sm font-semibold text-slate-400">
        {exercise.template.icon} {exercise.template.name}
      </footer>

      {celebration && (
        <CelebrationOverlay text={celebration.text} emoji={celebration.emoji} subtext={celebration.subtext} />
      )}
    </div>
  )
}
