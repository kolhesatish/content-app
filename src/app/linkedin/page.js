import Navigation from '@/components/ui/navigation'
import Footer from '@/components/ui/footer'
import LinkedInPage from '@/components/pages/linkedin'

export const metadata = {
  title: 'LinkedIn Content Generator - ContentCraft',
  description: 'Create professional LinkedIn posts that engage your network and establish thought leadership in your industry.',
}

export default function LinkedIn() {
  return (
    <>
      <Navigation />
      <LinkedInPage />
      <Footer />
    </>
  )
}