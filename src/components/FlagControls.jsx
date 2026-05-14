const FLAGS = [
  { key: 'unintelligible', label: 'Unintelligible' },
  { key: 'crosstalk',      label: 'Crosstalk' },
  { key: 'silence',        label: 'Silence' },
]

export default function FlagControls({ flags, onToggleFlag }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Flags</p>
      <div className="flex gap-2">
        {FLAGS.map(({ key, label }) => {
          const active = flags.includes(key)
          return (
            <button
              key={key}
              onClick={() => onToggleFlag(key)}
              className={`border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
