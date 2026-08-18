import { Map } from 'lucide-react'
import { PlaceholderPage } from '../components/PlaceholderPage'

export default function Plans() {
  return (
    <PlaceholderPage
      title="Plans"
      icon={<Map className="text-accent" size={22} />}
      description="Action plans will live here after the mentor and goals layers are connected. No fake plan data is shown."
    />
  )
}
