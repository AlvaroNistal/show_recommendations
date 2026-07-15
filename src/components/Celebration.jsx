const CONFETTI_COLORS = ['#f472b6', '#facc15', '#4ade80', '#60a5fa', '#c084fc', '#fb923c']

export function Confetti({ count = 28 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const left = Math.random() * 100
        const duration = 1.6 + Math.random() * 1.4
        const delay = Math.random() * 0.4
        const size = 8 + Math.random() * 10
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 0.6,
              background: color,
              borderRadius: 2,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        )
      })}
    </>
  )
}

export function CelebrationOverlay({ text, emoji, subtext }) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
      <Confetti />
      <div className="animate-star-fly text-8xl">{emoji}</div>
      <div className="animate-pop mt-4 text-4xl font-black text-violet-600 drop-shadow-sm">{text}</div>
      {subtext && <div className="animate-pop mt-2 text-2xl font-bold text-violet-400">{subtext}</div>}
    </div>
  )
}
