// scripts/lib/frontmatter.mjs

// =============================================================================
// READING THE FRONT MATTER WITHOUT LOSING A THIRD OF IT
// =============================================================================
//
// Four scripts parsed a generated `DESIGN_LANGUAGE.md` the obvious way:
//
//     const fm = doc.split('---')[1];
//
// Which is correct for a document whose front matter contains no `---`. Ours
// contains several, because the template groups its keys under banner comments:
//
//     # --- Accent-driven only ------------------------------------------
//
// So every key after the FIRST banner was invisible. Measured on the
// accent-driven example: 28 keys seen, 39 present, and the eleven lost were
// `accentContrast`, `accentFill`, `neutralPigment`, `secondaryAction`, `voice`,
// `voiceExceptions`, `ctaMood`, `deviations`, `resolutions`, `overrides` and
// `guardrails`.
//
// `check-chain` reported "continuous" the whole time. It was verifying that
// every answer produced something across two thirds of the answers, and the
// third it could not see is where the deviations, the guardrails and the
// accent decisions live. A guard blind to a third of its input reads exactly
// like a guard that passes.
//
// The delimiter is a line that IS `---`, not a `---` anywhere in the text.
// =============================================================================

/** The front matter of a document, as text, or '' when there is none. */
export function frontMatter(doc) {
  const lines = doc.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return '';
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') return lines.slice(1, i).join('\n');
  }
  return '';
}

/** Top-level keys, in document order. */
export function keys(doc) {
  return [...frontMatter(doc).matchAll(/^([a-zA-Z][a-zA-Z0-9]*):/gm)].map((m) => m[1]);
}

/** One scalar answer, with any trailing comment stripped. */
export function value(doc, key) {
  const m = frontMatter(doc).match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));
  if (!m) return undefined;
  const v = m[1].replace(/\s+#.*$/, '').trim();
  return v === '' || v === '~' ? undefined : v;
}

/** A block-sequence answer — `- one` per line, comments allowed between. */
export function list(doc, key) {
  const block = frontMatter(doc).match(
    new RegExp(`^${key}:[^\\n]*\\n((?:[ \\t]+(?:-[^\\n]*|#[^\\n]*)\\n?)+)`, 'm')
  )?.[1];
  if (!block) return [];
  return [...block.matchAll(/^[ \t]+-[ \t]+([^\n#]+)/gm)].map((m) => m[1].trim());
}
