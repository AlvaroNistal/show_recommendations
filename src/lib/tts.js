// Web Speech API wrapper. All kid-facing instructions are spoken (Grace is a
// pre-reader and Leo doesn't read English yet), so this is a core dependency.
let voices = []

function refreshVoices() {
  voices = window.speechSynthesis?.getVoices() ?? []
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  refreshVoices()
  window.speechSynthesis.onvoiceschanged = refreshVoices
}

export function speak(text, lang = 'es-ES', { rate = 0.92 } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  const exact = voices.find((v) => v.lang === lang || v.lang === lang.replace('-', '_'))
  const loose = voices.find((v) => v.lang?.slice(0, 2) === lang.slice(0, 2))
  const voice = exact ?? loose
  if (voice) utterance.voice = voice
  utterance.rate = rate
  utterance.pitch = 1.05
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
}
