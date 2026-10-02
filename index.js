/**
 * Registers the TypeSafe/Jev skill (`typesafe-ai`) into this profile's skill registry.
 *
 * The row is a host row, so `ctx.skills.register` files the skill into the global
 * layer rather than one agent preset's layer: every session in the profile sees it,
 * including sessions started after this plugin mounts.
 *
 * `SKILL.md` beside this module is the single source of truth. Edit that file to
 * change the skill; the plugin re-reads it whenever it mounts.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Absolute location of the skill document shipped with this plugin. */
const SKILL_PATH = fileURLToPath(new URL('./SKILL.md', import.meta.url));

/** Cordis plugin name, used in loader diagnostics. */
export const name = 'typesafe-ai-skill';

/** Services this plugin needs before `apply` runs. */
export const inject = ['skills'];

/**
 * Fold YAML block-scalar continuation lines into one string.
 *
 * @param lines - Raw lines of the block scalar, indentation included.
 * @returns The folded text, with blank lines preserved as paragraph breaks.
 */
function foldBlock(lines) {
  let text = '';
  let paragraphBreak = false;
  for (const line of lines) {
    if (line.trim() === '') {
      paragraphBreak = text !== '';
      continue;
    }
    if (text === '') text = line.trim();
    else text += (paragraphBreak ? '\n\n' : ' ') + line.trim();
    paragraphBreak = false;
  }
  return text;
}

/**
 * Split a `---` frontmatter header from the Markdown body that follows it.
 *
 * Handles the subset the skill format uses: `key: value` pairs plus `>` and `|`
 * block scalars. A body line is only a continuation when it is indented, so a
 * colon inside prose cannot be mistaken for a key.
 *
 * @param text - Full contents of a `SKILL.md`.
 * @returns The frontmatter fields and the body with the header removed.
 */
function splitFrontmatter(text) {
  const header = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/.exec(text);
  if (header === null) return { fields: {}, body: text };

  const fields = {};
  let key = null;
  let block = [];

  const flush = () => {
    if (key !== null && block.length > 0) fields[key] = foldBlock(block);
    block = [];
  };

  for (const line of header[1].split(/\r?\n/)) {
    const entry = /^([A-Za-z0-9_-]+):(?:[ \t]*(.*))?$/.exec(line);
    if (entry !== null) {
      flush();
      key = entry[1];
      const value = (entry[2] ?? '').trim();
      fields[key] = value === '>' || value === '|' ? '' : value;
      continue;
    }
    if (key !== null && /^[ \t]/.test(line)) block.push(line);
  }
  flush();

  return { fields, body: text.slice(header[0].length).replace(/^\n+/, '') };
}

/**
 * Publish the bundled skill into the global layer.
 *
 * @param ctx - The plugin's Cordis context.
 */
export function apply(ctx) {
  const { fields, body } = splitFrontmatter(readFileSync(SKILL_PATH, 'utf8'));
  if (!fields.name || !fields.description) {
    throw new Error(
      `typesafe-ai-skill: ${SKILL_PATH} needs both "name" and "description" in its frontmatter`,
    );
  }

  ctx.effect(() =>
    ctx.skills.register({
      name: fields.name,
      description: fields.description,
      content: body,
      source: 'bundled',
      path: SKILL_PATH,
      resourceBase: { kind: 'url', url: 'https://docs.typesafe.ai/' },
    }),
  );
}
