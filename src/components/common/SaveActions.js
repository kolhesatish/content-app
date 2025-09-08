import { Bookmark, ListPlus } from 'lucide-react'
import { useReadLater } from '@/hooks/useReadLater'
import { useCollections } from '@/hooks/useCollections'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function SaveActions({ contentId, title, url }) {
  const { add, remove, data: readLater } = useReadLater()
  const { data: collections, createCollection, updateCollection } = useCollections()
  const [adding, setAdding] = useState(false)

  const isInReadLater = (readLater || []).some((i) => i.contentId === contentId)

  const toggleReadLater = async () => {
    try {
      setAdding(true)
      if (isInReadLater) {
        await remove.mutateAsync(contentId)
      } else {
        await add.mutateAsync({ contentId, title, url })
      }
    } finally {
      setAdding(false)
    }
  }

  const saveToQuickCollection = async () => {
    const defaultName = 'My Collection'
    let target = (collections || []).find((c) => c.name === defaultName)
    if (!target) {
      const created = await createCollection.mutateAsync({ name: defaultName })
      target = created.collection
    }
    const items = Array.isArray(target.items) ? target.items.slice() : []
    if (!items.find((i) => i.contentId === contentId)) {
      items.push({ contentId, title, url, addedAt: new Date().toISOString() })
      await updateCollection.mutateAsync({ id: target._id, items })
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" onClick={toggleReadLater} disabled={adding || add.isPending || remove.isPending}>
        <Bookmark className="w-4 h-4 mr-2" />
        {isInReadLater ? 'Remove from Queue' : 'Read Later'}
      </Button>
      <Button size="sm" variant="outline" onClick={saveToQuickCollection} disabled={createCollection.isPending || updateCollection.isPending}>
        <ListPlus className="w-4 h-4 mr-2" />
        Save to Collection
      </Button>
    </div>
  )
}


