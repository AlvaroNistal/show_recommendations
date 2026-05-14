import { useState, useRef } from 'react'
import CorrectionPopover from './CorrectionPopover.jsx'

// Build ordered segments from the transcript string + corrections array
function buildSegments(transcript, corrections) {
  const sorted = [...corrections].sort((a, b) => a.start - b.start)
  const segs = []
  let pos = 0
  for (const c of sorted) {
    if (pos < c.start) segs.push({ type: 'text', text: transcript.slice(pos, c.start), start: pos })
    segs.push({ type: 'correction', correction: c })
    pos = c.end
  }
  if (pos < transcript.length) segs.push({ type: 'text', text: transcript.slice(pos), start: pos })
  return segs
}

// Compute character length of a range, ignoring [data-repl] nodes (replacement text)
function originalLength(range) {
  const frag = range.cloneContents()
  frag.querySelectorAll('[data-repl]').forEach((el) => el.remove())
  return frag.textContent.length
}

export default function TranscriptEditor({ transcript, corrections, onAdd, onRemove }) {
  const [popover, setPopover] = useState(null)
  const containerRef = useRef(null)

  const segments = buildSegments(transcript, corrections)

  function handleMouseUp() {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !sel.rangeCount) return

    const range = sel.getRangeAt(0)
    const container = containerRef.current
    if (!container || !container.contains(range.commonAncestorContainer)) return

    // Measure start offset: text length from container start → selection start,
    // excluding replacement spans so offsets stay in the original transcript space.
    const preRange = document.createRange()
    preRange.selectNodeContents(container)
    preRange.setEnd(range.startContainer, range.startOffset)

    const start = originalLength(preRange)
    const len   = originalLength(range)
    if (len === 0) return

    const end      = start + len
    const original = transcript.slice(start, end)
    if (!original.trim()) return

    const selRect       = range.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const maxLeft       = container.clientWidth - 272

    setPopover({
      start, end, original,
      position: {
        top:  selRect.bottom - containerRect.top + 6,
        left: Math.min(Math.max(0, selRect.left - containerRect.left), maxLeft),
      },
    })
  }

  function handleApply(replacement) {
    if (!popover) return
    onAdd(popover.start, popover.end, popover.original, replacement)
    setPopover(null)
    window.getSelection()?.removeAllRanges()
  }

  function handleClose() {
    setPopover(null)
    window.getSelection()?.removeAllRanges()
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-white border border-gray-200 rounded-xl p-5 leading-8 text-sm text-gray-800"
      onMouseUp={handleMouseUp}
    >
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return (
            <span key={i} data-start={seg.start}>
              {seg.text}
            </span>
          )
        }

        const { correction: c } = seg
        return (
          <span key={c.id} className="inline-flex items-baseline gap-0.5 group">
            {/* Original text with strikethrough — stays in the selection flow */}
            <span className="line-through text-gray-400 decoration-gray-300">
              {c.original}
            </span>
            {/* Replacement text — excluded from selection offset counting */}
            <span data-repl="" className="text-blue-600 select-none">
              {c.replacement}
            </span>
            {/* Remove button — excluded from selection, shown on hover */}
            <button
              data-repl=""
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onRemove(c.id)}
              title="Remove correction"
              className="ml-0.5 text-gray-300 hover:text-red-400 select-none opacity-0 group-hover:opacity-100 transition-opacity text-base leading-none"
            >
              ×
            </button>
          </span>
        )
      })}

      {popover && (
        <CorrectionPopover
          original={popover.original}
          position={popover.position}
          onApply={handleApply}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
