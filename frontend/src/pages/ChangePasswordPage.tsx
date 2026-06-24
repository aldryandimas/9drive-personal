import { useState, type FormEvent } from 'react'
import { KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'

export function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (newPassword !== confirm) {
      setError('New passwords do not match.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg pt-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
          <KeyRound className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Reset Password</h1>
          <p className="text-sm text-slate-500">Update your account password.</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="grid gap-2 text-sm font-semibold">
          Current Password
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          New Password
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Confirm New Password
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={8}
            required
          />
        </label>
        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}
        {success ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">Password updated successfully.</p> : null}
        <Button disabled={loading} className="mt-2">
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  )
}
