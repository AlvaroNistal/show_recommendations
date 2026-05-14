import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchQueue } from '../services/api.js'
import { clearToken } from '../services/auth.js'
import { useClipQueue } from '../hooks/useClipQueue.js'

const STATUS_STYLES = {
  pending:   'bg-gray-100 text-gray-500',
  validated: 'bg-green-100 text-green-700',
}

const STATUS_LABELS = {
  pending:   'Pending',
  validated: 'Validated',
}

export default function ReviewQueue() {
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const navigate              = useNavigate()
  const { queue, storeQueue } = useClipQueue()

  useEffect(() => {
    fetchQueue()
      .then((clips) => storeQueue(clips))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function logout() {
    clearToken()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-900">Review Queue</h1>
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {loading && (
          <p className="text-sm text-gray-400">Loading…</p>
        )}

        {!loading && error && (
          <p className="text-sm text-red-500">Failed to load queue: {error}</p>
        )}

        {!loading && !error && queue.length === 0 && (
          <p className="text-sm text-gray-400">No clips in the queue.</p>
        )}

        {!loading && queue.length > 0 && (
          <ul className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {queue.map((clip, i) => (
              <li key={clip.id} className="flex items-center gap-4 px-5 py-3">
                <span className="text-sm text-gray-300 w-5 shrink-0 text-right">
                  {i + 1}
                </span>

                <span className="text-sm font-medium text-gray-800 flex-1 truncate">
                  {clip.id}
                </span>

                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                    STATUS_STYLES[clip.status] ?? STATUS_STYLES.pending
                  }`}
                >
                  {STATUS_LABELS[clip.status] ?? 'Pending'}
                </span>

                <button
                  onClick={() => navigate(`/annotate/${clip.id}`)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium shrink-0 transition-colors"
                >
                  Review
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
