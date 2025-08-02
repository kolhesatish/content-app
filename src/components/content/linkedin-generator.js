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
    style: 'professional',
    variations: 5
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
      // Extract the content.variations from the API response
      setGeneratedContent(data.content)
      if (data.creditsRemaining !== undefined) {
        updateCredits(data.creditsRemaining)
      }
      toast({
        title: 'Content Generated!',
        description: `Successfully created ${data.content.variations ? data.content.variations.length : 1} LinkedIn content variations. Credits remaining: ${data.creditsRemaining}`,
        duration: 3000,
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
        duration: 3000,
      })
    }
  })

  const handleGenerate = () => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    if (!formData.topic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic for your LinkedIn post.',
        variant: 'destructive',
        duration: 3000,
      })
      return
    }

    if (user.credits <= 0) {
      toast({
        title: 'No Credits',
        description: 'You need credits to generate content. You get 2 free credits daily!',
        variant: 'destructive',
        duration: 3000,
      })
      return
    }

    generateMutation.mutate({
      topic: formData.topic,
      style: formData.style,
      variations: formData.variations
    })
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copied!',
        description: 'Content copied to clipboard.',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy content.',
        variant: 'destructive',
        duration: 3000,
      })
    }
  }

  const resetForm = () => {
    setFormData({ topic: '', style: 'professional', variations: 5 })
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

          <div>
            <label className="block text-sm font-medium mb-3">Number of content variations</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => setFormData(prev => ({ ...prev, variations: num }))}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    formData.variations === num 
                      ? "bg-primary text-white" 
                      : "glass hover:bg-gray-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Choose how many different content options you want to generate</p>
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
      {generatedContent && generatedContent.variations && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Generated LinkedIn Content Variations</h3>
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
            
            <div className="space-y-6">
              {generatedContent.variations.map((variation, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Option {index + 1}</h4>
                    {variation.tone && (
                      <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">
                        {variation.tone}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Post Content</label>
                    <div className="bg-gray-900/50 p-4 rounded-lg border">
                      <p className="whitespace-pre-wrap leading-relaxed">{variation.caption}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(variation.caption)}
                      className="mt-2 text-sm text-gray-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Post
                    </Button>
                  </div>

                  {variation.hashtags && variation.hashtags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-400 mb-2 block">Hashtags ({variation.hashtags.length})</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {variation.hashtags.map((hashtag, hashIndex) => (
                          <span
                            key={hashIndex}
                            onClick={() => copyToClipboard(hashtag)}
                            className="bg-primary/20 text-primary px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-primary/30 transition-colors"
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(variation.hashtags.join(' '))}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All Hashtags
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`${variation.caption}\n\n${variation.hashtags?.join(' ') || ''}`)}
                    className="w-full mt-4"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Complete Post
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex-1 glass py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Create New Post
              </Button>
            </div>
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