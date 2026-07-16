import { sample } from '../../lib/random.js'

const ES = 'es-ES'

const POND_EMOJIS = ['🐟', '🦆', '🐸', '🦋', '🐠', '🐙']

// Grace: split N creatures equally between 2 ponds.
export const graceEstanque = {
  id: 'grace-estanque',
  subject: 'math',
  lang: ES,
  icon: '🌊',
  name: 'El Estanque',
  worldType: 'estanque',
  tiers: 3,
  generate(tier) {
    const total = [4, 6, 8][tier]
    const emoji = sample(POND_EMOJIS)
    return {
      worldType: 'estanque',
      prompt: {
        text: '¡Pon los mismos en cada estanque!',
        speech: '¡Reparte los animales en partes iguales! Pon los mismos en cada estanque.',
        lang: ES,
      },
      display: [],
      choices: [],
      answerId: '__world__',
      hint: { speech: 'Necesitas el mismo número en cada estanque. Inténtalo otra vez.', lang: ES },
      worldConfig: {
        total,
        ponds: 2,
        targetPerPond: total / 2,
        emoji,
      },
    }
  },
}

// Leo: split creatures between 2 or 3 ponds — introduces division intuition.
export const leoEstanque = {
  id: 'leo-estanque',
  subject: 'math',
  lang: ES,
  icon: '🌊',
  name: 'El Estanque',
  worldType: 'estanque',
  tiers: 4,
  generate(tier) {
    const configs = [
      { total: 6,  ponds: 2, targetPerPond: 3 },   // 6 ÷ 2 = 3
      { total: 8,  ponds: 2, targetPerPond: 4 },   // 8 ÷ 2 = 4
      { total: 9,  ponds: 3, targetPerPond: 3 },   // 9 ÷ 3 = 3
      { total: 12, ponds: 3, targetPerPond: 4 },   // 12 ÷ 3 = 4
    ]
    const { total, ponds, targetPerPond } = configs[tier]
    const emoji = sample(POND_EMOJIS)
    const pondWord = ponds === 2 ? 'dos estanques' : 'tres estanques'
    return {
      worldType: 'estanque',
      prompt: {
        text: `¡Reparte en ${pondWord}!`,
        speech: `Reparte los animales en ${pondWord} por igual.`,
        lang: ES,
      },
      display: [],
      choices: [],
      answerId: '__world__',
      hint: { speech: `¡Necesitas ${targetPerPond} en cada estanque!`, lang: ES },
      worldConfig: {
        total,
        ponds,
        targetPerPond,
        emoji,
      },
    }
  },
}

export const ESTANQUE_WORLDS = [graceEstanque, leoEstanque]
