import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function authHeaders() {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useCollections() {
  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const res = await fetch('/api/collections', { headers: { ...authHeaders() } })
      if (!res.ok) throw new Error('Failed to load collections')
      const data = await res.json()
      return data.collections
    },
  })

  const createCollection = useMutation({
    mutationFn: async ({ name, description }) => {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ name, description }),
      })
      if (!res.ok) throw new Error('Failed to create collection')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collections'] }),
  })

  const updateCollection = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await fetch(`/api/collections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update collection')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collections'] }),
  })

  const deleteCollection = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
      })
      if (!res.ok) throw new Error('Failed to delete collection')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collections'] }),
  })

  return { ...listQuery, createCollection, updateCollection, deleteCollection }
}


