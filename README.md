# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```


### Audio uploads → MP3

- Voice recordings are captured in the browser using MediaRecorder (webm/ogg).
- The server upload endpoint will attempt to transcode audio uploads to MP3 using `ffmpeg`.
- If `ffmpeg` is available on the host, uploads will return `.mp3` URLs; otherwise the original format is returned.
- To enable conversion locally, install ffmpeg:
	- macOS (Homebrew): `brew install ffmpeg`
	- Linux: use your distro package manager
	- Windows: install ffmpeg and ensure it’s on PATH

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
