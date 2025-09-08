import { useMutation, useQueryClient } from '@tanstack/react-query'

function authHeaders() {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function usePreferences() {
  const queryClient = useQueryClient()

  const update = useMutation({
    mutationFn: async (preferences) => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ preferences }),
      })
      if (!res.ok) throw new Error('Failed to update preferences')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const toggleTopic = async (topic, muted = false) => {
    const profile = queryClient.getQueryData(['profile'])
    const prefs = profile?.preferences || { topics: [], creators: [], formats: [], mutedTopics: [] }
    const setKey = muted ? 'mutedTopics' : 'topics'
    const list = new Set(prefs[setKey] || [])
    if (list.has(topic)) list.delete(topic)
    else list.add(topic)
    const next = { ...prefs, [setKey]: Array.from(list) }
    await update.mutateAsync(next)
  }

  const toggleCreator = async (creatorId) => {
    const profile = queryClient.getQueryData(['profile'])
    const prefs = profile?.preferences || { topics: [], creators: [], formats: [], mutedTopics: [] }
    const list = new Set(prefs.creators || [])
    if (list.has(creatorId)) list.delete(creatorId)
    else list.add(creatorId)
    const next = { ...prefs, creators: Array.from(list) }
    await update.mutateAsync(next)
  }

  return { update, toggleTopic, toggleCreator }
}


