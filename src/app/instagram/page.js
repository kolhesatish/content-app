import Navigation from '@/components/ui/navigation'
import Footer from '@/components/ui/footer'
import InstagramPage from '@/components/pages/instagram'

export const metadata = {
  title: 'Instagram Content Generator - ContentCraft',
  description: 'Create viral Instagram content with AI-powered captions, hashtags, and creative ideas tailored for maximum engagement.',
}

export default function Instagram() {
  return (
    <>
      <Navigation />
      <InstagramPage />
      <Footer />
    </>
  )
}