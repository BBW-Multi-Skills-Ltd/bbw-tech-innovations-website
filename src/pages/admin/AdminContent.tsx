import type { ReturnTypeOfUseAdminData } from './adminTypes'
import type { AdminTab } from './adminTabConfig'
import BusinessArmsManager from './BusinessArmsManager'
import EnquiriesManager from './EnquiriesManager'
import MarqueeManager from './MarqueeManager'
import MusicManager from './MusicManager'
import ProjectManager from './ProjectManager'
import SocialLinksManager from './SocialLinksManager'
import TeamManager from './TeamManager'
import AdminDashboardHome from './AdminDashboardHome'
import AccountSettings from '../../features/auth/AccountSettings'
import type { AdminIdentity } from '../../features/auth/types'
import ProcessManager from './ProcessManager'
import TechnologyManager from './TechnologyManager'
import PrivacyPolicyManager from './PrivacyPolicyManager'
import CompanyDetailsManager from './CompanyDetailsManager'

const report = (task: Promise<void>, success: string, onSaved: (message: string) => void) => {
  void task.then(() => onSaved(success)).catch(error => onSaved(error instanceof Error ? error.message : 'Could not save. Check your connection and try again.'))
}

export default function AdminContent({ tab, data, onSaved, identity, onNavigate }: { tab: AdminTab; data: ReturnTypeOfUseAdminData; onSaved: (message: string) => void; identity: AdminIdentity; onNavigate: (tab: AdminTab) => void }) {
  if (tab === 'home') return <AdminDashboardHome identity={identity} apps={data.apps.length} websites={data.websites.length} works={data.works.length} onNavigate={onNavigate} />
  if (tab === 'account') return <AccountSettings identity={identity} />
  if (tab === 'team') return <TeamManager onSaved={onSaved} />
  if (tab === 'enquiries') return <EnquiriesManager onSaved={onSaved} />
  if (tab === 'apps') return <ProjectManager items={data.apps} type="app" isWork={false} onUpsert={project => report(data.persistProject(project), 'App saved to Supabase.', onSaved)} onDelete={id => report(data.deleteProject(id), 'App deleted.', onSaved)} />
  if (tab === 'websites') return <ProjectManager items={data.websites} type="website" isWork={false} onUpsert={project => report(data.persistProject(project), 'Website saved to Supabase.', onSaved)} onDelete={id => report(data.deleteProject(id), 'Website deleted.', onSaved)} />
  if (tab === 'works') return <ProjectManager items={data.works} type="website" isWork onUpsert={project => report(data.persistProject(project), 'Client work saved to Supabase.', onSaved)} onDelete={id => report(data.deleteProject(id), 'Client work deleted.', onSaved)} />
  if (tab === 'business-arms') return <BusinessArmsManager arms={data.businessArms} setArms={data.setBusinessArms} onSave={data.persistArms} onSaved={onSaved} />
  if (tab === 'marquee') return <MarqueeManager items={data.marqueeItems} setItems={data.setMarqueeItems} onSave={data.persistMarquee} onSaved={onSaved} />
  if (tab === 'social') return <SocialLinksManager links={data.socialLinks} setLinks={data.setSocialLinks} onSave={data.persistSocialLinks} onSaved={onSaved} />
  if (tab === 'process') return <ProcessManager steps={data.processSteps} setSteps={data.setProcessSteps} onSave={data.persistProcessSteps} onSaved={onSaved} />
  if (tab === 'technology') return <TechnologyManager items={data.technologies} setItems={data.setTechnologies} onSave={data.persistTechnologies} onSaved={onSaved} />
  if (tab === 'privacy') return <PrivacyPolicyManager value={data.privacyPolicy} setValue={data.setPrivacyPolicy} onSave={data.persistPrivacyPolicy} onSaved={onSaved} />
  if (tab === 'company') return <CompanyDetailsManager value={data.companyDetails} setValue={data.setCompanyDetails} onSave={data.persistCompanyDetails} onSaved={onSaved} />
  return <MusicManager value={data.musicUrl} onSave={data.persistMusic} onSaved={onSaved} />
}
