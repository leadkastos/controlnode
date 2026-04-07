import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://controlnode.vercel.app/reset-password'
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSent(true); setLoading(false) }
  }

  if (sent) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-gray-400 text-sm mb-6">We sent a password reset link to <span className="text-yellow-500">{email}</span></p>
          <Link to="/login" className="text-yellow-500 hover:text-yellow-400 text-sm">Back to sign in</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">ControlNode</h1>
          <p className="text-gray-400 mt-2">Reset your password</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          {error && <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors" placeholder="you@example.com" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            <Link to="/login" className="text-yellow-500 hover:text-yellow-400">Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
