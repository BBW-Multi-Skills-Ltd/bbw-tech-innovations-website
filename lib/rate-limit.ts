import { createHash } from 'node:crypto'

/**
 * A per-visitor limit for "Start a project" enquiries, kept in this server's
 * memory (each server instance counts on its own, so it's a soft limit).
 * Counts distinct submissions: a retry of the same submission (same
 * idempotency key) doesn't use up another try. Visitors are keyed by a hash
 * of their IP, never the IP itself.
 */
const LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000
const visitors = new Map<string, Map<string, number>>()

export function allowEnquiry(ip: string, submissionKey: string, now = Date.now()) {
  const visitor = createHash('sha256').update(ip).digest('hex')
  const seen = visitors.get(visitor) ?? new Map<string, number>()
  for (const [key, at] of seen) if (now - at > WINDOW_MS) seen.delete(key)
  if (seen.has(submissionKey)) return true
  if (seen.size >= LIMIT) return false
  seen.set(submissionKey, now)
  visitors.set(visitor, seen)
  // Keep memory bounded: forget visitors whose tries have all expired.
  if (visitors.size > 5000) for (const [key, tries] of visitors) if ([...tries.values()].every(at => now - at > WINDOW_MS)) visitors.delete(key)
  return true
}
