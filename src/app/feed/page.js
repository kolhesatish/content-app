'use client'

import Navigation from '@/components/ui/navigation'
import Footer from '@/components/ui/footer'
import { useEffect, useState } from 'react'
import { usePreferences } from '@/hooks/usePreferences'
import { useProfile } from '@/hooks/useProfile'

export default function FeedPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { toggleTopic, toggleCreator } = usePreferences()
  const { data: profile } = useProfile()

  useEffect(() => {
    const run = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const res = await fetch('/api/content-feed', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!res.ok) throw new Error('Failed to load feed')
        const data = await res.json()
        setResults(data.results || [])
      } catch (e) {
        setError('Please login to view your feed or try again later.')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <>
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : results.length === 0 ? (
          <p className="text-gray-400">Your feed is empty. Generate content or set preferences.</p>
        ) : (
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="glass-card p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">{r.platform} · {r.type} · {new Date(r.createdAt).toLocaleString()}</div>
                  {r.topic && <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{r.topic}</div>}
                </div>
                {(r.creatorName || r.creatorId) && (
                  <div className="mt-1 text-xs text-gray-400">by {r.creatorName || String(r.creatorId).slice(-6)}</div>
                )}
                <p className="mt-2 whitespace-pre-wrap">{r.caption}</p>
                {r.hashtags && r.hashtags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {r.hashtags.map((h, idx) => (
                      <span key={idx} className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs">{h}</span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  {r.topic && (
                    <button onClick={() => toggleTopic(r.topic, false)} className="px-3 py-1 text-xs rounded bg-gray-800 hover:bg-gray-700">Follow topic</button>
                  )}
                  {r.topic && (
                    <button onClick={() => toggleTopic(r.topic, true)} className="px-3 py-1 text-xs rounded bg-gray-800 hover:bg-gray-700">Mute topic</button>
                  )}
                  {(r.creatorId) && (
                    <button
                      onClick={() => toggleCreator(r.creatorId)}
                      className="px-3 py-1 text-xs rounded bg-gray-800 hover:bg-gray-700"
                    >
                      {profile?.preferences?.creators?.includes(r.creatorId) ? 'Unfollow creator' : 'Follow creator'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}


