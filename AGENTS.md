# AGENTS.md — world game

A Chinese-style 3D interactive showcase: a WebGPU-rendered ink-wash globe + a scroll of human-origin history across the continents. Stack: Vite 5 + TypeScript + Three.js (`WebGPURenderer` preferred, `WebGLRenderer` fallback) + GSAP 3. Pure-frontend SPA — no SSR, no framework, no backend.

---

## Required commands

```bash
npm install
npm run dev         # vite, port 5173, host: true (LAN-accessible)
npm run type-check  # tsc --noEmit
npm run build       # tsc && vite build  ← includes type check
npm run preview     # serve dist/
```

The repo has **no** `lint` / `test` / `format` scripts — only the four above in `package.json`. Don't run `npm test`, `eslint`, or `prettier` — they don't exist. After code changes, use `npm run build` to run type check + production build in one shot.

---

## Architecture & entrypoint

- Entry: `index.html` → `src/main.ts` (`bootstrap()` — all system wiring lives in this single file).
- Module boundaries:
  - `src/core/` — Renderer / Globe / Camera / Picker / PostFX / MusicManager (rendering & interaction)
  - `src/data/` — static content (`continents`, `content`, `chronicle`, `countries`, `arctic`, `types`). The `ContinentId` union has **8 members**: asia / africa / europe / northAmerica / southAmerica / oceania / antarctica / **arctic**.
  - `src/ui/` — DOM layer (TitleScreen / ScrollPanel / Tooltip / HistoryCardsBg / MusicToggle)
  - `src/utils/` — colors / lat-lon / easing
  - `src/styles/main.css`
- `ContentView = 'continent' | 'chronicle' | 'country'` (`src/data/types.ts`). The three views are routed by the top-bar switcher to different `ScrollPanel` open methods.
- Debug hook: `window.__worldGame = { scene, camera, globe, controller, picker, postfx }` is always exposed (even in production) for automation & diagnostics.

---

## Renderer & PostFX gotchas

- `src/core/Renderer.ts` checks `navigator.gpu` first, then **dynamically `import('three/webgpu')`** (falls back to WebGL on failure). The WebGPU path calls `await renderer.init()`.
- **Canvas must have `alpha: true`** and **`scene.background = null`**: the `#history-cards` DOM layer sits behind the canvas, and the area outside the globe must be transparent so cards show through. Don't break these two settings when editing `Renderer.ts` or `main.ts`.
- **PostFX (EffectComposer + UnrealBloomPass) is WebGL-only**: `main.ts` checks `renderer.constructor.name === 'WebGLRenderer'`. Under WebGPU, `postfx === null` and the render loop takes the `renderer.render(scene, camera)` branch. PostFX init is wrapped in try/catch — failure only warns, never throws.
- When editing `PostFX.ts` or the render loop, keep the WebGPU fallback path working.

---

## Auto-rotate / focus state machine

`resumeAutoRotateTimer` in `main.ts` controls pausing and resuming globe auto-rotation, with a 2.5s delay before resume. **Any code path that extends a "user is reading / paused" semantic must `clearTimeout(resumeAutoRotateTimer)` and set it to null**, otherwise the globe will jerk back to spinning while the scroll is still open. Known sites that need the timer cleared:

- `controller.setOnTap(...)` when a continent is hit
- `scrollPanel.setOnClose(...)` on scroll close
- View-switcher clicks

Read `src/main.ts:115-145` and `src/main.ts:213-246` before changing interaction logic.

---

## Visual verification scripts (puppeteer-core)

The root `verify-final.mjs` and `audit/*.cjs` are all puppeteer-core scripts used for screenshots / picker tests.

- **Hardcoded Chrome path**: `C:\Program Files\Google\Chrome\Application\chrome.exe` (Windows). Won't run on a machine without Chrome installed there. On Linux/macOS change `executablePath` or use `channel: 'chrome'`.
- All use `puppeteer-core` (not `puppeteer`) — **no bundled Chromium**.
- `npm run dev` must be running first; scripts default to `http://localhost:5173/`.
- `verify-final.mjs` usage: `node verify-final.mjs` → outputs `verify-final.png`.
- `audit-output/` and `.playwright-cli/` are already in `.gitignore`; local screenshots / logs won't be committed.

---

## TypeScript & build

- `tsconfig.json`: `strict: true`, `module: ESNext`, `moduleResolution: bundler`, `noEmit: true` (Vite handles bundling), `include: ["src"]`. `allowImportingTsExtensions: true`.
- `"type": "module"`: all source is ESM. When adding scripts/tools, pick `.cjs` vs `.mjs` deliberately — puppeteer scripts at repo root and in `audit/` are `.cjs`; pure-Node ESM tools can be `.mjs`.
- `noUnusedLocals` / `noUnusedParameters` are both `false`, but `strict` is on — don't reach for `any` as an escape hatch.

---

## Don'ts

- Don't add React / Vue / any frontend framework — the README explicitly says "keep it lightweight".
- Don't add SSR or a Node backend.
- Don't change `scene.background = null` or canvas `alpha: true` — the DOM card layer disappears.
- Don't enable `EffectComposer` on the WebGPU path (incompatible). Keep the `postfx === null` branch.
- Don't commit `audit-output/`, `.playwright-cli/`, `dist/`, `node_modules/` (already in `.gitignore`).
- Don't commit one-off screenshot artifacts like `verify-final.png` (not in `.gitignore` from repo root, but they are temporary files).
