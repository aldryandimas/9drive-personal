import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { FileIcon } from '@/components/drive/FileIcon'
import type { FileItem } from '@/data/drive-data'

const urlCache = new Map<string, string>()

export function FileThumbnail({ file, iconClassName }: { file: FileItem; iconClassName?: string }) {
  const [url, setUrl] = useState<string | null>(file.id ? urlCache.get(file.id) ?? null : null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (file.kind !== 'image' || !file.id || url || failed) return
    const fileId = file.id
    let cancelled = false
    apiFetch<{ url: string }>(`/files/${fileId}/preview-token`, { method: 'POST' })
      .then((data) => {
        if (cancelled) return
        urlCache.set(fileId, data.url)
        setUrl(data.url)
      })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [file.id, file.kind, url, failed])

  if (file.kind === 'image' && url && !failed) {
    return <img src={url} alt={file.name} loading="lazy" className="h-full w-full object-cover" onError={() => setFailed(true)} />
  }
  return <FileIcon kind={file.kind} className={iconClassName} />
}
