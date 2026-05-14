import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateCode } from '../services/api.js'
import { isAuthenticated, setToken } from '../services/auth.js'

export default function AccessGate() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) navigate('/queue', { replace: true })
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      const result = await validateCode(code.trim())
      if (result.valid) {
        setToken(result.token)
        navigate('/queue', { replace: true })
      } else {
        setError('Invalid access code.')
        setCode('')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        <input
          type="password"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError('') }}
          placeholder="Enter your access code"
          autoFocus
          autoComplete="off"
          disabled={loading}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50"
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Checking…' : 'Continue'}
        </button>
      </form>
    </div>
  )
}
