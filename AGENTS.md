### Easy Email Agents: Libraries and Demo Overview

This repository brings together three complementary libraries for building rich, responsive email templates with a visual editor and an extensible runtime. It also includes a demo that showcases how they work end‑to‑end.

#### Libraries

- easy-email-core
  - Purpose: Headless core for email blocks, schema, serialization, and rendering helpers.
  - What it provides:
    - Typed block definitions (e.g., text, image, section, column, table, etc.)
    - JSON schema for templates and blocks
    - Render/transforms and utilities used by both editor and extensions
  - Typical consumers: extensions and editor runtime. Can also be used server‑side to validate/transform templates.

- easy-email-extension (aka extensions / plugins)
  - Purpose: Optional UI and logic building blocks that augment the editor’s attribute panels and form controls.
  - What it provides:
    - Attribute panels (e.g., Color picker, Font controls, Spacing, Alignment)
    - Form components (e.g., CodeMirror HTML editor, custom inputs)
    - Helpers that map `easy-email-core` block attributes to user‑friendly controls
  - Typical consumers: the editor’s sidebar/panels; can be selectively imported for a custom editor build.

- easy-email-editor
  - Purpose: The visual WYSIWYG editor built on top of the core and extensions.
  - What it provides:
    - Canvas, block tree, drag & drop, focus and selection management
    - Attribute side panels powered by `easy-email-extension`
    - Context and hooks for reading/updating the template JSON
    - Preview and code/HTML editing capabilities

#### How they work together

1. easy-email-core defines the canonical template model and block contracts.
2. easy-email-extension supplies reusable UI controls that bind to core block attributes.
3. easy-email-editor orchestrates the editing experience, using both core and extension pieces to present an authoring UI.

In practice, the editor reads a JSON template (from `easy-email-core` types), renders blocks on a canvas, and uses panels (from `easy-email-extension`) to modify attributes. The result remains a structured JSON that can be rendered to HTML or further processed.

#### Demo application

The `demo` folder contains a runnable example that wires all three libraries together. It showcases:

- Creating a new email from presets
- Editing content and attributes via the right/left side panels
- Live HTML preview (including table and arbitrary HTML content via the HTML editor)
- Exporting/serializing the template data

Quick start (repository root):

1. Install dependencies
   - pnpm install

2. Start the demo
   - pnpm --filter demo dev

Depending on workspace settings, you can also run scripts defined in the root `package.json` or inside `demo/package.json` (if present).

Once running, open the local URL shown in the terminal. You should see the visual editor that uses:

- Types and schema from `easy-email-core`
- Panels and UI controls from `easy-email-extension`
- Canvas, context, and hooks from `easy-email-editor`

#### Notable editor components in this repository

- packages/easy-email-extensions/src/AttributePanel/components/UI/HtmlEditor.tsx
  - A drawer‑based HTML editor that uses a CodeMirror‑powered input for raw HTML and renders a live preview inside a Shadow DOM.
  - Integrates tightly with the editor context (focus block, focus index, page data) exposed by `easy-email-editor`.

Key concepts visible in the code:

- Focused block editing
  - The editor exposes `useBlock()` and `useFocusIdx()` to read and update the currently selected block.
  - Example from `HtmlEditor.tsx`:
    - Read: the component pulls `focusBlock` and `pageData` from editor context
    - Update: `setValueByIdx(focusIdx, { ...focusBlock })` persists the edited content back into the template tree

- Styling resolution
  - The preview composes styles from the focused block’s attributes with page‑level defaults (font family/size, text color, etc.) ensuring WYSIWYG consistency.

#### Using the libraries in your own app

- Install the packages (names may be scoped in your registry):
  - easy-email-core
  - easy-email-extension
  - easy-email-editor

- Minimal usage outline:
  1. Define or load a template JSON that conforms to `easy-email-core` types
  2. Render the `easy-email-editor` component and provide the template as state
  3. Compose attribute panels from `easy-email-extension` or write custom panels that bind to the block attributes you care about
  4. Listen for template changes and persist/preview/export as needed

#### FAQ

- Can I use only the core without the editor?
  - Yes. You can build your own UI or server pipeline on top of `easy-email-core`.

- Can I add my own block types or attribute panels?
  - Yes. Implement custom blocks against the `easy-email-core` contracts and author matching panels in the style of `easy-email-extension` components.

- How do I run the full workspace?
  - Use the root `pnpm-workspace.yaml` and `lerna.json`. Typical flow:
    - pnpm install
    - pnpm -r build
    - pnpm --filter demo dev

#### License

See the `License` file at the repository root for licensing details.
