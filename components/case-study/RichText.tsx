import { Fragment, type ReactNode } from "react";
import { shownText } from "@/lib/case-studies/text";

/**
 * Light formatting for case study text, rendered as React elements (never raw
 * HTML): blank-line paragraphs, "- " bullet lists, **bold**, `code` and
 * [links](https://…). A paragraph or bullet that is only a [placeholder] is
 * hidden in production.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length && lines.every((l) => l.startsWith("- "))) {
          const items = lines.map((l) => l.slice(2)).filter((l) => shownText(l) !== null);
          if (!items.length) return null;
          return (
            <ul key={i} className="flex flex-col gap-2">
              {items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-bbw-accent" />
                  <span>
                    <Inline text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        const paragraph = lines.join(" ");
        if (shownText(paragraph) === null) return null;
        return (
          <p key={i}>
            <Inline text={paragraph} />
          </p>
        );
      })}
    </div>
  );
}

/** **bold**, `code` and [label](url) inside a line. */
export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) parts.push(<strong key={match.index} className="font-semibold text-bbw-fg">{match[1]}</strong>);
    else if (match[2])
      parts.push(
        <code key={match.index} className="rounded-md bg-bbw-surface2 px-1.5 py-0.5 font-mono text-[0.85em]">
          {match[2]}
        </code>,
      );
    else
      parts.push(
        <a
          key={match.index}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-bbw-accent underline underline-offset-4"
        >
          {match[3]}
        </a>,
      );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}
