'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Image, Video, Zap, Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { AuthModal } from '@/components/auth/auth-modal'

export default function InstagramGenerator() {
  const { toast } = useToast()
  const { user, getToken, updateCredits } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    contentType: 'post',
    topic: '',
    captionPreference: 'yes',
    styles: []
  })
  const [generatedContent, setGeneratedContent] = useState(null)

  const generateMutation = useMutation({
    mutationFn: async (data) => {
      const token = getToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch('/api/content/instagram', {
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
      setCurrentStep(3)
      if (data.creditsRemaining !== undefined) {
        updateCredits(data.creditsRemaining)
      }
      toast({
        title: 'Content Generated!',
        description: `Successfully created ${formData.contentType} content. Credits remaining: ${data.creditsRemaining}`,
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

  const handleContentTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, contentType: type }))
  }

  const handleStyleToggle = (style) => {
    setFormData(prev => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter(s => s !== style)
        : [...prev.styles, style]
    }))
  }

  const handleGenerate = () => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    if (!formData.topic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic for your content.',
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
      contentType: formData.contentType,
      options: {
        captionPreference: formData.captionPreference,
        styles: formData.styles
      }
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
    setCurrentStep(1)
    setFormData({
      contentType: 'post',
      topic: '',
      captionPreference: 'yes',
      styles: []
    })
    setGeneratedContent(null)
  }

  const regenerate = () => {
    handleGenerate()
  }

  return (
    <div className="animate-slide-up">
      {/* Progress Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                step <= currentStep
                  ? "bg-primary text-white"
                  : "bg-gray-600 text-gray-400"
              }`}>
                {step}
              </div>
              <span className={`ml-2 text-sm font-medium transition-colors ${
                step <= currentStep ? "text-white" : "text-gray-400"
              }`}>
                {step === 1 ? "Content Type" : step === 2 ? "Options" : "Generate"}
              </span>
              {step < 3 && <div className="w-8 h-0.5 bg-gray-600 ml-4"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Content Type Selection */}
      {currentStep === 1 && (
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">What type of content do you want to create?</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { type: 'post', icon: Image, title: 'Post', description: 'Static image posts with captions' },
              { type: 'reel', icon: Video, title: 'Reel', description: 'Short-form video content' },
              { type: 'story', icon: Zap, title: 'Story', description: '24-hour disappearing content' }
            ].map(({ type, icon: Icon, title, description }) => (
              <div
                key={type}
                onClick={() => handleContentTypeSelect(type)}
                className={`content-type-card glass p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform ${
                  formData.contentType === type ? "selected border-primary bg-primary/10" : ""
                }`}
              >
                <div className="text-center">
                  <Icon className="text-3xl text-primary mb-4 mx-auto" size={48} />
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">What's your topic or idea?</label>
            <Textarea
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-400 focus:border-primary focus:outline-none resize-none"
              rows={3}
              placeholder="e.g., Tips for morning productivity, Behind the scenes of my workspace, Recipe for healthy smoothie..."
            />
          </div>

          <Button
            onClick={() => setCurrentStep(2)}
            className="w-full gradient-bg py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            disabled={!formData.topic.trim()}
          >
            Continue to Options
          </Button>
        </div>
      )}

      {/* Step 2: Content Options */}
      {currentStep === 2 && (
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Customize your content</h2>
          
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-3">Do you want a caption?</label>
              <div className="flex gap-4">
                {[
                  { value: 'yes', label: 'Yes, generate a caption' },
                  { value: 'no', label: 'No caption needed' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFormData(prev => ({ ...prev, captionPreference: value }))}
                    className={`option-card glass px-4 py-2 rounded-lg transition-colors ${
                      formData.captionPreference === value ? "selected border-primary bg-primary/10" : ""
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {formData.captionPreference === 'yes' && (
              <div>
                <label className="block text-sm font-medium mb-3">Caption style preferences:</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['emojis', 'engaging', 'professional', 'funny', 'inspirational', 'casual'].map((style) => (
                    <button
                      key={style}
                      onClick={() => handleStyleToggle(style)}
                      className={`style-card glass px-3 py-2 rounded-lg text-sm transition-colors ${
                        formData.styles.includes(style) ? "selected border-primary bg-primary/10" : ""
                      }`}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="outline"
              className="flex-1 glass py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Back
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="flex-1 gradient-bg py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              {generateMutation.isPending ? "Generating..." : "Generate Content"}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Generated Content */}
      {currentStep === 3 && generatedContent && generatedContent.variations && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Generated Instagram Content Variations</h3>
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
                    {variation.style && (
                      <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">
                        {variation.style}
                      </span>
                    )}
                  </div>
                  
                  {formData.captionPreference === 'yes' && (
                    <div>
                      <label className="text-sm font-medium text-gray-400 mb-2 block">Caption</label>
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
                        Copy Caption
                      </Button>
                    </div>
                  )}

                  {formData.contentType !== 'story' && variation.hashtags && variation.hashtags.length > 0 && (
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
                    onClick={() => copyToClipboard(`${variation.caption}${formData.contentType !== 'story' && variation.hashtags ? '\n\n' + variation.hashtags.join(' ') : ''}`)}
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
                Create New Content
              </Button>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}