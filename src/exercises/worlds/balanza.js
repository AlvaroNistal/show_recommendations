import { sample } from '../../lib/random.js'
import { COUNTABLES } from '../../content/vocabulary.js'

const ES = 'es-ES'

// Grace: all weights equal (each item = 1 unit). Tap to add items until both sides match.
export const graceBalanza = {
  id: 'grace-balanza',
  subject: 'math',
  lang: ES,
  icon: '⚖️',
  name: 'La Balanza',
  worldType: 'balanza',
  tiers: 3,
  generate(tier) {
    const target = [2, 3, 4][tier]
    const emoji = sample(COUNTABLES)
    return {
      worldType: 'balanza',
      prompt: {
        text: '¡Pon lo mismo en los dos lados!',
        speech: '¡Equilibra la balanza! Pon lo mismo en los dos lados.',
        lang: ES,
      },
      display: [],
      choices: [],
      answerId: '__world__',
      hint: { speech: 'Inténtalo otra vez.', lang: ES },
      worldConfig: {
        rightItems: Array(target).fill({ emoji, value: 1 }),
        palette: [{ emoji, value: 1 }],
        targetTotal: target,
        maxLeft: target + 2,
      },
    }
  },
}

// Leo: three weight classes — 🐘=3, 🐕=2, 🐭=1. Compose the target total.
export const leoBalanza = {
  id: 'leo-balanza',
  subject: 'math',
  lang: ES,
  icon: '⚖️',
  name: 'La Balanza',
  worldType: 'balanza',
  tiers: 4,
  generate(tier) {
    const WEIGHTS = [
      { emoji: '🐭', value: 1 },
      { emoji: '🐕', value: 2 },
      { emoji: '🐘', value: 3 },
    ]

    // Right-side configurations per tier (target total + what's shown on right)
    const rightConfigs = [
      [{ emoji: '🐘', value: 3 }],                                   // total 3
      [{ emoji: '🐘', value: 3 }, { emoji: '🐭', value: 1 }],        // total 4
      [{ emoji: '🐘', value: 3 }, { emoji: '🐕', value: 2 }],        // total 5
      [{ emoji: '🐘', value: 3 }, { emoji: '🐘', value: 3 }],        // total 6
    ]
    const rightItems = rightConfigs[tier]
    const targetTotal = rightItems.reduce((s, w) => s + w.value, 0)

    return {
      worldType: 'balanza',
      prompt: {
        text: '¡Equilibra la balanza!',
        speech: '¡Equilibra la balanza poniendo pesas en el lado izquierdo!',
        lang: ES,
      },
      display: [],
      choices: [],
      answerId: '__world__',
      hint: { speech: 'Inténtalo otra vez.', lang: ES },
      worldConfig: {
        rightItems,
        palette: WEIGHTS,
        targetTotal,
        maxLeft: 5,
      },
    }
  },
}

export const BALANZA_WORLDS = [graceBalanza, leoBalanza]
