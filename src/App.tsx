import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Chat } from './pages/Chat'
import { Onboarding } from './pages/Onboarding'
import { Goals } from './pages/Goals'
import { Tools } from './pages/Tools'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
