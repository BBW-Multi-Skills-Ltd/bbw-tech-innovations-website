import { useCallback, useState } from 'react'
import type { Project } from '../data/projects'
import useSiteContent from '../hooks/useSiteContent'
import useTheme from '../hooks/useTheme'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ScrollingStrip from '../components/ui/ScrollingStrip'
import MusicPlayer from '../components/MusicPlayer'
import ContactForm from '../components/ContactForm'
import ProjectModal from '../components/ProjectModal'
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

export default function HomePage() {
  const { dark, toggleTheme } = useTheme()
  const { apps, websites, works, businessArms, marqueeItems } = useSiteContent()
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
        <ProcessSection />
        <TechnologySection />
        <AboutSection businessArms={businessArms} />
        <CallToActionSection onStartProject={openContact} />
      </main>
      <Footer products={[...apps, ...websites]} onStartProject={openContact} />
      <ProjectModal project={selectedProject} onClose={closeProject} />
      <ContactForm open={contactOpen} onClose={() => setContactOpen(false)} />
      <MusicPlayer />
    </div>
  )
}
