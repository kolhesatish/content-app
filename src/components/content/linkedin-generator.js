'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { AuthModal } from '@/components/auth/auth-modal'

export default function LinkedInGenerator() {
  const { toast } = useToast()
  const { user, getToken, updateCredits } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    style: 'professional'
  })
  const [generatedContent, setGeneratedContent] = useState(null)

  const generateMutation = useMutation({
    mutationFn: async (data) => {
      const token = getToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch('/api/content/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate content')
      }
      
      return result
    },
    onSuccess: (data) => {
      setGeneratedContent(data)
      if (data.creditsRemaining !== undefined) {
        updateCredits(data.creditsRemaining)
      }
      toast({
        title: 'Content Generated!',
        description: `Successfully created LinkedIn content. Credits remaining: ${data.creditsRemaining}`,
      })
    },
    onError: (error) => {
      if (error.message === 'Authentication required') {
        setIsAuthModalOpen(true)
        return
      }
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate content. Please try again.',
        variant: 'destructive',
      })
    }
  })

  const handleGenerate = () => {
    console.log('🎯 Generate clicked, user:', user)
    if (!user) {
      console.log('❌ No user, showing auth modal')
      setIsAuthModalOpen(true)
      return
    }

    if (!formData.topic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic for your LinkedIn post.',
        variant: 'destructive',
      })
      return
    }

    if (user.credits <= 0) {
      toast({
        title: 'No Credits',
        description: 'You need credits to generate content. You get 2 free credits daily!',
        variant: 'destructive',
      })
      return
    }

    generateMutation.mutate({
      topic: formData.topic,
      style: formData.style
    })
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copied!',
        description: 'Content copied to clipboard.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy content.',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({ topic: '', style: 'professional' })
    setGeneratedContent(null)
  }

  const regenerate = () => {
    handleGenerate()
  }

  const styles = [
    { value: 'professional', label: 'Professional' },
    { value: 'story', label: 'Story-driven' },
    { value: 'insights', label: 'Insights' },
    { value: 'question', label: 'Question' }
  ]

  return (
    <div className="animate-slide-up">
      <div className="glass-card rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">What would you like to post about?</h2>
        
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-3">Topic or idea for your LinkedIn post</label>
            <Textarea
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-400 focus:border-primary focus:outline-none resize-none"
              rows={4}
              placeholder="e.g., Lessons learned from a failed project, Industry trends in 2024, Team management insights, Career advice..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Post style (optional)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {styles.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFormData(prev => ({ ...prev, style: value }))}
                  className={`style-card glass px-3 py-2 rounded-lg text-sm text-center transition-colors ${
                    formData.style === value ? "selected border-primary bg-primary/10" : ""
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !formData.topic.trim()}
          className="w-full gradient-bg py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          {generateMutation.isPending ? (
            <>
              <RefreshCw className="mr-2 animate-spin" size={16} />
              Generating...
            </>
          ) : (
            "Generate LinkedIn Post"
          )}
        </Button>
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="space-y-6">
          {/* Generated Post */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Generated LinkedIn Post</h3>
              <Button
                onClick={regenerate}
                disabled={generateMutation.isPending}
                variant="ghost"
                className="text-primary hover:text-purple-400 transition-colors"
              >
                <RefreshCw className="mr-2" size={16} />
                Regenerate
              </Button>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 mb-4">
              <p className="leading-relaxed whitespace-pre-line">
                {generatedContent.post}
              </p>
            </div>
            <Button
              onClick={() => copyToClipboard(generatedContent.post)}
              variant="ghost"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Copy className="mr-2" size={16} />
              Copy Post
            </Button>
          </div>

          {/* Generated Hashtags */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Suggested Hashtags</h3>
              <span className="text-sm text-gray-400">{generatedContent.hashtags?.length || 0} hashtags</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {generatedContent.hashtags?.map((hashtag, index) => (
                <span
                  key={index}
                  onClick={() => copyToClipboard(hashtag)}
                  className="hashtag-tag bg-primary/20 text-primary px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-primary/30 transition-colors"
                >
                  {hashtag}
                </span>
              ))}
            </div>
            <Button
              onClick={() => copyToClipboard(generatedContent.hashtags?.join(' ') || '')}
              variant="ghost"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Copy className="mr-2" size={16} />
              Copy All Hashtags
            </Button>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={resetForm}
              variant="outline"
              className="flex-1 glass py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Create New Post
            </Button>
            <Button className="flex-1 gradient-bg py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Save Content
            </Button>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => {
          setIsAuthModalOpen(false)
          // The useAuth hook will automatically update the user state
        }}
      />
    </div>
  )
}