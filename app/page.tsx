import HomeShell from '@/components/home/HomeShell'
import BrandHero from '@/components/hero/BrandHero'
import { BuiltPanel } from '@/components/intro/BuiltPanel'
import { IntroSlider } from '@/components/intro/IntroSlider'
import { WhoWeArePanel } from '@/components/intro/WhoWeArePanel'
import { WorkTogetherPanel } from '@/components/intro/WorkTogetherPanel'
import Footer from '@/components/layout/Footer'
import AboutSection from '@/components/sections/AboutSection'
import CallToActionSection from '@/components/sections/CallToActionSection'
import ProblemSection from '@/components/sections/ProblemSection'
import ProcessSection from '@/components/sections/ProcessSection'
import SolutionsSection from '@/components/sections/SolutionsSection'
import TechnologySection from '@/components/sections/TechnologySection'
import ScrollingStrip from '@/components/ui/ScrollingStrip'
import { SelectedWork } from '@/components/work/SelectedWork'
import { featuredProjects } from '@/lib/featured-projects'
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
        <BrandHero />
        <IntroSlider>
          <WhoWeArePanel businessArms={businessArms} />
          <BuiltPanel projects={featuredProjects(apps, websites, works)} />
          <WorkTogetherPanel companyDetails={companyDetails} />
        </IntroSlider>
        <ScrollingStrip items={marqueeItems} />
        <ProblemSection />
        <SolutionsSection />
        <SelectedWork projects={[...apps, ...websites, ...works]} />
        <ProcessSection steps={processSteps} />
        <TechnologySection technologies={technologies} />
        <AboutSection businessArms={businessArms} />
        <CallToActionSection />
      </main>
      <Footer products={[...apps, ...websites]} socialLinks={socialLinks} companyDetails={companyDetails} />
    </HomeShell>
  )
}
