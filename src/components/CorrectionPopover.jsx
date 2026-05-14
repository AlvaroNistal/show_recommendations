import { useEffect, useRef, useState } from 'react'

export default function CorrectionPopover({ original, position, onApply, onClose }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); if (value.trim()) onApply(value.trim()) }
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      style={{ top: position.top, left: position.left }}
      // stopPropagation prevents mousedown from starting a new selection and
      // clearing the one that triggered this popover
      onMouseDown={(e) => e.stopPropagation()}
      className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-64"
    >
      <p className="text-xs text-gray-400 mb-1.5 truncate">
        "<span className="font-medium text-gray-700">{original}</span>"
      </p>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Replacement…"
        className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => { if (value.trim()) onApply(value.trim()) }}
          disabled={!value.trim()}
          className="flex-1 bg-gray-900 text-white rounded-lg py-1.5 text-xs font-medium hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Apply
        </button>
        <button
          onClick={onClose}
          className="flex-1 border border-gray-200 rounded-lg py-1.5 text-xs text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
