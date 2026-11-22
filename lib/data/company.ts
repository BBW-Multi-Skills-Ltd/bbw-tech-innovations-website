export type BusinessArmStatus = 'active' | 'in-development' | 'coming-soon'

export interface BusinessArm {
  id: string
  name: string
  role: string
  status: BusinessArmStatus
  websiteUrl?: string
}

export const BUSINESS_ARM_STATUS_LABELS: Record<BusinessArmStatus, string> = {
  active: 'Active',
  'in-development': 'In Development',
  'coming-soon': 'Coming Soon',
}

export const BUSINESS_ARM_STATUS_COLORS: Record<BusinessArmStatus, string> = {
  active: '#22C55E',
  'in-development': '#F59E0B',
  'coming-soon': '#8B5CF6',
}

export const defaultBusinessArms: BusinessArm[] = [
  {
    id: 'bbw-tech-innovations',
    name: 'BBW Tech Innovations',
    role: 'Technology & Software',
    status: 'active',
  },
  {
    id: 'bbw-infra',
    name: 'BBW-Infra',
    role: 'Construction & Infrastructure',
    status: 'in-development',
  },
  {
    id: 'bbw-fixlyn',
    name: 'BBW-Fixlyn',
    role: 'Maintenance & Technical Services',
    status: 'coming-soon',
  },
  {
    id: 'bbw-luxenta',
    name: 'BBW-Luxenta',
    role: 'Lifestyle & Consumer Brand',
    status: 'coming-soon',
  },
  {
    id: 'domihive-property-solutions',
    name: 'DomiHive Property Solutions Ltd',
    role: 'Property Management · PropTech',
    status: 'in-development',
    websiteUrl: 'https://mydomihive.com',
  },
]
