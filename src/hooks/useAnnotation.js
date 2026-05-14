import { useReducer, useCallback } from 'react'

// corrections: [{ id, start, end, original, replacement }]  (char offsets in transcript string)
// flags:       ['unintelligible', 'crosstalk', ...]          (active flag names)

const initialState = {
  corrections: [],
  flags: [],
  isDirty: false,
}

let _nextId = 1
function makeId() { return `c${_nextId++}` }

function rangesOverlap(s1, e1, s2, e2) { return s1 < e2 && e1 > s2 }

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_CORRECTION': {
      const kept = state.corrections.filter(
        (c) => !rangesOverlap(c.start, c.end, action.start, action.end)
      )
      const next = [
        ...kept,
        { id: action.id, start: action.start, end: action.end,
          original: action.original, replacement: action.replacement },
      ].sort((a, b) => a.start - b.start)
      return { ...state, corrections: next, isDirty: true }
    }
    case 'REMOVE_CORRECTION':
      return {
        ...state,
        corrections: state.corrections.filter((c) => c.id !== action.id),
        isDirty: true,
      }
    case 'TOGGLE_FLAG': {
      const has = state.flags.includes(action.flag)
      return {
        ...state,
        flags: has ? state.flags.filter((f) => f !== action.flag) : [...state.flags, action.flag],
        isDirty: true,
      }
    }
    case 'LOAD':
      return { corrections: action.corrections ?? [], flags: action.flags ?? [], isDirty: false }
    case 'RESET':
      return { ...initialState }
    case 'MARK_SAVED':
      return { ...state, isDirty: false }
    default:
      return state
  }
}

export function useAnnotation() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const addCorrection = useCallback((start, end, original, replacement) => {
    dispatch({ type: 'ADD_CORRECTION', id: makeId(), start, end, original, replacement })
  }, [])

  const removeCorrection = useCallback((id) => {
    dispatch({ type: 'REMOVE_CORRECTION', id })
  }, [])

  const toggleFlag = useCallback((flag) => {
    dispatch({ type: 'TOGGLE_FLAG', flag })
  }, [])

  const loadAnnotation = useCallback(({ corrections, flags } = {}) => {
    dispatch({ type: 'LOAD', corrections, flags })
  }, [])

  const resetAnnotation = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const markSaved = useCallback(() => {
    dispatch({ type: 'MARK_SAVED' })
  }, [])

  return {
    corrections: state.corrections,
    flags: state.flags,
    isDirty: state.isDirty,
    addCorrection,
    removeCorrection,
    toggleFlag,
    loadAnnotation,
    resetAnnotation,
    markSaved,
  }
}

// Pure helper used by AnnotationView and DiffPanel
export function applyCorrections(transcript, corrections) {
  const sorted = [...corrections].sort((a, b) => b.start - a.start)
  let result = transcript
  for (const c of sorted) {
    result = result.slice(0, c.start) + c.replacement + result.slice(c.end)
  }
  return result
}
