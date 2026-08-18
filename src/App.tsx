import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Goals from './pages/Goals'
import Settings from './pages/Settings'
import Tools from './pages/Tools'
import Plans from './pages/Plans'
import Progress from './pages/Progress'
import Knowledge from './pages/Knowledge'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
