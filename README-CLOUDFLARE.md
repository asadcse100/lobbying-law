# Lobbying & The Law — Cloudflare Pages Ready

This package is prepared for a GitHub Repository -> Cloudflare Pages deployment.

## Cloudflare Pages settings
- Build command: `pnpm run build`
- Build output directory: `dist`
- Root directory: `/`
- Production branch: `main`

## Important
Upload/replace the files at the ROOT of the GitHub repository. Do not place the project inside an extra `lawsite-fixed/` or `dist/` folder.

Commit and push:

```bash
git add .
git commit -m "Fix Cloudflare Pages build"
git push origin main
```

The project intentionally does not depend on `@vitejs/plugin-react`; `package.json` and `pnpm-lock.yaml` are kept in sync so Cloudflare's frozen-lockfile install can proceed.
