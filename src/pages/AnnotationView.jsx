import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { fetchClip, saveTranscript } from '../services/api.js'
import { useAnnotation, applyCorrections } from '../hooks/useAnnotation.js'
import { useClipQueue } from '../hooks/useClipQueue.js'
import ClipPlayer from '../components/ClipPlayer.jsx'
import TranscriptEditor from '../components/TranscriptEditor.jsx'
import DiffPanel from '../components/DiffPanel.jsx'
import FlagControls from '../components/FlagControls.jsx'
import NavControls from '../components/NavControls.jsx'

export default function AnnotationView() {
  const { clipId } = useParams()
  const [clip, setClip]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [saving, setSaving]     = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [showSaved, setShowSaved] = useState(false)
  const savedTimerRef = useRef(null)

  const annotation = useAnnotation()
  const { hasPrev, hasNext, goPrev, goNext } = useClipQueue()

  useEffect(() => {
    setLoading(true)
    setError(null)
    setShowSaved(false)
    annotation.resetAnnotation()
    window.getSelection()?.removeAllRanges()

    fetchClip(clipId)
      .then((data) => {
        setClip(data)
        // Restore flags from previous session if present
        if (data.flags?.length) {
          annotation.loadAnnotation({ corrections: [], flags: data.flags })
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [clipId])

  // Clean up saved confirmation timer on unmount
  useEffect(() => () => clearTimeout(savedTimerRef.current), [])

  async function doSave() {
    if (!clip || saving) return
    setSaving(true)
    setSaveError(null)
    try {
      const validated = applyCorrections(clip.transcript, annotation.corrections)
      await saveTranscript(clipId, validated, annotation.flags)
      annotation.markSaved()
      setShowSaved(true)
      clearTimeout(savedTimerRef.current)
      savedTimerRef.current = setTimeout(() => setShowSaved(false), 2000)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleNext() {
    if (annotation.isDirty) await doSave()
    goNext(clipId)
  }

  function handlePrev() {
    if (annotation.isDirty) {
      if (!window.confirm('You have unsaved changes. Leave without saving?')) return
    }
    goPrev(clipId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-sm font-semibold text-gray-700 truncate">{clip?.name ?? clipId}</h1>
        {annotation.isDirty && (
          <span className="text-xs text-amber-500 font-medium">Unsaved changes</span>
        )}
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col gap-5">
        <ClipPlayer url={clip?.url} />

        <FlagControls
          flags={annotation.flags}
          onToggleFlag={annotation.toggleFlag}
        />

        <TranscriptEditor
          transcript={clip?.transcript ?? ''}
          corrections={annotation.corrections}
          onAdd={annotation.addCorrection}
          onRemove={annotation.removeCorrection}
        />

        <DiffPanel
          transcript={clip?.transcript ?? ''}
          corrections={annotation.corrections}
          flags={annotation.flags}
        />

        <NavControls
          isDirty={annotation.isDirty}
          saving={saving}
          saveError={saveError}
          showSaved={showSaved}
          hasPrev={hasPrev(clipId)}
          hasNext={hasNext(clipId)}
          onSave={doSave}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  )
}
