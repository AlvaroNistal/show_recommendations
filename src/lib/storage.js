// Device-local progress (v1 decision: localStorage, no backend, no auth).
const KEY = 'aprende-conmigo:v1'

const defaultChild = () => ({
  stars: 0,
  completed: 0,
  mastery: {}, // templateId -> highest tier reached
  stickers: [], // unlocked sticker ids
  audio: true,
  lastPlayed: null,
})

function loadAll() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // Corrupt or unavailable storage: start fresh rather than crash.
  }
  return { children: {} }
}

function saveAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Storage full/unavailable — gameplay continues, progress just won't persist.
  }
}

export function getChild(id) {
  const data = loadAll()
  return { ...defaultChild(), ...(data.children[id] ?? {}) }
}

export function updateChild(id, updater) {
  const data = loadAll()
  const current = { ...defaultChild(), ...(data.children[id] ?? {}) }
  data.children[id] = updater(current)
  saveAll(data)
  return data.children[id]
}

export function resetChild(id) {
  const data = loadAll()
  delete data.children[id]
  saveAll(data)
}
