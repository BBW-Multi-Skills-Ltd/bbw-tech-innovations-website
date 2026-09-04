export default function AdminSetupRequired() {
  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <p className="eyebrow">Configuration required</p>
        <h1>Connect Supabase to continue.</h1>
        <p className="admin-auth-copy">Add your Supabase Publishable key to the local <code>.env</code> file, then restart the development server.</p>
      </section>
    </main>
  )
}
