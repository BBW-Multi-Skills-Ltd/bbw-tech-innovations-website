import type { ReturnTypeOfUseAdminData } from './adminTypes'
import type { AdminTab } from './adminTabConfig'
import { deleteClientWork, deleteProductApp, deleteProductWebsite, getClientWorks, getProductApps, getProductWebsites, upsertClientWork, upsertProductApp, upsertProductWebsite } from '../../data/store'
import ProjectManager from './ProjectManager'
import BusinessArmsManager from './BusinessArmsManager'
import MarqueeManager from './MarqueeManager'
import MusicManager from './MusicManager'

export default function AdminContent({ tab, data, onSaved }: { tab: AdminTab; data: ReturnTypeOfUseAdminData; onSaved: (message: string) => void }) {
  if (tab === 'apps') return <ProjectManager items={data.apps} type="app" isWork={false} onUpsert={project => { upsertProductApp(project); data.setApps(getProductApps()) }} onDelete={id => { deleteProductApp(id); data.setApps(getProductApps()) }} />
  if (tab === 'websites') return <ProjectManager items={data.websites} type="website" isWork={false} onUpsert={project => { upsertProductWebsite(project); data.setWebsites(getProductWebsites()) }} onDelete={id => { deleteProductWebsite(id); data.setWebsites(getProductWebsites()) }} />
  if (tab === 'works') return <ProjectManager items={data.works} type="website" isWork onUpsert={project => { upsertClientWork(project); data.setWorks(getClientWorks()) }} onDelete={id => { deleteClientWork(id); data.setWorks(getClientWorks()) }} />
  if (tab === 'business-arms') return <BusinessArmsManager arms={data.businessArms} setArms={data.setBusinessArms} onSaved={onSaved} />
  if (tab === 'marquee') return <MarqueeManager items={data.marqueeItems} setItems={data.setMarqueeItems} onSaved={onSaved} />
  return <MusicManager onSaved={onSaved} />
}
