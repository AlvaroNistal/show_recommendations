import { speak } from '../lib/tts.js'

function DisplayItem({ item }) {
  switch (item.type) {
    case 'emojis':
      return (
        <div className="flex max-w-md flex-wrap items-center justify-center gap-2 text-5xl">
          {item.value.map((e, i) => (
            <span key={i} className="animate-pop" style={{ animationDelay: `${i * 70}ms` }}>
              {e}
            </span>
          ))}
        </div>
      )
    case 'text':
      return <div className="text-6xl font-black tracking-wide text-slate-700">{item.value}</div>
    case 'emoji':
      return <div className="animate-pop text-8xl">{item.value}</div>
    case 'sequence':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {item.items.map((it, i) => (
            <span
              key={i}
              className={`animate-pop flex h-20 min-w-20 items-center justify-center rounded-2xl px-3 text-4xl font-black ${
                it === '❓' ? 'bg-amber-200 text-amber-600' : 'bg-white text-slate-700 shadow'
              }`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              {it}
            </span>
          ))}
        </div>
      )
    default:
      return null
  }
}

function ChoiceContent({ choice }) {
  switch (choice.type) {
    case 'text':
      return <span className="text-5xl font-black text-slate-700">{choice.value}</span>
    case 'emoji':
      return <span className="text-6xl">{choice.value}</span>
    case 'color':
      return (
        <span
          className="block h-20 w-20 rounded-full border-4 border-slate-200"
          style={{ background: choice.value }}
        />
      )
    case 'emojiGroup':
      return (
        <span className="flex max-w-40 flex-wrap items-center justify-center gap-1 text-3xl leading-snug">
          {choice.value.map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </span>
      )
    default:
      return null
  }
}

export default function Exercise({ exercise, audioOn, onAnswer, wrongIds, locked }) {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => audioOn && speak(exercise.prompt.speech, exercise.prompt.lang)}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-500 text-2xl text-white shadow-lg transition active:scale-90"
          aria-label="Escuchar otra vez"
        >
          🔊
        </button>
        <h2 className="text-center text-3xl font-black text-slate-700">{exercise.prompt.text}</h2>
      </div>

      {exercise.display.map((item, i) => (
        <DisplayItem key={i} item={item} />
      ))}

      <div className="flex flex-wrap items-center justify-center gap-5">
        {exercise.choices.map((choice) => {
          const isWrong = wrongIds.includes(choice.id)
          return (
            <button
              key={choice.id}
              disabled={locked || isWrong}
              onClick={() => onAnswer(choice.id)}
              className={`flex min-h-24 min-w-24 items-center justify-center rounded-3xl border-b-8 bg-white p-4 shadow-lg transition active:translate-y-1 active:border-b-4 ${
                isWrong ? 'animate-wiggle border-slate-200 opacity-30' : 'border-violet-200 hover:bg-violet-50'
              }`}
            >
              <ChoiceContent choice={choice} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
