// Grace (4) — pre-number-sense track. Montessori-style: concrete quantities
// shown alongside numerals, counting before abstract notation (PRD decision 9.3).
import { randInt, sample, sampleN, shuffle, numberChoices } from '../lib/random.js'
import { COUNTABLES, SHAPES, PATTERN_TOKENS } from '../content/vocabulary.js'

const ES = 'es-ES'

export const graceCount = {
  id: 'grace-count',
  subject: 'math',
  lang: ES,
  icon: '🔢',
  name: 'Contar',
  tiers: 4,
  generate(tier) {
    const max = [3, 5, 7, 10][tier]
    const n = randInt(1, max)
    const emoji = sample(COUNTABLES)
    const values = numberChoices(n, 3, 1, Math.max(max, 3))
    const choices = values.map((v) => ({ id: String(v), type: 'text', value: String(v) }))
    const display = [{ type: 'emojis', value: Array(n).fill(emoji) }]
    return {
      prompt: { text: '¿Cuántos hay?', speech: '¿Cuántos hay? ¡Cuéntalos!', lang: ES },
      display,
      choices,
      answerId: String(n),
      hint: { speech: 'Ese no es el número correcto. Inténtalo otra vez.', lang: ES },
      prediction: {
        prompt: { text: '¿Cuántos crees que hay?', speech: '¡Mira! ¿Cuántos crees que hay?', lang: ES },
        display,
        choices,
      },
    }
  },
}

export const graceMore = {
  id: 'grace-more',
  subject: 'math',
  lang: ES,
  icon: '⚖️',
  name: '¿Dónde hay más?',
  tiers: 4,
  generate(tier) {
    const { max, minDiff } = [
      { max: 4, minDiff: 2 },
      { max: 6, minDiff: 2 },
      { max: 8, minDiff: 1 },
      { max: 10, minDiff: 1 },
    ][tier]
    const small = randInt(1, max - minDiff)
    const big = small + randInt(minDiff, max - small)
    const [emojiA, emojiB] = sampleN(COUNTABLES, 2)
    const groups = shuffle([
      { id: 'big', count: big, emoji: emojiA },
      { id: 'small', count: small, emoji: emojiB },
    ])
    return {
      prompt: { text: '¿Dónde hay más?', speech: '¿Dónde hay más? ¡Toca el grupo con más!', lang: ES },
      display: [],
      choices: groups.map((g) => ({ id: g.id, type: 'emojiGroup', value: Array(g.count).fill(g.emoji) })),
      answerId: 'big',
      hint: { speech: 'Ese no es el grupo con más. Inténtalo otra vez.', lang: ES },
    }
  },
}

export const graceShapes = {
  id: 'grace-shapes',
  subject: 'math',
  lang: ES,
  icon: '🔷',
  name: 'Figuras',
  tiers: 3,
  generate(tier) {
    const choiceCount = [3, 4, 4][tier]
    const target = sample(SHAPES)
    const others = sampleN(SHAPES.filter((s) => s !== target), choiceCount - 1)
    return {
      prompt: { text: 'Toca la figura igual', speech: '¡Mira! Toca la figura que es igual a esta.', lang: ES },
      display: [{ type: 'emoji', value: target }],
      choices: shuffle([target, ...others]).map((s) => ({ id: s, type: 'emoji', value: s })),
      answerId: target,
      hint: { speech: 'Esa no es la figura correcta. Inténtalo otra vez.', lang: ES },
    }
  },
}

export const gracePattern = {
  id: 'grace-pattern',
  subject: 'math',
  lang: ES,
  icon: '🔴',
  name: 'Patrones',
  tiers: 4,
  generate(tier) {
    const { pattern, shown } = [
      { pattern: 'AB', shown: 4 },
      { pattern: 'AB', shown: 5 },
      { pattern: 'AAB', shown: 6 },
      { pattern: 'ABC', shown: 6 },
    ][tier]
    const distinct = new Set(pattern).size
    const tokens = sampleN(PATTERN_TOKENS, distinct)
    const map = { A: tokens[0], B: tokens[1], C: tokens[2] }
    const sequence = []
    for (let i = 0; i < shown + 1; i++) sequence.push(map[pattern[i % pattern.length]])
    const answer = sequence[shown]
    const visible = sequence.slice(0, shown)
    let choiceTokens = [...tokens]
    if (choiceTokens.length < 3) {
      choiceTokens.push(sample(PATTERN_TOKENS.filter((t) => !choiceTokens.includes(t))))
    }
    return {
      prompt: { text: '¿Qué viene después?', speech: '¡Mira el patrón! ¿Qué viene después?', lang: ES },
      display: [{ type: 'sequence', items: [...visible, '❓'] }],
      choices: shuffle(choiceTokens).map((t) => ({ id: t, type: 'emoji', value: t })),
      answerId: answer,
      hint: { speech: 'Ese no es el correcto. Inténtalo otra vez.', lang: ES },
    }
  },
}

export const GRACE_MATH = [graceCount, graceMore, graceShapes, gracePattern]
