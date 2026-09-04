import type { BusinessArm } from '../data/company'
import { BUSINESS_ARM_STATUS_COLORS, BUSINESS_ARM_STATUS_LABELS } from '../data/company'
import { externalUrl } from '../utils/urls'

export default function BusinessArms({ arms }: { arms: BusinessArm[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {arms.map(arm => {
        const statusColor = BUSINESS_ARM_STATUS_COLORS[arm.status]
        return (
          <article key={arm.id} className="business-arm-card">
            <span className="business-arm-dot" style={{ background: statusColor }} />
            <div className="business-arm-copy"><p>{arm.name}</p><span>{arm.role}</span></div>
            <div className="business-arm-actions">
              {arm.websiteUrl && <a href={externalUrl(arm.websiteUrl)} target="_blank" rel="noopener noreferrer">Visit <span aria-hidden="true">↗</span></a>}
              <span className="business-arm-status" style={{ color: statusColor, borderColor: `${statusColor}55`, background: `${statusColor}12` }}>{BUSINESS_ARM_STATUS_LABELS[arm.status]}</span>
            </div>
          </article>
        )
      })}
    </div>
  )
}
