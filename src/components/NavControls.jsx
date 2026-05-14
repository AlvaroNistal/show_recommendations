import { useNavigate } from 'react-router-dom'

export default function NavControls({
  isDirty, saving, saveError, showSaved,
  hasPrev, hasNext,
  onSave, onPrev, onNext,
}) {
  const navigate = useNavigate()

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between gap-3">
      <button
        onClick={() => navigate('/queue')}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Queue
      </button>

      <div className="flex items-center gap-2 ml-auto">
        {saveError && (
          <p className="text-xs text-red-500">Save failed: {saveError}</p>
        )}

        {showSaved && (
          <p className="text-xs text-green-600 font-medium">Saved ✓</p>
        )}

        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>

        <button
          onClick={onSave}
          disabled={saving || !isDirty}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext || saving}
          className="bg-gray-900 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
