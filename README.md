# BBW Tech Innovations website

Next.js 16 (App Router) site and admin for bbwtechinnovation.com. See `CLAUDE.md` for the plan, rules and how it is built.

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
npm run build && npm run lint
npm run backup:db            # before any database migration (needs Docker)
```
