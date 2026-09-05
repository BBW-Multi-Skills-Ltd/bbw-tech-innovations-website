# BBW Tech database backup routine

This project already keeps its database structure in `supabase/migrations/`. The backup routine protects the live **public data** too: products, enquiries, CMS settings, profiles, social links, and other business records.

## Every month, and before any major schema change

1. Start Docker Desktop.
2. From the repository root, run:

   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/backup-supabase.ps1
   ```

3. Confirm that a new dated folder exists under `backups/supabase/` with a `migrations/` folder, `data.sql`, and `manifest.json`. The terminal must say **Verified backup completed**.
4. Copy that dated folder to a private encrypted location that is not this computer and not GitHub. A private Google Drive/OneDrive folder is suitable if it is protected with your account and MFA.
5. Keep at least the latest 12 monthly exports and one export from before every major change.

`backups/` is intentionally ignored by Git because exports can contain customer enquiries and contact information.

## Important scope

The public-data SQL export does not include Supabase's managed Auth schema, Storage object files, or media hosted by Cloudinary. The schema is recoverable from the copied migration snapshot, which is the source of truth for this project.

- Auth recovery: keep access to the Supabase project and use its managed backup/recovery options for your plan.
- Supabase Storage: profile images can be downloaded separately if you ever need a full media archive.
- Cloudinary: demo videos and card preview images remain in Cloudinary. Keep the Cloudinary account secure and periodically export/archive its assets separately.

## Restore principle

Do not run a restore against the live project casually. Restore into a new Supabase project first, verify the data and application, then plan any production recovery deliberately.
