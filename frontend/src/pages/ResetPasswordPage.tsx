import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { HardDrive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ token, password }),
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <Card className="w-full max-w-md p-6 text-center">
          <p className="text-sm text-red-600">Invalid or missing reset token.</p>
          <Link className="mt-4 inline-block font-bold text-blue-600" to="/forgot-password">Request a new link</Link>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <HardDrive className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Reset Password</h1>
            <p className="text-sm text-slate-500">Enter your new password below.</p>
          </div>
        </div>

        {success ? (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            Password reset! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">
              New Password
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Confirm Password
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={8}
                required
              />
            </label>
            {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}
            <Button disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</Button>
            <p className="text-center text-sm text-slate-500">
              <Link className="font-bold text-blue-600" to="/login">Back to Login</Link>
            </p>
          </form>
        )}
      </Card>
    </main>
  )
}
