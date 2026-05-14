const API_URL = import.meta.env.VITE_API_URL

const MOCK_VALID_CODE = 'TEST123'

// In-memory store for mock saves — persists for the lifetime of the browser session
const MOCK_SAVED = {}

// transcript: the working string (validated_transcript if exists, else original)
// flags: array of active flag names
const MOCK_CLIPS = [
  {
    id: 'clip_001',
    name: 'clip_001',
    url: null,
    transcript: 'Hello this is a test transcript with some words in it.',
    flags: [],
    status: 'pending',
  },
  {
    id: 'clip_002',
    name: 'clip_002',
    url: null,
    transcript: 'Another clip with different content here and a few more words.',
    flags: [],
    status: 'pending',
  },
  {
    id: 'clip_003',
    name: 'clip_003',
    url: null,
    transcript: 'This one has already been reviewed and validated by the annotator.',
    flags: ['crosstalk'],
    status: 'validated',
  },
]

function post(payload) {
  return fetch(API_URL, {
    method: 'POST',
    // text/plain avoids CORS preflight; GAS reads body via e.postData.contents
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  }).then((res) => {
    if (!res.ok) throw new Error(`Server error: ${res.status}`)
    return res.json()
  })
}

function get(params) {
  const qs = new URLSearchParams(params).toString()
  return fetch(`${API_URL}?${qs}`).then((res) => {
    if (!res.ok) throw new Error(`Server error: ${res.status}`)
    return res.json()
  })
}

export async function validateCode(code) {
  if (!API_URL) {
    await new Promise((r) => setTimeout(r, 400))
    if (code === MOCK_VALID_CODE) return { valid: true, token: 'mock-session-token' }
    return { valid: false }
  }
  return post({ action: 'validateCode', code })
}

export async function fetchQueue() {
  if (!API_URL) {
    await new Promise((r) => setTimeout(r, 300))
    return MOCK_CLIPS.map(({ id, name, status }) => ({
      id,
      name,
      status: MOCK_SAVED[id]?.status ?? status,
    }))
  }
  return get({ action: 'getQueue' })
}

export async function fetchClip(clipId) {
  if (!API_URL) {
    await new Promise((r) => setTimeout(r, 300))
    const clip = MOCK_CLIPS.find((c) => c.id === clipId)
    if (!clip) throw new Error(`Clip not found: ${clipId}`)
    const saved = MOCK_SAVED[clipId]
    if (saved) {
      return {
        ...clip,
        transcript: saved.validated_transcript,
        flags:      saved.flags,
        status:     'validated',
      }
    }
    return clip
  }
  const data = await get({ action: 'getClip', clip_id: clipId })
  // Normalise GAS response: join words array → transcript string if needed
  if (!data.transcript && Array.isArray(data.words)) {
    data.transcript = data.words.join(' ')
  }
  if (typeof data.flags === 'string') {
    try { data.flags = JSON.parse(data.flags) } catch { data.flags = [] }
  }
  return data
}

// validatedTranscript: plain-text string with corrections applied
// flags: array of active flag name strings
export async function saveTranscript(clipId, validatedTranscript, flags) {
  if (!API_URL) {
    await new Promise((r) => setTimeout(r, 400))
    MOCK_SAVED[clipId] = { validated_transcript: validatedTranscript, flags, status: 'validated' }
    return { success: true }
  }
  return post({
    action: 'saveTranscript',
    clip_id: clipId,
    validated_transcript: validatedTranscript,
    flags: JSON.stringify(flags),
  })
}
