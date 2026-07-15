// Grace (4) — English listening & vocabulary. Audio-first: she can't read,
// so the spoken prompt IS the exercise. Text shown is for grown-ups nearby.
import { randInt, sample, sampleN, shuffle } from '../lib/random.js'
import { EN_ANIMALS, EN_FOOD, EN_COLORS } from '../content/vocabulary.js'

const EN = 'en-US'

export const graceTapWord = {
  id: 'grace-tapword',
  subject: 'english',
  lang: EN,
  icon: '🐶',
  name: 'Tap the word',
  tiers: 3,
  generate(tier) {
    const pools = [EN_ANIMALS.slice(0, 6), EN_ANIMALS, [...EN_ANIMALS, ...EN_FOOD]]
    const choiceCount = [3, 3, 4][tier]
    const pool = pools[tier]
    const target = sample(pool)
    const others = sampleN(pool.filter((w) => w.word !== target.word), choiceCount - 1)
    return {
      prompt: { text: `Tap the ${target.word}`, speech: `Tap the ${target.word}!`, lang: EN },
      display: [],
      choices: shuffle([target, ...others]).map((w) => ({ id: w.word, type: 'emoji', value: w.emoji })),
      answerId: target.word,
      hint: { speech: `Almost! Where is the ${target.word}? Try again!`, lang: EN },
    }
  },
}

export const graceColors = {
  id: 'grace-colors',
  subject: 'english',
  lang: EN,
  icon: '🎨',
  name: 'Colors',
  tiers: 3,
  generate(tier) {
    const pools = [EN_COLORS.slice(0, 4), EN_COLORS.slice(0, 6), EN_COLORS]
    const choiceCount = [3, 4, 4][tier]
    const pool = pools[tier]
    const target = sample(pool)
    const others = sampleN(pool.filter((c) => c.id !== target.id), choiceCount - 1)
    return {
      prompt: { text: `Tap the ${target.word} one`, speech: `Tap the ${target.word} one!`, lang: EN },
      display: [],
      choices: shuffle([target, ...others]).map((c) => ({ id: c.id, type: 'color', value: c.hex })),
      answerId: target.id,
      hint: { speech: `Almost! Find the ${target.word} one. Try again!`, lang: EN },
    }
  },
}

export const graceNumbersEn = {
  id: 'grace-numbers-en',
  subject: 'english',
  lang: EN,
  icon: '✋',
  name: 'Numbers',
  tiers: 3,
  generate(tier) {
    const max = [5, 10, 10][tier]
    const choiceCount = [3, 3, 4][tier]
    const n = randInt(1, max)
    const set = new Set([n])
    while (set.size < choiceCount) set.add(randInt(1, max))
    return {
      prompt: { text: `Tap the number ${n}`, speech: `Tap the number ${n}!`, lang: EN },
      display: [],
      choices: shuffle([...set]).map((v) => ({ id: String(v), type: 'text', value: String(v) })),
      answerId: String(n),
      hint: { speech: `Almost! Listen: ${n}. Where is the number ${n}?`, lang: EN },
    }
  },
}

export const GRACE_ENGLISH = [graceTapWord, graceColors, graceNumbersEn]
