import { GRACE_MATH } from './graceMath.js'
import { LEO_MATH } from './leoMath.js'
import { GRACE_ENGLISH } from './graceEnglish.js'
import { LEO_ENGLISH } from './leoEnglish.js'
import { graceBalanza, leoBalanza } from './worlds/balanza.js'
import { graceRobot, leoRobot } from './worlds/robot.js'
import { graceEstanque, leoEstanque } from './worlds/estanque.js'

export const PROFILES = [
  {
    id: 'leo',
    name: 'Leo',
    avatar: '🦖',
    age: 6,
    theme: { bg: 'from-sky-100 to-emerald-100', accent: 'bg-sky-500', ring: 'ring-sky-400' },
    templates: [...LEO_MATH, ...LEO_ENGLISH, leoBalanza, leoRobot, leoEstanque],
  },
  {
    id: 'grace',
    name: 'Grace',
    avatar: '🦄',
    age: 4,
    theme: { bg: 'from-pink-100 to-violet-100', accent: 'bg-pink-500', ring: 'ring-pink-400' },
    templates: [...GRACE_MATH, ...GRACE_ENGLISH, graceBalanza, graceRobot, graceEstanque],
  },
]

export function getProfile(id) {
  return PROFILES.find((p) => p.id === id)
}
