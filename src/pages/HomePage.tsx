import { lazy, Suspense, useCallback, useState } from 'react'
import type { Project } from '../data/projects'
import useSiteContent from '../hooks/useSiteContent'
import useTheme from '../hooks/useTheme'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ScrollingStrip from '../components/ui/ScrollingStrip'
import MusicPlayer from '../components/MusicPlayer'
import HeroSection from '../features/hero/HeroSection'
import ProblemSection from '../sections/ProblemSection'
import SolutionsSection from '../sections/SolutionsSection'
import ProductsSection from '../sections/ProductsSection'
import WorkSection from '../sections/WorkSection'
import ProcessSection from '../sections/ProcessSection'
import TechnologySection from '../sections/TechnologySection'
import AboutSection from '../sections/AboutSection'
import CallToActionSection from '../sections/CallToActionSection'
import { BG, FG } from '../styles/theme'

const ContactForm = lazy(() => import('../components/ContactForm'))
const ProjectModal = lazy(() => import('../components/ProjectModal'))

export default function HomePage() {
  const { dark, toggleTheme } = useTheme()
  const { apps, websites, works, businessArms, marqueeItems, musicUrl, socialLinks, processSteps, technologies, companyDetails } = useSiteContent()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const openProject = useCallback((project: Project) => setSelectedProject(project), [])
  const closeProject = useCallback(() => setSelectedProject(null), [])
  const openContact = useCallback(() => setContactOpen(true), [])

  return (
    <div style={{ backgroundColor: BG, color: FG, fontFamily: "'Outfit', system-ui, sans-serif" }}>
      <Header dark={dark} onToggleTheme={toggleTheme} onStartProject={openContact} />
      <main>
        <HeroSection dark={dark} onStartProject={openContact} />
        <ScrollingStrip items={marqueeItems} />
        <ProblemSection />
        <SolutionsSection />
        <ProductsSection apps={apps} websites={websites} onOpen={openProject} />
        <WorkSection works={works} onOpen={openProject} />
        <ProcessSection steps={processSteps} />
        <TechnologySection technologies={technologies} />
        <AboutSection businessArms={businessArms} />
        <CallToActionSection onStartProject={openContact} />
      </main>
      <Footer products={[...apps, ...websites]} socialLinks={socialLinks} companyDetails={companyDetails} onStartProject={openContact} />
      {selectedProject && <Suspense fallback={null}><ProjectModal project={selectedProject} onClose={closeProject} /></Suspense>}
      {contactOpen && <Suspense fallback={null}><ContactForm open={contactOpen} onClose={() => setContactOpen(false)} /></Suspense>}
      <MusicPlayer url={musicUrl} />
    </div>
  )
}
