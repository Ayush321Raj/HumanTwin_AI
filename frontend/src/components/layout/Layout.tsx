import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout() {
  return (
    // Outer shell: full viewport, row flex, no overflow
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* Left sidebar — fixed width, full height */}
      <Sidebar />

      {/* Right column: topbar + scrollable main */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          height: '100vh',
        }}
      >
        <TopBar />
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            background:
              'radial-gradient(ellipse 70% 40% at 50% -10%, rgba(69,137,255,0.06), transparent), var(--bg)',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
