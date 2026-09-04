export interface ProcessStep {
  num: string
  title: string
  desc: string
  details: string[]
  output: string
  note?: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  { num: '01', title: 'Discover', desc: 'Understand the business before proposing a solution.', details: ['Business goals', 'Target users', 'Current workflow', 'Problems and pain points', 'Existing tools', 'Business constraints', 'Stakeholders', 'Success goals'], output: 'Discovery brief + problem definition.' },
  { num: '02', title: 'Validate', desc: "Make sure we're solving the right problem.", details: ['User interviews', 'Market research', 'Competitor analysis', 'Existing-solution analysis', 'Validate assumptions', 'Define the ideal customer/user', 'Determine whether the proposed solution is actually needed', 'Identify the smallest viable solution'], output: 'Validated problem + initial solution direction.', note: 'This protects BBW from spending ₦2m building something nobody wants.' },
  { num: '03', title: 'Strategize', desc: 'Turn the validated problem into a product strategy.', details: ['Product vision', 'Goals', 'Scope', 'MVP definition', 'Feature prioritization', 'Business model', 'Monetization', 'KPIs', 'Technical considerations', 'Product roadmap'], output: 'Product strategy + prioritized roadmap.' },
  { num: '04', title: 'Plan', desc: 'Turn the strategy into an executable project.', details: ['Requirements', 'User stories', 'User roles', 'Functional requirements', 'Non-functional requirements', 'User flows', 'Information architecture', 'Database/data requirements', 'Integrations', 'Technical architecture', 'Timeline', 'Development milestones'], output: 'Product requirements + technical plan.' },
  { num: '05', title: 'Design', desc: 'Now we design the actual experience.', details: ['UX', 'Wireframes', 'Information architecture', 'UI design', 'Design system', 'Responsive/mobile layouts', 'Prototypes', 'Usability testing'], output: 'High-fidelity prototype + design system.' },
  { num: '06', title: 'Build', desc: 'Turn the approved design into a working product.', details: ['Frontend', 'Backend', 'Database', 'APIs', 'Authentication', 'Integrations', 'Infrastructure', 'Admin systems', 'Analytics', 'Documentation'], output: 'Working product.' },
  { num: '07', title: 'Test & Secure', desc: "Make sure it's actually ready for real users.", details: ['Functional testing', 'Integration testing', 'Usability testing', 'Performance testing', 'Security testing', 'Cross-device/browser testing', 'Bug fixing', 'User acceptance testing', 'Production readiness review'], output: 'Production-ready product.' },
  { num: '08', title: 'Launch', desc: 'Take it from development into the real world.', details: ['Production deployment', 'Domain/infrastructure setup', 'App Store/Play Store submission where applicable', 'Analytics', 'Monitoring', 'Backups', 'Launch strategy', 'Customer onboarding', 'Documentation/training'], output: 'Live product.' },
  { num: '09', title: 'Improve', desc: "The launch isn't the end. It's the beginning.", details: ['Monitor usage', 'Collect feedback', 'Analyze behavior', 'Fix issues', 'Optimize performance', 'Improve UX', 'Release new features', 'Security updates', 'Maintenance', 'Product iterations'], output: 'Continuously improving product.' },
]
