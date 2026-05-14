import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AccessGate from './pages/AccessGate.jsx'
import ReviewQueue from './pages/ReviewQueue.jsx'
import AnnotationView from './pages/AnnotationView.jsx'
import { QueueProvider } from './context/QueueContext.jsx'
import { isAuthenticated } from './services/auth.js'

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <QueueProvider>
        <Routes>
          <Route path="/" element={<AccessGate />} />
          <Route
            path="/queue"
            element={
              <ProtectedRoute>
                <ReviewQueue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/annotate/:clipId"
            element={
              <ProtectedRoute>
                <AnnotationView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </QueueProvider>
    </BrowserRouter>
  )
}
