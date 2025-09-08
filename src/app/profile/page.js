'use client'

import Navigation from '@/components/ui/navigation'
import Footer from '@/components/ui/footer'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/useProfile'
import { usePreferences } from '@/hooks/usePreferences'
import { useCollections } from '@/hooks/useCollections'
import { useReadLater } from '@/hooks/useReadLater'
import Link from 'next/link'

export default function ProfilePage() {
  const { user } = useAuth()
  const { data: profile } = useProfile()
  const { toggleTopic, toggleCreator } = usePreferences()
  const { data: collections } = useCollections()
  const { data: readLater } = useReadLater()

  return (
    <>
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

        {!user ? (
          <p className="text-gray-400">Please log in to view your profile.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="md:col-span-1 glass-card p-6 rounded-xl space-y-2">
              <h2 className="text-lg font-semibold">Account</h2>
              <p className="text-gray-300">{user.username}</p>
              <p className="text-gray-400 text-sm">Credits: {user.credits || 0}</p>
              {profile && profile.displayName && (
                <p className="text-gray-400 text-sm">Display name: {profile.displayName}</p>
              )}
            </section>

            <section className="md:col-span-2 glass-card p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Your Collections</h2>
              {collections && collections.length > 0 ? (
                <div className="space-y-4">
                  {collections.map((c) => (
                    <div key={c._id} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{c.name}</h3>
                          {c.description && <p className="text-gray-400 text-sm">{c.description}</p>}
                        </div>
                        <span className="text-sm text-gray-400">{(c.items || []).length} items</span>
                      </div>
                      {(c.items || []).length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {c.items.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-center justify-between">
                              <span className="truncate mr-2">{item.title || item.contentId}</span>
                              {item.url && (
                                <Link className="text-primary hover:underline" href={item.url} target="_blank">Open</Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No collections yet. Use "Save to Collection" on content.</p>
              )}
            </section>

            <section className="md:col-span-3 glass-card p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Read Later</h2>
            <section className="md:col-span-3 glass-card p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Preferences</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Followed Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.preferences?.topics || []).map((t, i) => (
                      <button key={i} onClick={() => toggleTopic(t, false)} className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs">{t} ✕</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Muted Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.preferences?.mutedTopics || []).map((t, i) => (
                      <button key={i} onClick={() => toggleTopic(t, true)} className="bg-gray-700 text-gray-200 px-2 py-1 rounded-full text-xs">{t} ✕</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Followed Creators</h3>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.preferences?.creators || []).map((c, i) => (
                      <button key={i} onClick={() => toggleCreator(c)} className="bg-blue-800/40 text-blue-200 px-2 py-1 rounded-full text-xs">{String(c).slice(-6)} ✕</button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
              {readLater && readLater.length > 0 ? (
                <ul className="space-y-2">
                  {readLater.map((item, idx) => (
                    <li key={idx} className="text-sm flex items-center justify-between">
                      <span className="truncate mr-2">{item.title || item.contentId}</span>
                      {item.url && (
                        <Link className="text-primary hover:underline" href={item.url} target="_blank">Open</Link>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Empty. Add items via "Read Later" buttons.</p>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}


