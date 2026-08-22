import { LegalLayout } from '../../components/legal/LegalLayout'

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" eyebrow="Legal & Privacy">
      <h2>1. Information We Handle</h2>
      <p>WISECRAFT may handle information you provide through the product, conversation content, settings, and technical information required to operate and secure the service.</p>

      <h2>2. Browser Storage</h2>
      <p>The current WISECRAFT package stores conversations, goals, and settings in your browser using local storage. This means information can remain on the device and browser where you use WISECRAFT.</p>

      <h2>3. AI Processing</h2>
      <p>When you use AI features, the information required to generate a response may be processed by the configured AI infrastructure and related service providers.</p>

      <h2>4. Data Choices</h2>
      <p>Users should be provided with appropriate controls to review or delete locally stored product data as those controls become available.</p>

      <h2>5. Security</h2>
      <p>We aim to use reasonable technical and organizational safeguards, but no internet-connected or electronic storage system can be guaranteed completely secure.</p>

      <h2>6. Third Parties</h2>
      <p>WISECRAFT may use infrastructure, analytics, AI, hosting, or other service providers. The final production policy should identify relevant providers and applicable processing terms.</p>

      <h2>7. Contact</h2>
      <p>Replace this section with your official Trendora Inc. privacy contact information before public launch.</p>

      <p className="text-xs text-text-tertiary">Draft for product implementation. Obtain appropriate privacy/legal review before publication.</p>
    </LegalLayout>
  )
}
