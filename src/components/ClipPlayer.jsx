import { useRef, useState } from 'react'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5]

export default function ClipPlayer({ url }) {
  const mediaRef = useRef(null)
  const [speed, setSpeed] = useState(1)

  function handleSpeed(s) {
    setSpeed(s)
    if (mediaRef.current) mediaRef.current.playbackRate = s
  }

  const isVideo = url && /\.(mp4|webm|mov)(\?|$)/i.test(url)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      {url ? (
        isVideo ? (
          <video ref={mediaRef} src={url} controls className="w-full rounded-lg max-h-64 bg-black" />
        ) : (
          <audio ref={mediaRef} src={url} controls className="w-full" />
        )
      ) : (
        <div className="h-12 flex items-center justify-center text-sm text-gray-300 border border-dashed border-gray-200 rounded-lg">
          No audio file
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400 mr-0.5">Speed</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => handleSpeed(s)}
            className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
              speed === s ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  )
}
