export default function SurpriseEvent({ event }) {
  if (!event) return null
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 flex items-center overflow-hidden"
      aria-hidden="true"
    >
      <div className={event.dir === 'rtl' ? 'surprise-rtl' : 'surprise-ltr'}>
        <span className="flex items-center gap-2 text-7xl drop-shadow-lg">
          {event.emoji}
          {event.text && (
            <span className="text-3xl font-black text-white drop-shadow">{event.text}</span>
          )}
        </span>
      </div>
    </div>
  )
}
