import { LegalLayout } from '../../components/legal/LegalLayout'

export default function AIData() {
  return (
    <LegalLayout title="AI & Data Use" eyebrow="Legal & Privacy">
      <h2>How WISECRAFT Uses AI</h2>
      <p>WISECRAFT uses artificial intelligence to provide educational guidance, structured thinking, entrepreneurship support, and financial-growth-oriented assistance.</p>

      <h2>Accuracy</h2>
      <p>AI systems can make mistakes. Always verify important information and use qualified professionals for decisions requiring professional judgment.</p>

      <h2>Conversation Data</h2>
      <p>The current application persists conversations in browser local storage. AI requests may also be processed by the configured backend and AI provider so that responses can be generated.</p>

      <h2>Sensitive Information</h2>
      <p>Do not enter passwords, authentication secrets, payment credentials, private keys, or other highly sensitive information into AI conversations unless the product explicitly provides a secure mechanism for handling that information.</p>

      <h2>Knowledge Sources</h2>
      <p>Some WISECRAFT responses may use connected knowledge sources. Sources can improve context but do not guarantee that every generated statement is correct.</p>
    </LegalLayout>
  )
}
