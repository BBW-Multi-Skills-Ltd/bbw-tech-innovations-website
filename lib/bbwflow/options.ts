/**
 * The project types and budgets for the "Start a project" form. They come
 * from BBWFlow (our operations app, GET /api/public/website-intake/options);
 * this copy of its default questionnaire (Nov 2026) is used only when BBWFlow
 * can't be reached, so the form always works and the fallback enquiry still
 * names the choices.
 */
export type IntakeOption = { value: string; label: string }
export type IntakeOptions = { projectTypes: IntakeOption[]; budgets: IntakeOption[] }

export const BUNDLED_INTAKE_OPTIONS: IntakeOptions = {
  projectTypes: [
    { value: 'website', label: 'Website & PWA' },
    { value: 'mobile_app', label: 'Mobile app' },
    { value: 'website_mobile_app', label: 'Website + mobile app' },
    { value: 'ecommerce', label: 'E-commerce platform' },
    { value: 'ui_ux_design', label: 'UI/UX design' },
    { value: 'branding', label: 'Branding & identity' },
    { value: 'software', label: 'Custom software' },
    { value: 'saas_product', label: 'SaaS product' },
    { value: 'internal_tool', label: 'Internal business tool' },
    { value: 'data_dashboard', label: 'Data dashboard & analytics' },
    { value: 'automation', label: 'Business automation' },
    { value: 'ai_integration', label: 'AI integration' },
    { value: 'system_integration', label: 'API & system integration' },
    { value: 'refactoring', label: 'Refactoring & modernization' },
    { value: 'maintenance_upgrade', label: 'Maintenance & upgrades' },
    { value: 'technical_consulting', label: 'Technical consulting' },
    { value: 'other', label: 'Other digital project' },
  ],
  budgets: [
    { value: 'under_100k', label: 'Under ₦100,000' },
    { value: '100k_300k', label: '₦100,000 – ₦300,000' },
    { value: '300k_500k', label: '₦300,000 – ₦500,000' },
    { value: '500k_1m', label: '₦500,000 – ₦1,000,000' },
    { value: '1m_2_5m', label: '₦1,000,000 – ₦2,500,000' },
    { value: '2_5m_plus', label: '₦2,500,000 and above' },
    { value: 'guidance', label: 'I need guidance' },
  ],
}

const isOptionList = (value: unknown): value is IntakeOption[] =>
  Array.isArray(value) && value.length > 0 && value.every(item => item && typeof item.value === 'string' && typeof item.label === 'string')

export function parseIntakeOptions(value: unknown): IntakeOptions | null {
  const data = value as Partial<IntakeOptions> | null
  if (!data || !isOptionList(data.projectTypes) || !isOptionList(data.budgets)) return null
  return {
    projectTypes: data.projectTypes.map(({ value, label }) => ({ value, label })),
    budgets: data.budgets.map(({ value, label }) => ({ value, label })),
  }
}

export const optionLabel = (options: IntakeOption[], value: string) => options.find(option => option.value === value)?.label ?? value
