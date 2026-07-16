// Web Speech API wrapper. All kid-facing instructions are spoken (Grace is a
// pre-reader and Leo doesn't read English yet), so this is a core dependency.
//
// Voice quality varies wildly by platform. Strategy, in preference order:
// 1. Known high-quality named voices (iOS/macOS neural voices are excellent)
// 2. Any local/on-device voice for the language (avoids robotic online synths)
// 3. Any matching online voice
// 4. Browser default (no voice set)

let voices = []

function refreshVoices() {
  voices = window.speechSynthesis?.getVoices() ?? []
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  refreshVoices()
  window.speechSynthesis.onvoiceschanged = refreshVoices
}

// Named voices known to sound natural. Checked in order; first match wins.
const PREFERRED = {
  'es': [
    'Mónica',       // macOS/iOS — excellent
    'Paulina',      // macOS
    'Jorge',        // macOS
    'Google español',
    'Microsoft Helena',
    'Microsoft Pablo',
  ],
  'en': [
    'Samantha',     // macOS/iOS — excellent
    'Karen',        // iOS
    'Daniel',       // macOS UK
    'Moira',        // macOS Irish
    'Google US English',
    'Microsoft Zira',
    'Microsoft David',
  ],
}

// Substrings in voice names that indicate low-quality synthesisers to skip
// when a better option exists.
const AVOID = ['espeak', 'mbrola', 'festival', 'flite']

function pickVoice(lang) {
  if (!voices.length) return null
  const langPrefix = lang.slice(0, 2)
  const preferred = PREFERRED[langPrefix] ?? []

  // 1. Preferred named voices (case-insensitive partial match)
  for (const name of preferred) {
    const v = voices.find((v) =>
      (v.lang === lang || v.lang?.slice(0, 2) === langPrefix) &&
      v.name.toLowerCase().includes(name.toLowerCase())
    )
    if (v) return v
  }

  // 2. Local (on-device) voices for the language, avoiding known bad synths
  const locals = voices.filter(
    (v) =>
      v.localService &&
      (v.lang === lang || v.lang?.slice(0, 2) === langPrefix) &&
      !AVOID.some((bad) => v.name.toLowerCase().includes(bad))
  )
  if (locals.length) return locals[0]

  // 3. Any online voice for the language
  const online = voices.find(
    (v) => v.lang === lang || v.lang?.slice(0, 2) === langPrefix
  )
  if (online) return online

  return null
}

export function speak(text, lang = 'es-ES', { rate = 0.92 } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  const voice = pickVoice(lang)
  if (voice) utterance.voice = voice
  utterance.rate = rate
  utterance.pitch = 1.05
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
}

// Utility: log available voices for debugging. Call from browser console:
//   import('/src/lib/tts.js').then(m => m.debugVoices())
export function debugVoices() {
  const byLang = {}
  for (const v of voices) {
    const k = v.lang?.slice(0, 2) ?? '??'
    ;(byLang[k] ??= []).push(`${v.name} (${v.lang})${v.localService ? ' [local]' : ' [online]'}`)
  }
  console.table(byLang)
}
