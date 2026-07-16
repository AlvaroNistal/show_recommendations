// Leo (6) — English listening with larger vocabulary and spoken questions.
// Still audio-first: he doesn't read English yet (written EN deferred to v2).
import { randInt, sample, sampleN, shuffle } from '../lib/random.js'
import { EN_ANIMALS, EN_FOOD, EN_OBJECTS, EN_COLORS, COLORED_OBJECTS } from '../content/vocabulary.js'

const EN = 'en-US'

export const leoVocab = {
  id: 'leo-vocab',
  subject: 'english',
  lang: EN,
  icon: '📚',
  name: 'Words',
  tiers: 3,
  generate(tier) {
    const pools = [
      [...EN_ANIMALS, ...EN_FOOD.slice(0, 5)],
      [...EN_ANIMALS, ...EN_FOOD],
      [...EN_ANIMALS, ...EN_FOOD, ...EN_OBJECTS],
    ]
    const pool = pools[tier]
    const target = sample(pool)
    const others = sampleN(pool.filter((w) => w.word !== target.word), 3)
    return {
      prompt: { text: `Tap the ${target.word}`, speech: `Tap the ${target.word}!`, lang: EN },
      display: [],
      choices: shuffle([target, ...others]).map((w) => ({ id: w.word, type: 'emoji', value: w.emoji })),
      answerId: target.word,
      hint: { speech: `Almost! Where is the ${target.word}? Try again!`, lang: EN },
    }
  },
}

export const leoWhatColor = {
  id: 'leo-whatcolor',
  subject: 'english',
  lang: EN,
  icon: '🌈',
  name: 'What color?',
  tiers: 3,
  generate(tier) {
    const choiceCount = [3, 4, 4][tier]
    const objectPool = tier === 0 ? COLORED_OBJECTS.slice(0, 8) : COLORED_OBJECTS
    const target = sample(objectPool)
    const correctColor = EN_COLORS.find((c) => c.id === target.color)
    const others = sampleN(EN_COLORS.filter((c) => c.id !== target.color), choiceCount - 1)
    return {
      prompt: {
        text: `What color is the ${target.name}?`,
        speech: `What color is the ${target.name}?`,
        lang: EN,
      },
      display: [{ type: 'emoji', value: target.emoji }],
      choices: shuffle([correctColor, ...others]).map((c) => ({ id: c.id, type: 'color', value: c.hex })),
      answerId: target.color,
      hint: { speech: `Almost! Look at the ${target.name}. What color is it? Try again!`, lang: EN },
    }
  },
}

export const leoNumbersEn = {
  id: 'leo-numbers-en',
  subject: 'english',
  lang: EN,
  icon: '🔟',
  name: 'Numbers to 20',
  tiers: 3,
  generate(tier) {
    const max = [10, 15, 20][tier]
    const choiceCount = tier === 0 ? 3 : 4
    const n = randInt(1, max)
    const set = new Set([n])
    let guard = 0
    while (set.size < choiceCount && guard++ < 100) {
      const near = n + randInt(1, 3) * (Math.random() < 0.5 ? -1 : 1)
      set.add(near >= 1 && near <= max ? near : randInt(1, max))
    }
    return {
      prompt: { text: `Tap the number ${n}`, speech: `Tap the number ${n}!`, lang: EN },
      display: [],
      choices: shuffle([...set]).map((v) => ({ id: String(v), type: 'text', value: String(v) })),
      answerId: String(n),
      hint: { speech: `Almost! Listen carefully: ${n}. Try again!`, lang: EN },
    }
  },
}

export const LEO_ENGLISH = [leoVocab, leoWhatColor, leoNumbersEn]
