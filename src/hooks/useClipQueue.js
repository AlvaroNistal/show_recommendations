import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueueContext } from '../context/QueueContext.jsx'

function sortedQueue(clips) {
  return [...clips].sort((a, b) => {
    if (a.status === b.status) return 0
    return a.status === 'pending' ? -1 : 1
  })
}

export function useClipQueue() {
  const { queue, setQueue } = useQueueContext()
  const navigate = useNavigate()

  const sorted = sortedQueue(queue)

  const storeQueue = useCallback(
    (clips) => setQueue(clips),
    [setQueue]
  )

  const indexOf = useCallback(
    (clipId) => sorted.findIndex((c) => String(c.id) === String(clipId)),
    [sorted]
  )

  const hasPrev = useCallback(
    (clipId) => indexOf(clipId) > 0,
    [indexOf]
  )

  const hasNext = useCallback(
    (clipId) => {
      const idx = indexOf(clipId)
      return idx !== -1 && idx < sorted.length - 1
    },
    [indexOf, sorted.length]
  )

  const goPrev = useCallback(
    (clipId) => {
      const idx = indexOf(clipId)
      if (idx > 0) navigate(`/annotate/${sorted[idx - 1].id}`)
    },
    [indexOf, sorted, navigate]
  )

  const goNext = useCallback(
    (clipId) => {
      const idx = indexOf(clipId)
      if (idx !== -1 && idx < sorted.length - 1) navigate(`/annotate/${sorted[idx + 1].id}`)
    },
    [indexOf, sorted, navigate]
  )

  return { queue: sorted, storeQueue, hasPrev, hasNext, goPrev, goNext }
}
