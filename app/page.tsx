import HomeShell from '@/components/home/HomeShell'
import HeroSection from '@/components/hero/HeroSection'
import Footer from '@/components/layout/Footer'
import AboutSection from '@/components/sections/AboutSection'
import CallToActionSection from '@/components/sections/CallToActionSection'
import ProblemSection from '@/components/sections/ProblemSection'
import ProcessSection from '@/components/sections/ProcessSection'
import ProductsSection from '@/components/sections/ProductsSection'
import SolutionsSection from '@/components/sections/SolutionsSection'
import TechnologySection from '@/components/sections/TechnologySection'
import WorkSection from '@/components/sections/WorkSection'
import ScrollingStrip from '@/components/ui/ScrollingStrip'
import { getSiteContent } from '@/lib/site-content'
import { SITE_URL } from '@/lib/site-url'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'BBW Tech Innovations',
      url: SITE_URL,
      logo: `${SITE_URL}/logos/bbwlogo.png`,
      description: 'BBW Tech Innovations builds digital products, software, and technology solutions for businesses and entrepreneurs.',
    },
    { '@type': 'WebSite', name: 'BBW Tech Innovations', url: SITE_URL },
  ],
}

export default async function HomePage() {
  const { apps, websites, works, businessArms, marqueeItems, musicUrl, socialLinks, processSteps, technologies, companyDetails } = await getSiteContent()

  return (
    <HomeShell musicUrl={musicUrl}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main>
        <HeroSection />
        <ScrollingStrip items={marqueeItems} />
        <ProblemSection />
        <SolutionsSection />
        <ProductsSection apps={apps} websites={websites} />
        <WorkSection works={works} />
        <ProcessSection steps={processSteps} />
        <TechnologySection technologies={technologies} />
        <AboutSection businessArms={businessArms} />
        <CallToActionSection />
      </main>
      <Footer products={[...apps, ...websites]} socialLinks={socialLinks} companyDetails={companyDetails} />
    </HomeShell>
  )
}
