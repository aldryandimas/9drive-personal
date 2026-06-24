import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { HardDrive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetUrl, setResetUrl] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch<{ message: string; resetUrl?: string }>('/auth/forgot-password', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
      if (data.resetUrl) setResetUrl(data.resetUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <HardDrive className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Forgot Password</h1>
            <p className="text-sm text-slate-500">We'll send you a reset link.</p>
          </div>
        </div>

        {submitted ? (
          <div className="mt-6 grid gap-4">
            <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
              Reset link created. Use the link below to set a new password.
            </p>
            {resetUrl ? (
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Reset Link</p>
                <Link className="break-all text-sm font-bold text-blue-600 hover:underline" to={resetUrl.replace(window.location.origin, '')}>
                  {resetUrl}
                </Link>
              </div>
            ) : null}
            <Link to="/login">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}
            <Button disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
            <p className="text-center text-sm text-slate-500">
              Remember your password?{' '}
              <Link className="font-bold text-blue-600" to="/login">Login</Link>
            </p>
          </form>
        )}
      </Card>
    </main>
  )
}
