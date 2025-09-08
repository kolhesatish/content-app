import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function authHeaders() {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useReadLater() {
  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: ['read-later'],
    queryFn: async () => {
      const res = await fetch('/api/read-later', { headers: { ...authHeaders() } })
      if (!res.ok) throw new Error('Failed to load read later')
      const data = await res.json()
      return data.items
    },
  })

  const add = useMutation({
    mutationFn: async (item) => {
      const res = await fetch('/api/read-later', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(item),
      })
      if (!res.ok) throw new Error('Failed to add to read later')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['read-later'] }),
  })

  const remove = useMutation({
    mutationFn: async (contentId) => {
      const res = await fetch(`/api/read-later?contentId=${encodeURIComponent(contentId)}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
      })
      if (!res.ok) throw new Error('Failed to remove from read later')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['read-later'] }),
  })

  return { ...listQuery, add, remove }
}


