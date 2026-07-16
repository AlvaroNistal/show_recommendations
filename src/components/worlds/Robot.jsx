import { useEffect, useRef, useState } from 'react'
import { speak } from '../../lib/tts.js'

const DIRS = {
  up:    { label: '⬆️', dx: 0,  dy: -1 },
  down:  { label: '⬇️', dx: 0,  dy: 1  },
  left:  { label: '⬅️', dx: -1, dy: 0  },
  right: { label: '➡️', dx: 1,  dy: 0  },
}

function cellKey(x, y) { return `${x},${y}` }

export default function Robot({ config, audioOn, onComplete }) {
  const { grid, start, goal, obstacles } = config
  const obstacleSet = new Set(obstacles.map((o) => cellKey(o.x, o.y)))

  const [pos, setPos] = useState(start)
  const [done, setDone] = useState(false)
  const [hopKey, setHopKey] = useState(0)
  const [wallBounce, setWallBounce] = useState(false)
  const wallRef = useRef(null)

  useEffect(() => {
    if (pos.x === goal.x && pos.y === goal.y && !done) {
      setDone(true)
      if (audioOn) speak('¡Has llegado! ¡Muy bien!', 'es-ES')
      setTimeout(() => onComplete(), 1200)
    }
  }, [pos, goal, done, audioOn, onComplete])

  function move(dir) {
    if (done) return
    const { dx, dy } = DIRS[dir]
    const nx = pos.x + dx
    const ny = pos.y + dy
    if (nx < 0 || nx >= grid || ny < 0 || ny >= grid || obstacleSet.has(cellKey(nx, ny))) {
      // Bounce off wall
      setWallBounce(false)
      requestAnimationFrame(() => setWallBounce(true))
      clearTimeout(wallRef.current)
      wallRef.current = setTimeout(() => setWallBounce(false), 400)
      return
    }
    setPos({ x: nx, y: ny })
    setHopKey((k) => k + 1)
  }

  const cellSize = grid === 3 ? 'h-20 w-20' : 'h-16 w-16'
  const cellText = grid === 3 ? 'text-4xl' : 'text-3xl'

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4">
      {/* Grid */}
      <div
        className="rounded-2xl border-4 border-slate-300 bg-slate-100 p-2 shadow-inner"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${grid}, 1fr)`, gap: '0.25rem' }}
      >
        {Array.from({ length: grid }, (_, row) =>
          Array.from({ length: grid }, (_, col) => {
            const isRobot = pos.x === col && pos.y === row
            const isGoal = goal.x === col && goal.y === row
            const isObs = obstacleSet.has(cellKey(col, row))
            return (
              <div
                key={cellKey(col, row)}
                className={`flex items-center justify-center rounded-xl ${cellSize} ${cellText} ${
                  isObs ? 'bg-slate-400' : 'bg-white shadow'
                }`}
              >
                {isObs ? '🧱' : isRobot ? (
                  <span
                    key={hopKey}
                    className={wallBounce ? 'animate-wall-bounce' : 'animate-robot-hop'}
                  >
                    🤖
                  </span>
                ) : isGoal ? (
                  <span className="animate-bounce-soft">⭐</span>
                ) : null}
              </div>
            )
          })
        )}
      </div>

      {/* Directional controls */}
      <div className="grid grid-cols-3 gap-2">
        <div />
        <button
          onClick={() => move('up')}
          className="flex h-16 w-16 items-center justify-center rounded-2xl border-b-6 border-violet-300 bg-white text-3xl shadow-lg transition active:translate-y-1 active:border-b-2"
        >
          ⬆️
        </button>
        <div />
        <button
          onClick={() => move('left')}
          className="flex h-16 w-16 items-center justify-center rounded-2xl border-b-6 border-violet-300 bg-white text-3xl shadow-lg transition active:translate-y-1 active:border-b-2"
        >
          ⬅️
        </button>
        <div />
        <button
          onClick={() => move('right')}
          className="flex h-16 w-16 items-center justify-center rounded-2xl border-b-6 border-violet-300 bg-white text-3xl shadow-lg transition active:translate-y-1 active:border-b-2"
        >
          ➡️
        </button>
        <div />
        <button
          onClick={() => move('down')}
          className="flex h-16 w-16 items-center justify-center rounded-2xl border-b-6 border-violet-300 bg-white text-3xl shadow-lg transition active:translate-y-1 active:border-b-2"
        >
          ⬇️
        </button>
        <div />
      </div>
    </div>
  )
}
