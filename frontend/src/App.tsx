import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ConsentVault from './pages/ConsentVault'
import TwinProfile from './pages/TwinProfile'
import WhatIfStudio from './pages/WhatIfStudio'
import Parliament from './pages/Parliament'
import Learning from './pages/Learning'
import FidelityAutopsy from './pages/FidelityAutopsy'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/whatif" replace />} />
          <Route path="consent"    element={<ConsentVault />} />
          <Route path="twin"       element={<TwinProfile />} />
          <Route path="whatif"     element={<WhatIfStudio />} />
          <Route path="parliament" element={<Parliament />} />
          <Route path="learning"   element={<Learning />} />
          <Route path="fidelity"   element={<FidelityAutopsy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
