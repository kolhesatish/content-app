import { Link } from "wouter";
import { Instagram, Linkedin, CheckCircle, Zap, Brain, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto text-center relative animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Create Viral Content with{" "}
            <span className="gradient-text">AI Magic</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Generate engaging Instagram posts, LinkedIn content, and social media captions in seconds.
            Powered by advanced AI to boost your social presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/instagram">
              <button className="gradient-bg px-8 py-4 rounded-xl text-white font-semibold text-lg hover:scale-105 transition-transform">
                Start Creating Now
              </button>
            </Link>
            <button className="glass px-8 py-4 rounded-xl text-white font-semibold text-lg hover:scale-105 transition-transform">
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Demo
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">10K+</div>
              <div className="text-gray-400">Content Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">500+</div>
              <div className="text-gray-400">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">99%</div>
              <div className="text-gray-400">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Platform</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Select the social media platform you want to create content for and let our AI do the magic.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Instagram Tool Card */}
            <Link href="/instagram">
              <div className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform cursor-pointer group">
                <div className="text-center">
                  <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Instagram className="text-3xl text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Instagram Content Generator</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Create engaging posts, reels, and stories with AI-powered captions, hashtags, and creative ideas.
                  </p>
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center text-sm text-gray-400">
                      <CheckCircle className="text-emerald-500 mr-2" size={16} />
                      Posts, Reels & Stories
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <CheckCircle className="text-emerald-500 mr-2" size={16} />
                      AI-Generated Captions
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <CheckCircle className="text-emerald-500 mr-2" size={16} />
                      Trending Hashtags
                    </div>
                  </div>
                  <button className="w-full gradient-bg py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                    Generate Instagram Content
                  </button>
                </div>
              </div>
            </Link>

            {/* LinkedIn Tool Card */}
            <Link href="/linkedin">
              <div className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform cursor-pointer group">
                <div className="text-center">
                  <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Linkedin className="text-3xl text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">LinkedIn Content Generator</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Craft professional LinkedIn posts that engage your network and boost your personal brand.
                  </p>
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center text-sm text-gray-400">
                      <CheckCircle className="text-emerald-500 mr-2" size={16} />
                      Professional Posts
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <CheckCircle className="text-emerald-500 mr-2" size={16} />
                      Industry Insights
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <CheckCircle className="text-emerald-500 mr-2" size={16} />
                      Relevant Hashtags
                    </div>
                  </div>
                  <button className="w-full gradient-bg py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                    Generate LinkedIn Content
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose ContentCraft?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform makes content creation effortless and effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="text-2xl text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-300">Generate high-quality content in seconds, not hours.</p>
            </div>
            
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="text-2xl text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered</h3>
              <p className="text-gray-300">Advanced algorithms ensure engaging and relevant content.</p>
            </div>
            
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-2xl text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Results Driven</h3>
              <p className="text-gray-300">Optimize for engagement and reach on every platform.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
