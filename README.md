# Guy J ID Tier List - Deployment

This repo contains a React frontend (Vite) and a small Express backend that queries a NeonDB Postgres database for tracks. The recommended deployment is:

- Frontend: Cloudflare Pages (serves the static build)
- Backend: Render (or Fly/Railway) to host the Node server which can connect to NeonDB via Postgres TCP
- (Optional) Cloudflare Worker to proxy `/api/*` routes to the backend and provide a single domain

Do NOT commit your NeonDB connection string. Provide it as an environment variable named `NEON_DB_URL` in your backend host.

Quick steps (Render):

1. Create a new Web Service on Render, connect your GitHub repo.
2. Set the start command to `node server.js` and the environment variable `NEON_DB_URL` to your Neon connection string.
3. Deploy. The service will expose a public URL. Use that as `BACKEND_URL`.

Cloudflare Pages:
1. Configure Pages with build command `npm run build` and output directory `dist`.
2. Optionally add a Worker that proxies `/years` and `/tracks` to your backend URL.

If you want, I can add a `wrangler.toml` and `worker/index.js` to the repo to help set up the Cloudflare proxy.

Cloudflare Pages + Worker setup (quick):

1. Build your frontend locally and push to GitHub.
2. Create a Cloudflare Pages project connected to your repo, build command `npm run build`, output directory `dist`.
3. Deploy a backend service (Render/Fly/Railway) that can connect to NeonDB. Set `NEON_DB_URL` as an environment variable on that service.
4. Update `wrangler.toml` `BACKEND_URL` to point to your backend URL and publish the worker with `wrangler publish`.
5. Configure Cloudflare Pages to use the Worker as a proxy (or call the backend URL directly from the frontend).

Security note: keep `NEON_DB_URL` secret and never commit it to Git.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app (starts frontend + backend concurrently):
   `npm run dev`
