/**
 * Typed merge tags.
 *
 * A "merge tag" value in the editor is normally a plain preview string keyed by a
 * (possibly dot-nested) path, e.g. `{ user: { name: 'John' } }`.
 *
 * To let templates carry a personalization *type* per merge tag (e.g. OTP, PHONE,
 * CUSTOM_LABEL) alongside the preview value, a leaf may instead be a typed object:
 *
 *   { type: 'OTP', value: '123456' }
 *
 * Since the editor's `MergeTagsType` is `Record<string, any>`, this object shape can be
 * stored directly in `mergeTags`. The helpers below let the rest of the editor keep
 * treating merge tags as flat preview values (previews, tree pickers, badges) while the
 * type metadata rides along untouched.
 */

export interface TypedMergeTag {
  type: string;
  value: string | number | boolean | null;
}

/**
 * A leaf is a "typed merge tag" when it is a plain object carrying a string `type` and a
 * primitive `value`. Legacy string leaves and genuinely nested objects are left as-is.
 */
export function isTypedMergeTag(value: unknown): value is TypedMergeTag {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const obj = value as Record<string, unknown>;
  if (typeof obj.type !== 'string') return false;
  if (!('value' in obj)) return false;
  const inner = obj.value;
  return (
    inner === null ||
    typeof inner === 'string' ||
    typeof inner === 'number' ||
    typeof inner === 'boolean'
  );
}

/** Returns the preview value of a leaf, unwrapping typed merge tags. */
export function getMergeTagLeafValue(value: unknown): unknown {
  return isTypedMergeTag(value) ? (value as TypedMergeTag).value : value;
}

/**
 * Recursively replaces typed merge tag leaves with their plain preview value, so consumers
 * that expect flat string/number leaves (preview substitution, MJML data source) keep
 * working. Non-typed values are returned unchanged.
 */
export function normalizeMergeTags<T = any>(mergeTags: T): T {
  const walk = (node: any): any => {
    if (isTypedMergeTag(node)) return (node as TypedMergeTag).value;
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      const out: Record<string, any> = {};
      for (const key of Object.keys(node)) out[key] = walk(node[key]);
      return out;
    }
    return node;
  };
  if (!mergeTags || typeof mergeTags !== 'object') return mergeTags;
  return walk(mergeTags);
}
