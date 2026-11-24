/** True for empty values and [placeholders]. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return !value || /^\[.*\]$/.test(value.trim())
}

/** The text if it's real, else null: case studies hide empty and [placeholder] content. */
export function shownText(value: string | null | undefined): string | null {
  return isPlaceholder(value) ? null : (value as string)
}

/** The value if it's real, otherwise null (for URLs). */
export const realValue = shownText
