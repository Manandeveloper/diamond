import { Leva } from 'leva'

export default function UISidebar() {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h1 className="sidebar-title">AURA Configurator</h1>
        <p className="sidebar-subtitle">
          Interactive 3D Jewelry Viewer. Real-time physical diamond refraction, chromatic dispersion, and surface reflection.
        </p>
      </div>

      <div className="divider"></div>

      <div className="leva-panel-wrapper">
        {/* Render Leva inside our sidebar container with customized styles */}
        <Leva 
          fill 
          flat 
          titleBar={false} 
          theme={{
            colors: {
              elevation1: 'rgba(255, 255, 255, 0.02)',
              elevation2: 'rgba(0, 0, 0, 0.25)',
              elevation3: 'rgba(255, 255, 255, 0.05)',
              accent1: '#ffffff',
              accent2: '#a1a1aa',
              accent3: '#27272a',
              highlight1: '#ffffff',
              highlight2: '#e4e4e7',
              highlight3: '#71717a',
            },
            fontSizes: {
              root: '11px',
              toolTip: '10px',
            },
            sizes: {
              controlWidth: '160px',
            },
          }}
        />
      </div>

      <div className="divider"></div>

      <div className="footer-info">
        <span>Powered by React Three Fiber</span>
        <span>
          <a 
            href="https://github.com/pmndrs/drei#meshrefractionmaterial" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Docs
          </a>
        </span>
      </div>
    </aside>
  )
}
