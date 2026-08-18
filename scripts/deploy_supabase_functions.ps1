# Run after: npx supabase login ; npx supabase link --project-ref YOUR_PROJECT_REF
$ErrorActionPreference = 'Stop'
npx supabase functions deploy public-sighting --no-verify-jwt
npx supabase functions deploy public-profile-photo --no-verify-jwt
npx supabase functions deploy product-event --no-verify-jwt
npx supabase functions deploy health-alert
npx supabase functions deploy qr-svg
npx supabase functions deploy staff-profile-photo
npx supabase functions deploy staff-photo
Write-Host 'All Nautilus Bay Edge Functions deployed.' -ForegroundColor Green
