import type { User } from '@supabase/supabase-js'

export const cmsRoles = ['owner', 'admin', 'editor', 'viewer'] as const
export type CmsRole = (typeof cmsRoles)[number]

export interface AdminIdentity {
  user: User
  role: CmsRole
  fullName: string
  jobTitle: string
  avatarUrl?: string
}

export type AdminAuthState =
  | { status: 'configuration-required' | 'loading' | 'signed-out' }
  | { status: 'unauthorized'; email: string }
  | { status: 'authorized'; identity: AdminIdentity }
