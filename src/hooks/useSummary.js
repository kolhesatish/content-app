import { useMutation } from '@tanstack/react-query'

function authHeaders() {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useSummary() {
  const summarize = useMutation({
    mutationFn: async ({ text, mode }) => {
      const res = await fetch('/api/summaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ text, mode }),
      })
      if (!res.ok) throw new Error('Failed to summarize')
      return res.json()
    },
  })

  return { summarize }
}


