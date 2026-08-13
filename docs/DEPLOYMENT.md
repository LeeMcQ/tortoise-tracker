# Production Deployment

## Front end
- Keep `demoMode:true` on the public GitHub Pages demo until the backend is configured.
- For production set `demoMode:false`, `supabaseUrl`, `supabasePublishableKey`, final `siteUrl`, and optional `turnstileSiteKey` in `config.js`.
- Prefer the final `tortoise.nautilusbayhoa.co.za` domain once DNS/TLS are ready.
- `_headers` is provided for hosts such as Cloudflare Pages. GitHub Pages does not apply this file as HTTP headers, so use the final production host/proxy to enforce headers.

## Supabase secrets
Set server-side only:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PUBLIC_SITE_URL`
- `TURNSTILE_SECRET_KEY` (if used)
- `TURNSTILE_REQUIRED` (`true` only after offline/reconnect behaviour is validated)
- `RESEND_API_KEY`
- `HEALTH_ALERT_FROM`
- `HEALTH_ALERT_TO`

Never put the service-role or email-provider API key into `config.js`.

## Environments
Use independent projects/credentials for development, staging and production. Promote reviewed migrations and Edge Functions through the environments; do not develop directly in production.

## Backups
Define and test recovery separately for PostgreSQL data and private photo objects. Record RPO/RTO and perform a documented restore exercise before launch.
