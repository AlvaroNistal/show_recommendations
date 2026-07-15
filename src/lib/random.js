export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export const sample = (arr) => arr[randInt(0, arr.length - 1)]

export const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const sampleN = (arr, n) => shuffle(arr).slice(0, n)

// Distinct number choices including the answer, biased toward near-miss
// distractors. `exclude` keeps out numbers that would confuse (e.g. terms
// already visible in a sequence).
export function numberChoices(answer, count, min, max, exclude = []) {
  const banned = new Set(exclude.filter((v) => v !== answer))
  const set = new Set([answer])
  let guard = 0
  while (set.size < count && guard++ < 300) {
    const delta = randInt(1, 3) * (Math.random() < 0.5 ? -1 : 1)
    let candidate = answer + delta
    if (candidate < min || candidate > max) candidate = randInt(min, max)
    if (!banned.has(candidate)) set.add(candidate)
  }
  // Deterministic fill in case the range is tiny.
  for (let v = min; v <= max && set.size < count; v++) {
    if (!banned.has(v)) set.add(v)
  }
  return shuffle([...set])
}
