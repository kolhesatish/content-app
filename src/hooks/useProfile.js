import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function authHeaders() {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useProfile() {
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch('/api/profile', { headers: { ...authHeaders() } })
      if (!res.ok) throw new Error('Failed to load profile')
      const data = await res.json()
      return data.profile
    },
  })

  const updateProfile = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  })

  return { ...profileQuery, updateProfile }
}


