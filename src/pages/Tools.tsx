import { Wrench } from 'lucide-react'
import { PlaceholderPage } from '../components/PlaceholderPage'

export default function Tools() {
  return (
    <PlaceholderPage
      title="Tools"
      icon={<Wrench className="text-accent" size={22} />}
      description="Practical helpers (validators, calculators, opportunity finder) from the existing WISECRAFT Tools experience will plug in here during integration — not simulated in this package."
    />
  )
}
