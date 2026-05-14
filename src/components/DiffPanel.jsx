import { applyCorrections } from '../hooks/useAnnotation.js'

const FLAG_LABELS = {
  unintelligible: 'Unintelligible',
  crosstalk:      'Crosstalk',
  silence:        'Silence',
}

function buildOriginalSegments(transcript, corrections) {
  const sorted = [...corrections].sort((a, b) => a.start - b.start)
  const segs = []
  let pos = 0
  for (const c of sorted) {
    if (pos < c.start) segs.push(<span key={`t${pos}`}>{transcript.slice(pos, c.start)}</span>)
    segs.push(
      <mark key={c.id} className="bg-red-100 text-red-600 rounded-sm not-italic">
        {c.original}
      </mark>
    )
    pos = c.end
  }
  if (pos < transcript.length) segs.push(<span key={`t${pos}`}>{transcript.slice(pos)}</span>)
  return segs
}

function buildValidatedSegments(transcript, corrections) {
  const sorted = [...corrections].sort((a, b) => a.start - b.start)
  const segs = []
  let pos = 0
  for (const c of sorted) {
    if (pos < c.start) segs.push(<span key={`t${pos}`}>{transcript.slice(pos, c.start)}</span>)
    segs.push(
      <mark key={c.id} className="bg-green-100 text-green-700 rounded-sm not-italic">
        {c.replacement}
      </mark>
    )
    pos = c.end
  }
  if (pos < transcript.length) segs.push(<span key={`t${pos}`}>{transcript.slice(pos)}</span>)
  return segs
}

export default function DiffPanel({ transcript, corrections, flags }) {
  const hasContent = corrections.length > 0 || flags.length > 0
  if (!hasContent) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Diff</h2>
      <div className="grid grid-cols-3 gap-6 text-sm leading-relaxed">

        <div>
          <p className="text-xs text-gray-400 mb-2">Original</p>
          <p className="text-gray-600">
            {corrections.length === 0
              ? <span className="text-gray-300 italic">No corrections</span>
              : buildOriginalSegments(transcript, corrections)
            }
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">Validated</p>
          <p className="text-gray-800">
            {corrections.length === 0
              ? <span className="text-gray-300 italic">No corrections</span>
              : buildValidatedSegments(transcript, corrections)
            }
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">Flags</p>
          {flags.length === 0
            ? <p className="text-gray-300 italic">None</p>
            : <ul className="flex flex-col gap-1">
                {flags.map((f) => (
                  <li key={f} className="text-gray-700">{FLAG_LABELS[f] ?? f}</li>
                ))}
              </ul>
          }
        </div>

      </div>
    </div>
  )
}
