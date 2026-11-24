import type { ReturnTypeOfUseAdminData } from '@/components/admin/adminTypes'
import type { AdminTab } from '@/components/admin/adminTabConfig'
import BusinessArmsManager from '@/components/admin/BusinessArmsManager'
import EnquiriesManager from '@/components/admin/EnquiriesManager'
import MarqueeManager from '@/components/admin/MarqueeManager'
import ProjectManager from '@/components/admin/ProjectManager'
import SocialLinksManager from '@/components/admin/SocialLinksManager'
import TeamManager from '@/components/admin/TeamManager'
import AdminDashboardHome from '@/components/admin/AdminDashboardHome'
import AccountSettings from '@/components/auth/AccountSettings'
import type { AdminIdentity } from '@/components/auth/types'
import ProcessManager from '@/components/admin/ProcessManager'
import TechnologyManager from '@/components/admin/TechnologyManager'
import PrivacyPolicyManager from '@/components/admin/PrivacyPolicyManager'
import CompanyDetailsManager from '@/components/admin/CompanyDetailsManager'

const report = (task: Promise<void>, success: string, onSaved: (message: string) => void) => {
  void task.then(() => onSaved(success)).catch(error => onSaved(error instanceof Error ? error.message : 'Could not save. Check your connection and try again.'))
}

export default function AdminContent({ tab, data, onSaved, identity, onNavigate }: { tab: AdminTab; data: ReturnTypeOfUseAdminData; onSaved: (message: string) => void; identity: AdminIdentity; onNavigate: (tab: AdminTab) => void }) {
  if (tab === 'home') return <AdminDashboardHome identity={identity} apps={data.apps.length} websites={data.websites.length} works={data.works.length} onNavigate={onNavigate} />
  if (tab === 'account') return <AccountSettings identity={identity} />
  if (tab === 'team') return <TeamManager onSaved={onSaved} />
  if (tab === 'enquiries') return <EnquiriesManager onSaved={onSaved} />
  if (tab === 'apps') return <ProjectManager items={data.apps} type="app" isWork={false} onUpsert={project => report(data.persistProject(project), 'App saved to Supabase.', onSaved)} onToggleVisibility={project => report(data.persistProjectVisibility(project.id, project.isPublished === false), project.isPublished === false ? 'App is visible in the marketplace.' : 'App hidden from the marketplace.', onSaved)} onDelete={id => report(data.deleteProject(id), 'App deleted.', onSaved)} />
  if (tab === 'websites') return <ProjectManager items={data.websites} type="website" isWork={false} onUpsert={project => report(data.persistProject(project), 'Website saved to Supabase.', onSaved)} onToggleVisibility={project => report(data.persistProjectVisibility(project.id, project.isPublished === false), project.isPublished === false ? 'Website is visible in the marketplace.' : 'Website hidden from the marketplace.', onSaved)} onDelete={id => report(data.deleteProject(id), 'Website deleted.', onSaved)} />
  if (tab === 'works') return <ProjectManager items={data.works} type="website" isWork onUpsert={project => report(data.persistProject(project), 'Client work saved to Supabase.', onSaved)} onToggleVisibility={project => report(data.persistProjectVisibility(project.id, project.isPublished === false), project.isPublished === false ? 'Client work is visible in the marketplace.' : 'Client work hidden from the marketplace.', onSaved)} onDelete={id => report(data.deleteProject(id), 'Client work deleted.', onSaved)} />
  if (tab === 'business-arms') return <BusinessArmsManager arms={data.businessArms} setArms={data.setBusinessArms} onSave={data.persistArms} onSaved={onSaved} />
  if (tab === 'marquee') return <MarqueeManager items={data.marqueeItems} setItems={data.setMarqueeItems} onSave={data.persistMarquee} onSaved={onSaved} />
  if (tab === 'social') return <SocialLinksManager links={data.socialLinks} setLinks={data.setSocialLinks} onSave={data.persistSocialLinks} onSaved={onSaved} />
  if (tab === 'process') return <ProcessManager steps={data.processSteps} setSteps={data.setProcessSteps} onSave={data.persistProcessSteps} onSaved={onSaved} />
  if (tab === 'technology') return <TechnologyManager items={data.technologies} setItems={data.setTechnologies} onSave={data.persistTechnologies} onSaved={onSaved} />
  if (tab === 'privacy') return <PrivacyPolicyManager value={data.privacyPolicy} setValue={data.setPrivacyPolicy} onSave={data.persistPrivacyPolicy} onSaved={onSaved} />
  return <CompanyDetailsManager value={data.companyDetails} setValue={data.setCompanyDetails} onSave={data.persistCompanyDetails} onSaved={onSaved} />
}
