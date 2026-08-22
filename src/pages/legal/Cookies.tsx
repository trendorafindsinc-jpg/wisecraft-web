import { LegalLayout } from '../../components/legal/LegalLayout'

export default function Cookies() {
  return (
    <LegalLayout title="Cookie Policy" eyebrow="Legal & Privacy">
      <h2>1. What We Use</h2>
      <p>WISECRAFT may use browser storage and, if enabled in the production product, cookies or similar technologies to remember preferences, maintain functionality, improve security, and understand product usage.</p>

      <h2>2. Local Storage</h2>
      <p>The current application uses browser local storage for product settings, conversations, and goals. Local storage is different from traditional cookies but serves a similar persistence purpose for certain product preferences and data.</p>

      <h2>3. Optional Analytics</h2>
      <p>If analytics or other non-essential tracking is introduced, the production implementation should disclose the provider, purpose, retention, and applicable user choices.</p>

      <h2>4. Managing Storage</h2>
      <p>You can generally manage browser cookies and site storage through your browser settings. Clearing site storage may remove locally stored WISECRAFT data.</p>

      <h2>5. Updates</h2>
      <p>This policy should be updated whenever WISECRAFT introduces or materially changes cookies, analytics, advertising, or similar technologies.</p>

      <p className="text-xs text-text-tertiary">Draft for product implementation. Review against the final production tracking configuration and applicable law.</p>
    </LegalLayout>
  )
}
