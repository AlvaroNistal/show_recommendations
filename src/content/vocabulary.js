// Visual/content layer, deliberately isolated from exercise logic (PRD decision 9.4):
// emoji today, illustrated characters later, without touching answer logic.

export const COUNTABLES = ['🍎', '🐙', '⭐', '🐶', '🌸', '🚗', '🐟', '🎈', '🦆', '🍓', '🐞', '🧁']

export const SHAPES = ['🔺', '🟦', '🟡', '🟪', '❤️', '⭐', '🌙', '🟢', '🔷', '🟧']

export const PATTERN_TOKENS = ['🔴', '🔵', '🟡', '🟢', '⭐', '❤️', '🟣', '🍀']

export const EN_ANIMALS = [
  { word: 'dog', emoji: '🐶' },
  { word: 'cat', emoji: '🐱' },
  { word: 'fish', emoji: '🐟' },
  { word: 'bird', emoji: '🐦' },
  { word: 'cow', emoji: '🐮' },
  { word: 'pig', emoji: '🐷' },
  { word: 'duck', emoji: '🦆' },
  { word: 'rabbit', emoji: '🐰' },
  { word: 'lion', emoji: '🦁' },
  { word: 'elephant', emoji: '🐘' },
  { word: 'monkey', emoji: '🐵' },
  { word: 'frog', emoji: '🐸' },
  { word: 'bear', emoji: '🐻' },
  { word: 'horse', emoji: '🐴' },
]

export const EN_FOOD = [
  { word: 'apple', emoji: '🍎' },
  { word: 'banana', emoji: '🍌' },
  { word: 'strawberry', emoji: '🍓' },
  { word: 'bread', emoji: '🍞' },
  { word: 'cheese', emoji: '🧀' },
  { word: 'egg', emoji: '🥚' },
  { word: 'ice cream', emoji: '🍦' },
  { word: 'pizza', emoji: '🍕' },
  { word: 'carrot', emoji: '🥕' },
  { word: 'cookie', emoji: '🍪' },
]

export const EN_OBJECTS = [
  { word: 'ball', emoji: '⚽' },
  { word: 'car', emoji: '🚗' },
  { word: 'book', emoji: '📖' },
  { word: 'house', emoji: '🏠' },
  { word: 'sun', emoji: '☀️' },
  { word: 'moon', emoji: '🌙' },
  { word: 'star', emoji: '⭐' },
  { word: 'tree', emoji: '🌳' },
  { word: 'flower', emoji: '🌸' },
  { word: 'balloon', emoji: '🎈' },
]

export const EN_COLORS = [
  { id: 'red', word: 'red', hex: '#ef4444' },
  { id: 'blue', word: 'blue', hex: '#3b82f6' },
  { id: 'yellow', word: 'yellow', hex: '#facc15' },
  { id: 'green', word: 'green', hex: '#22c55e' },
  { id: 'orange', word: 'orange', hex: '#f97316' },
  { id: 'purple', word: 'purple', hex: '#a855f7' },
  { id: 'pink', word: 'pink', hex: '#f472b6' },
  { id: 'brown', word: 'brown', hex: '#92400e' },
  { id: 'black', word: 'black', hex: '#1f2937' },
  { id: 'white', word: 'white', hex: '#f8fafc' },
]

// Objects whose real-world color is unambiguous, for "What color is the X?"
export const COLORED_OBJECTS = [
  { emoji: '🍓', name: 'strawberry', color: 'red' },
  { emoji: '🍎', name: 'apple', color: 'red' },
  { emoji: '🍌', name: 'banana', color: 'yellow' },
  { emoji: '☀️', name: 'sun', color: 'yellow' },
  { emoji: '🐸', name: 'frog', color: 'green' },
  { emoji: '🌳', name: 'tree', color: 'green' },
  { emoji: '🫐', name: 'blueberry', color: 'blue' },
  { emoji: '🐬', name: 'dolphin', color: 'blue' },
  { emoji: '🥕', name: 'carrot', color: 'orange' },
  { emoji: '🍊', name: 'orange', color: 'orange' },
  { emoji: '🍆', name: 'eggplant', color: 'purple' },
  { emoji: '🐷', name: 'pig', color: 'pink' },
  { emoji: '🐻', name: 'bear', color: 'brown' },
]

export const PRAISE_ES = ['¡Muy bien!', '¡Genial!', '¡Fantástico!', '¡Eres increíble!', '¡Súper!', '¡Lo has conseguido!']
export const PRAISE_EN = ['Great job!', 'Amazing!', 'Well done!', 'Fantastic!', 'You did it!', 'Super!']
export const ENCOURAGE_ES = ['¡Casi! Inténtalo otra vez.', 'Mmm, prueba otra vez. ¡Tú puedes!', '¡Otra vez! Seguro que lo consigues.']
export const ENCOURAGE_EN = ['Almost! Try again.', 'Hmm, one more try. You can do it!', "Listen again, you've got this!"]

// Star-economy collection: silly animal companions unlocked by cumulative stars.
export const STICKERS = [
  { id: 'fox', emoji: '🦊', name: 'Zorrito', cost: 3 },
  { id: 'penguin', emoji: '🐧', name: 'Pingüi', cost: 8 },
  { id: 'octopus', emoji: '🐙', name: 'Pulpito', cost: 14 },
  { id: 'unicorn', emoji: '🦄', name: 'Uni', cost: 21 },
  { id: 'sloth', emoji: '🦥', name: 'Don Lento', cost: 29 },
  { id: 'dino', emoji: '🦕', name: 'Dino', cost: 38 },
  { id: 'panda', emoji: '🐼', name: 'Panda', cost: 48 },
  { id: 'axolotl', emoji: '🩷', name: 'Ajolote Rosa', cost: 60 },
  { id: 'dragon', emoji: '🐉', name: 'Dragoncito', cost: 75 },
  { id: 'whale', emoji: '🐳', name: 'Ballena', cost: 90 },
  { id: 'alien', emoji: '👽', name: 'Marcianito', cost: 110 },
  { id: 'robot', emoji: '🤖', name: 'Robotín', cost: 130 },
]
