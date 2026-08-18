import { TrendingUp } from 'lucide-react'
import { PlaceholderPage } from '../components/PlaceholderPage'

export default function Progress() {
  return (
    <PlaceholderPage
      title="Progress"
      icon={<TrendingUp className="text-accent" size={22} />}
      description="Progress tracking against goals and plans is intentionally not fabricated. This route is reserved for the future Progress Engine."
    />
  )
}
