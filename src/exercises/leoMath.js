// Leo (6) — counting to 100, addition/subtraction to 20, comparison, sequences.
import { randInt, sample, shuffle, numberChoices } from '../lib/random.js'
import { COUNTABLES } from '../content/vocabulary.js'

const ES = 'es-ES'

export const leoAdd = {
  id: 'leo-add',
  subject: 'math',
  lang: ES,
  icon: '➕',
  name: 'Sumas',
  tiers: 4,
  generate(tier) {
    const maxSum = [5, 10, 15, 20][tier]
    const a = randInt(1, maxSum - 1)
    const b = randInt(1, maxSum - a)
    const answer = a + b
    const display = [{ type: 'text', value: `${a} + ${b} = ?` }]
    if (tier === 0) {
      // Concrete support at the lowest tier: show the quantities.
      const emoji = sample(COUNTABLES)
      display.push({ type: 'emojis', value: [...Array(a).fill(emoji), '➕', ...Array(b).fill(emoji)] })
    }
    return {
      prompt: { text: '¿Cuánto es?', speech: `¿Cuánto es ${a} más ${b}?`, lang: ES },
      display,
      choices: numberChoices(answer, 3, 0, maxSum + 3).map((v) => ({ id: String(v), type: 'text', value: String(v) })),
      answerId: String(answer),
      hint: { speech: `¡Casi! Empieza en ${a} y cuenta ${b} más con los dedos.`, lang: ES },
    }
  },
}

export const leoSubtract = {
  id: 'leo-subtract',
  subject: 'math',
  lang: ES,
  icon: '➖',
  name: 'Restas',
  tiers: 4,
  generate(tier) {
    const max = [5, 10, 15, 20][tier]
    const a = randInt(2, max)
    const b = randInt(1, a)
    const answer = a - b
    return {
      prompt: { text: '¿Cuánto es?', speech: `¿Cuánto es ${a} menos ${b}?`, lang: ES },
      display: [{ type: 'text', value: `${a} − ${b} = ?` }],
      choices: numberChoices(answer, 3, 0, max).map((v) => ({ id: String(v), type: 'text', value: String(v) })),
      answerId: String(answer),
      hint: { speech: `¡Casi! Empieza en ${a} y cuenta ${b} hacia atrás.`, lang: ES },
    }
  },
}

export const leoCompare = {
  id: 'leo-compare',
  subject: 'math',
  lang: ES,
  icon: '🔍',
  name: 'Mayor o menor',
  tiers: 4,
  generate(tier) {
    const max = [10, 20, 50, 100][tier]
    const a = randInt(1, max)
    let b = randInt(1, max)
    while (b === a) b = randInt(1, max)
    const wantBigger = tier < 2 ? true : Math.random() < 0.5
    const answer = wantBigger ? Math.max(a, b) : Math.min(a, b)
    const label = wantBigger ? 'mayor' : 'menor'
    return {
      prompt: { text: `¿Qué número es ${label}?`, speech: `¿Qué número es ${label}?`, lang: ES },
      display: [],
      choices: shuffle([a, b]).map((v) => ({ id: String(v), type: 'text', value: String(v) })),
      answerId: String(answer),
      hint: {
        speech: wantBigger
          ? '¡Casi! Mayor significa el más grande. ¿Cuál es más grande?'
          : '¡Casi! Menor significa el más pequeño. ¿Cuál es más pequeño?',
        lang: ES,
      },
    }
  },
}

export const leoSequence = {
  id: 'leo-sequence',
  subject: 'math',
  lang: ES,
  icon: '🪜',
  name: 'El número que falta',
  tiers: 4,
  generate(tier) {
    // Tier 3 counts by tens — intro to tens/units.
    const { step, max } = [
      { step: 1, max: 20 },
      { step: 1, max: 100 },
      { step: -1, max: 30 },
      { step: sample([2, 10]), max: 100 },
    ][tier]
    const len = 4
    const span = Math.abs(step) * (len - 1)
    const start = step > 0 ? randInt(1, max - span) : randInt(span + 1, max)
    const terms = Array.from({ length: len }, (_, i) => start + i * step)
    const missingIndex = randInt(1, len - 1)
    const answer = terms[missingIndex]
    const items = terms.map((t, i) => (i === missingIndex ? '❓' : String(t)))
    return {
      prompt: { text: '¿Qué número falta?', speech: '¿Qué número falta en la serie?', lang: ES },
      display: [{ type: 'sequence', items }],
      choices: numberChoices(answer, 3, Math.max(0, answer - 12), answer + 12, terms).map((v) => ({
        id: String(v),
        type: 'text',
        value: String(v),
      })),
      answerId: String(answer),
      hint: { speech: '¡Casi! Di los números en voz alta y busca el que falta.', lang: ES },
    }
  },
}

export const LEO_MATH = [leoAdd, leoSubtract, leoCompare, leoSequence]
