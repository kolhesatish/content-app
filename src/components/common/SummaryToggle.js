import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSummary } from '@/hooks/useSummary'

export default function SummaryToggle({ text }) {
  const { summarize } = useSummary()
  const [mode, setMode] = useState('eli5')
  const [data, setData] = useState(null)

  const run = async (nextMode) => {
    const m = nextMode || mode
    const res = await summarize.mutateAsync({ text, mode: m })
    setData(res.summary)
    setMode(m)
  }

  return (
    <div className="mt-3 border border-gray-700 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <Button size="sm" variant={mode === 'eli5' ? 'default' : 'outline'} onClick={() => run('eli5')} disabled={summarize.isPending}>
            ELI5
          </Button>
          <Button size="sm" variant={mode === 'pro' ? 'default' : 'outline'} onClick={() => run('pro')} disabled={summarize.isPending}>
            Pro
          </Button>
        </div>
        <Button size="sm" variant="ghost" onClick={() => run()} disabled={summarize.isPending}>
          {summarize.isPending ? 'Summarizing...' : 'Summarize'}
        </Button>
      </div>
      {data && (
        <div className="text-sm space-y-2">
          {data.summary && <p className="text-gray-200">{data.summary}</p>}
          {Array.isArray(data.bullets) && data.bullets.length > 0 && (
            <ul className="list-disc list-inside text-gray-400">
              {data.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
          {data.action && <p className="text-primary">Next: {data.action}</p>}
        </div>
      )}
    </div>
  )
}


