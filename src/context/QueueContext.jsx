import { createContext, useContext, useState } from 'react'

const QueueContext = createContext({ queue: [], setQueue: () => {} })

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState([])
  return (
    <QueueContext.Provider value={{ queue, setQueue }}>
      {children}
    </QueueContext.Provider>
  )
}

export function useQueueContext() {
  return useContext(QueueContext)
}
