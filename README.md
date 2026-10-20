# Teleprompter

A local-first web teleprompter built with **Next.js (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**. Script and settings persist in `localStorage` — no backend required.

## Features

- Smooth `requestAnimationFrame` auto-scroll with live speed changes
- Play / pause / reset, fullscreen, mirror (horizontal + vertical)
- Font size, line height, side margins, text/background colors
- Reading guide, 3-2-1 countdown, progress + time remaining
- Pause markup: `---` and `[pause 3s]`
- Keyboard shortcuts on the prompter page
- Optional voice-follow (Web Speech API / Chrome)
- Multiple saved scripts
- Same-browser remote control via BroadcastChannel (`/remote`)

## File tree

```text
teleprompter/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                 # Editor (/)
│   ├── prompter/page.tsx        # Full-screen prompter
│   └── remote/page.tsx          # Phone remote (BroadcastChannel)
├── components/
│   ├── Button.tsx
│   ├── Slider.tsx
│   ├── Toggle.tsx
│   ├── ColorPicker.tsx
│   ├── ScriptEditor.tsx
│   ├── SettingsPanel.tsx
│   ├── ScriptLibrary.tsx
│   ├── PrompterView.tsx
│   ├── ControlsBar.tsx
│   ├── ProgressBar.tsx
│   ├── CountdownOverlay.tsx
│   └── ReadingGuide.tsx
├── hooks/
│   ├── useAutoScroll.ts
│   ├── useLocalStorage.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useFullscreen.ts
│   ├── useIdle.ts
│   ├── useVoiceFollow.ts
│   └── useRemoteControl.ts
├── lib/
│   ├── defaults.ts
│   ├── script.ts
│   └── cn.ts
├── types/
│   └── index.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

## Setup

If starting from scratch:

```bash
npx create-next-app@14 teleprompter --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
cd teleprompter
```

This repo is already scaffolded. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Editor: `/`
- Prompter: `/prompter`
- Remote (same browser): `/remote`

## Keyboard shortcuts (prompter)

| Key | Action |
| --- | --- |
| Space | Play / pause |
| ↑ / ↓ | Speed up / down |
| + / − | Font size |
| M | Toggle mirror |
| F | Fullscreen |
| R | Reset |
| Esc | Exit to editor |

## Remote control approach

- **BroadcastChannel** (implemented): open `/prompter` and `/remote` in tabs on the same origin/browser. Instant, no server.
- **Cross-device**: use a small WebSocket relay (or WebRTC data channel + signaling) with a shared room code so a phone can control a laptop.

## Deploy to Vercel

1. Push this project to GitHub / GitLab / Bitbucket.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Next.js** (defaults are fine).
4. Click **Deploy**.

Or from the CLI:

```bash
npm i -g vercel
vercel
```

## License

MIT
