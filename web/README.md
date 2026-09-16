# StreamNest web app

A React + Vite single-page app that browses and plays publicly listed live TV
channels sourced from the [iptv-org](https://github.com/iptv-org) public API
(`https://iptv-org.github.io/api/*.json`).

## Develop

```
npm install
npm run dev
```

## Build

```
npm install
npm run build
```

Output goes to `dist/`. Deployed on Vercel using the `vercel.json` at the
repository root, which builds this folder and serves `dist/` with an SPA
fallback so client-side routes (`/channels`, `/country/:code`, `/favorites`,
`/search`) work on direct navigation and refresh.
