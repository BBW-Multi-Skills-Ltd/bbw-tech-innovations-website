# BBW Tech Innovations — Supabase Auth email templates

## Reset password

**Subject:** `{{ .Token }} is your BBW Tech password reset code`

```html
<div style="margin:0;padding:32px 16px;background:#09090b;font-family:Arial,sans-serif;color:#f5f5f5">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;margin:0 auto;background:#121216;border:1px solid #292931;border-radius:12px">
    <tr><td style="padding:32px"><div style="display:inline-block;padding:8px 11px;border-radius:7px;background:#2979ff;color:#fff;font-size:20px;font-weight:800">B</div><p style="margin:18px 0 6px;color:#78a8ff;font-size:11px;font-weight:700;letter-spacing:2px">BBW TECH INNOVATIONS</p><h1 style="margin:0 0 14px;font-size:28px;line-height:1.2;color:#fff">Reset your password</h1><p style="margin:0;color:#b4b4bd;font-size:15px;line-height:1.6">Enter this six-digit code in BBW Tech Admin to create a new password. It expires shortly.</p><div style="margin:26px 0;padding:18px;border:1px solid #3d70bd;border-radius:8px;background:#0d1b33;text-align:center;color:#fff;font-size:30px;font-weight:800;letter-spacing:9px">{{ .Token }}</div><p style="margin:0;color:#85858f;font-size:13px;line-height:1.55">If you did not request this, you can safely ignore this email. Your password will not change.</p></td></tr>
  </table>
</div>
```

## Change email address

**Subject:** `{{ .Token }} is your BBW Tech email change code`

```html
<div style="margin:0;padding:32px 16px;background:#09090b;font-family:Arial,sans-serif;color:#f5f5f5">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;margin:0 auto;background:#121216;border:1px solid #292931;border-radius:12px">
    <tr><td style="padding:32px"><div style="display:inline-block;padding:8px 11px;border-radius:7px;background:#2979ff;color:#fff;font-size:20px;font-weight:800">B</div><p style="margin:18px 0 6px;color:#78a8ff;font-size:11px;font-weight:700;letter-spacing:2px">BBW TECH INNOVATIONS</p><h1 style="margin:0 0 14px;font-size:28px;line-height:1.2;color:#fff">Confirm your new email</h1><p style="margin:0;color:#b4b4bd;font-size:15px;line-height:1.6">Use this six-digit code in BBW Tech Admin to confirm <strong style="color:#fff">{{ .NewEmail }}</strong>.</p><div style="margin:26px 0;padding:18px;border:1px solid #3d70bd;border-radius:8px;background:#0d1b33;text-align:center;color:#fff;font-size:30px;font-weight:800;letter-spacing:9px">{{ .Token }}</div><p style="margin:0;color:#85858f;font-size:13px;line-height:1.55">If you did not request this change, do not share this code and contact the BBW owner.</p></td></tr>
  </table>
</div>
```

## Invite user

**Subject:** `{{ .Token }} is your BBW Tech invitation code`

Use the same layout as Reset password, with this heading and text: **“You are invited to BBW Tech Admin”** and **“Enter this code with your email on the Accept invitation screen to create your password.”** Keep `{{ .Token }}` in the code card.

## Confirm sign up

**Subject:** `{{ .Token }} is your BBW Tech confirmation code`

Use the same layout as Reset password, with this heading and text: **“Confirm your BBW Tech account”** and **“Enter this code on the Confirm email screen to verify your email address.”** Keep `{{ .Token }}` in the code card.
