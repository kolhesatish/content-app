'use client'

import Navigation from '@/components/ui/navigation'
import Footer from '@/components/ui/footer'
import { useState } from 'react'
import { usePreferences } from '@/hooks/usePreferences'
import { useProfile } from '@/hooks/useProfile'

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [topic, setTopic] = useState('')
  const [recency, setRecency] = useState('0')
  const [minLen, setMinLen] = useState('0')
  const [maxLen, setMaxLen] = useState('0')
  const [results, setResults] = useState([])
  const [meta, setMeta] = useState({ total: 0, facets: { type: [], topics: [] }, page: 1, pageSize: 20 })
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('new')
  const [loading, setLoading] = useState(false)
  const { toggleTopic, toggleCreator } = usePreferences()
  const { data: profile } = useProfile()

  const run = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (type) params.set('type', type)
      if (topic) params.set('topic', topic)
      if (recency && recency !== '0') params.set('recency', recency)
      if (minLen && minLen !== '0') params.set('minLen', minLen)
      if (maxLen && maxLen !== '0') params.set('maxLen', maxLen)
      params.set('page', String(page))
      params.set('pageSize', '20')
      params.set('sort', sort)
      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      setResults(data.results || [])
      setMeta({ total: data.total || 0, facets: data.facets || { type: [], topics: [] }, page: data.page || 1, pageSize: data.pageSize || 20 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Search</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="glass-card p-4 rounded-xl space-y-4">
            <div>
              <label className="text-sm text-gray-400">Query</label>
              <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded p-2">
                <option value="">Any</option>
                <option value="post">Post</option>
                <option value="reel">Reel</option>
                <option value="story">Story</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400">Sort</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded p-2">
                <option value="new">Newest</option>
                <option value="short">Shortest</option>
                <option value="long">Longest</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400">Topic</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded p-2" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-400">Min Len</label>
                <input value={minLen} onChange={(e) => setMinLen(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded p-2" />
              </div>
              <div>
                <label className="text-sm text-gray-400">Max Len</label>
                <input value={maxLen} onChange={(e) => setMaxLen(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded p-2" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">Recency (days)</label>
              <input value={recency} onChange={(e) => setRecency(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded p-2" />
            </div>
            <button onClick={run} disabled={loading} className="w-full gradient-bg py-2 rounded font-semibold">
              {loading ? 'Searching...' : 'Search'}
            </button>
            <div className="pt-2 text-xs text-gray-400">
              Facet counts:
              <div className="space-y-1 mt-1">
                {meta.facets.type.map((t) => (
                  <div key={t.value} className="flex justify-between">
                    <span>{t.value}</span>
                    <span>{t.count}</span>
                  </div>
                ))}
                {meta.facets.topics && meta.facets.topics.length > 0 && (
                  <div className="mt-2">
                    <div className="mb-1">Top topics</div>
                    {meta.facets.topics.map((t) => (
                      <button key={t.value} onClick={() => setTopic(t.value)} className="mr-2 mb-2 bg-gray-800 px-2 py-1 rounded text-gray-300 hover:bg-gray-700 text-xs">
                        {t.value} ({t.count})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          <section className="md:col-span-3 space-y-3">
            {results.length === 0 ? (
              <p className="text-gray-400">No results yet. Try searching.</p>
            ) : (
              results.map((r, i) => (
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
              ))
            )}
            <div className="flex items-center justify-between pt-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="px-3 py-1 rounded bg-gray-800 disabled:opacity-50">Prev</button>
              <div className="text-xs text-gray-400">Page {page} · {meta.total} results</div>
              <button onClick={() => setPage(page + 1)} disabled={page * meta.pageSize >= meta.total} className="px-3 py-1 rounded bg-gray-800 disabled:opacity-50">Next</button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}


