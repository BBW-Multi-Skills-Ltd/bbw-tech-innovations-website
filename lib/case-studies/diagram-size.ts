/**
 * Most diagrams fit the column (720px minimum, then scroll). Very wide ones,
 * like a database diagram, scroll sideways rather than shrink below 60%, so
 * their text stays readable.
 */
export function diagramMinWidth(svg: string) {
  const width = Number(svg.match(/viewBox="[\d.-]+ [\d.-]+ ([\d.]+)/)?.[1]) || 0;
  return { minWidth: width > 2400 ? Math.round(width * 0.6) : 720 };
}
