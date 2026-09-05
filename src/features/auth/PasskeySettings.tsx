import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { canUseProductionPasskeys } from './passkeys'

export default function PasskeySettings() {
  const [message, setMessage] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  if (!canUseProductionPasskeys()) return null

  const register = async () => {
    if (!supabase) return
    setMessage('')
    setIsRegistering(true)
    const { error } = await supabase.auth.registerPasskey()
    setIsRegistering(false)
    setMessage(error ? 'Could not register this passkey. Confirm passkeys are enabled, then try again.' : 'Passkey registered for this device.')
  }

  return (
    <section className="admin-passkey-settings">
      <h2>Passkey</h2>
      <p>Add this device&apos;s biometric, PIN, or security-key passkey as an optional way to sign in. Your password remains available as a fallback.</p>
      <button type="button" className="admin-secondary-button" onClick={() => void register()} disabled={isRegistering}>{isRegistering ? 'Registering…' : 'Register passkey on this device'}</button>
      {message && <p role="status">{message}</p>}
    </section>
  )
}
