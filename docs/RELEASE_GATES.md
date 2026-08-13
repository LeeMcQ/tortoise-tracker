# Mandatory Production Release Gates

A production launch is **NO-GO** until every mandatory gate below is signed off.

- [ ] Reserve owner approves final scope, roles and public location policy.
- [ ] Wildlife/herpetology specialist approves biological fields and public guidance.
- [ ] Wildlife veterinarian approves health triage and any physical tag/device method.
- [ ] Reserve boundary/management GIS layers imported and spatial validation tested.
- [ ] POPIA PIIA, privacy notice, retention schedule and Information Officer workflow approved.
- [ ] Development, staging and production Supabase projects separated.
- [ ] All administrator accounts enrolled in MFA and AAL2 access verified.
- [ ] Row Level Security tests demonstrate no anonymous raw-coordinate access.
- [ ] Private photo storage access tests passed.
- [ ] Bot/rate-abuse control configured and tested without breaking offline recovery.
- [ ] Independent application penetration test passed; findings closed or formally accepted.
- [ ] WCAG 2.2 AA manual/automated accessibility audit passed.
- [ ] Android/iPhone/tablet/desktop device matrix passed.
- [ ] Offline/reconnect/duplicate retry tests passed in the reserve.
- [ ] Camera/GPS-denial and poor-GPS workflows passed.
- [ ] Core Web Vitals measured on staging/production-like devices and accepted.
- [ ] Backup/restore test completed for database and private photo objects.
- [ ] Health alert email delivery and escalation ownership tested.
- [ ] Real tortoise records imported and synthetic demo records removed.
- [ ] QR labels generated from final production domain and field-scanned successfully.
