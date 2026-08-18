import { BookOpen } from 'lucide-react'
import { PlaceholderPage } from '../components/PlaceholderPage'

export default function Knowledge() {
  return (
    <PlaceholderPage
      title="Knowledge"
      icon={<BookOpen className="text-accent" size={22} />}
      description="A dedicated knowledge browser for Trendorafinds will integrate here. Mentorship replies already surface sources when RAG matches."
    />
  )
}
