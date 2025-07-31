import { Instagram } from 'lucide-react'
import InstagramGenerator from '@/components/content/instagram-generator'

export default function InstagramPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Instagram className="text-4xl text-white" size={48} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Instagram Content <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create viral Instagram content with AI-powered captions, hashtags, and creative ideas tailored for maximum engagement.
          </p>
        </div>
      </section>

      {/* Content Generation Tool */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <InstagramGenerator />
        </div>
      </section>
    </div>
  )
}