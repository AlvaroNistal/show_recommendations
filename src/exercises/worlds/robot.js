import { sample } from '../../lib/random.js'

const ES = 'es-ES'

// Pre-defined solvable grid configurations.
// Coordinate system: (0,0) = top-left, x=col, y=row.
const GRACE_CONFIGS = [
  // Tier 0: 2-step straight paths on 3×3
  [
    { grid: 3, start: { x: 1, y: 2 }, goal: { x: 1, y: 0 }, obstacles: [] },
    { grid: 3, start: { x: 0, y: 1 }, goal: { x: 2, y: 1 }, obstacles: [] },
    { grid: 3, start: { x: 2, y: 1 }, goal: { x: 0, y: 1 }, obstacles: [] },
  ],
  // Tier 1: 3-step L-paths
  [
    { grid: 3, start: { x: 0, y: 2 }, goal: { x: 2, y: 1 }, obstacles: [] },
    { grid: 3, start: { x: 0, y: 2 }, goal: { x: 1, y: 0 }, obstacles: [] },
    { grid: 3, start: { x: 2, y: 2 }, goal: { x: 0, y: 1 }, obstacles: [] },
    { grid: 3, start: { x: 2, y: 2 }, goal: { x: 1, y: 0 }, obstacles: [] },
  ],
  // Tier 2: 4-step paths, possible single obstacle
  [
    { grid: 3, start: { x: 0, y: 2 }, goal: { x: 2, y: 0 }, obstacles: [] },
    { grid: 3, start: { x: 2, y: 2 }, goal: { x: 0, y: 0 }, obstacles: [] },
    { grid: 3, start: { x: 0, y: 2 }, goal: { x: 2, y: 1 }, obstacles: [{ x: 1, y: 2 }] },
    { grid: 3, start: { x: 2, y: 2 }, goal: { x: 0, y: 1 }, obstacles: [{ x: 1, y: 2 }] },
  ],
]

const LEO_CONFIGS = [
  // Tier 0: 3-step straight paths on 4×4
  [
    { grid: 4, start: { x: 0, y: 3 }, goal: { x: 3, y: 3 }, obstacles: [] },
    { grid: 4, start: { x: 1, y: 3 }, goal: { x: 1, y: 0 }, obstacles: [] },
    { grid: 4, start: { x: 3, y: 3 }, goal: { x: 0, y: 3 }, obstacles: [] },
    { grid: 4, start: { x: 2, y: 3 }, goal: { x: 2, y: 0 }, obstacles: [] },
  ],
  // Tier 1: 4-step L-paths
  [
    { grid: 4, start: { x: 0, y: 3 }, goal: { x: 2, y: 1 }, obstacles: [] },
    { grid: 4, start: { x: 0, y: 3 }, goal: { x: 3, y: 2 }, obstacles: [] },
    { grid: 4, start: { x: 3, y: 3 }, goal: { x: 1, y: 1 }, obstacles: [] },
    { grid: 4, start: { x: 0, y: 3 }, goal: { x: 3, y: 1 }, obstacles: [] },
  ],
  // Tier 2: 4–5 steps, 1 obstacle
  [
    { grid: 4, start: { x: 0, y: 3 }, goal: { x: 3, y: 2 }, obstacles: [{ x: 2, y: 3 }] },
    { grid: 4, start: { x: 0, y: 3 }, goal: { x: 2, y: 0 }, obstacles: [{ x: 1, y: 3 }] },
    { grid: 4, start: { x: 0, y: 3 }, goal: { x: 3, y: 1 }, obstacles: [{ x: 0, y: 2 }] },
  ],
  // Tier 3: 5–6 steps, 2 obstacles
  [
    { grid: 4, start: { x: 0, y: 3 }, goal: { x: 3, y: 0 }, obstacles: [{ x: 1, y: 3 }, { x: 2, y: 2 }] },
    { grid: 4, start: { x: 0, y: 3 }, goal: { x: 3, y: 1 }, obstacles: [{ x: 2, y: 3 }, { x: 1, y: 1 }] },
    { grid: 4, start: { x: 0, y: 3 }, goal: { x: 2, y: 0 }, obstacles: [{ x: 1, y: 3 }, { x: 0, y: 1 }] },
  ],
]

export const graceRobot = {
  id: 'grace-robot',
  subject: 'math',
  lang: ES,
  icon: '🤖',
  name: 'El Robot',
  worldType: 'robot',
  tiers: 3,
  generate(tier) {
    const config = sample(GRACE_CONFIGS[tier])
    return {
      worldType: 'robot',
      prompt: {
        text: '¡Guía al robot a la estrella!',
        speech: '¡Ayuda al robot a llegar a la estrella! Usa las flechas.',
        lang: ES,
      },
      display: [],
      choices: [],
      answerId: '__world__',
      hint: { speech: '¡Inténtalo otra vez! Usa las flechas para mover al robot.', lang: ES },
      worldConfig: config,
    }
  },
}

export const leoRobot = {
  id: 'leo-robot',
  subject: 'math',
  lang: ES,
  icon: '🤖',
  name: 'El Robot',
  worldType: 'robot',
  tiers: 4,
  generate(tier) {
    const config = sample(LEO_CONFIGS[tier])
    return {
      worldType: 'robot',
      prompt: {
        text: '¡Guía al robot a la estrella!',
        speech: '¡Guía al robot hasta la estrella! Cuidado con los obstáculos.',
        lang: ES,
      },
      display: [],
      choices: [],
      answerId: '__world__',
      hint: { speech: '¡Inténtalo otra vez!', lang: ES },
      worldConfig: config,
    }
  },
}

export const ROBOT_WORLDS = [graceRobot, leoRobot]
