import { Suspense } from 'react'
import { useControls, folder } from 'leva'
import Experience from './Experience'
import UISidebar from './UI_Sidebar'

// Premium Loading Fallback screen
function LoadingScreen() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <div className="loading-text">AURA Configurator</div>
      <div className="loading-subtext">Initializing photorealistic refraction assets...</div>
    </div>
  )
}

export default function App() {
  // Define Leva controls for high-fidelity diamond and scene properties
  const {
    ior,
    bounces,
    aberrationStrength,
    fresnel,
    fastChroma,
    envMap,
    ringColor,
    autoRotate,
  } = useControls({
    '💎 Diamond Settings': folder({
      ior: {
        value: 2.417,
        min: 1.0,
        max: 3.0,
        step: 0.001,
        label: 'Index (IOR)',
      },
      bounces: {
        value: 3,
        min: 1,
        max: 8,
        step: 1,
        label: 'Reflections (Bounces)',
      },
      aberrationStrength: {
        value: 0.02,
        min: 0.0,
        max: 0.1,
        step: 0.001,
        label: 'Dispersion (Rainbow)',
      },
      fresnel: {
        value: 1.0,
        min: 0.0,
        max: 1.0,
        step: 0.05,
        label: 'Fresnel Bias',
      },
      fastChroma: {
        value: true,
        label: 'Fast Chroma Mode',
      },
    }),
    '🎬 Scene Settings': folder({
      envMap: {
        options: {
          'Studio Lighting (HDR)': '/hdri/white_home_studio_4k.hdr',
          'Exterior Sunset (HDR)': '/hdri/venice_sunset_1k.hdr',
        },
        value: '/hdri/white_home_studio_4k.hdr',
        label: 'Environment Map',
      },
      ringColor: {
        value: '#e2b13c', // Warm Yellow Gold
        label: 'Band Color',
      },
      autoRotate: {
        value: true,
        label: 'Orbit Auto-Rotate',
      },
    }),
  })

  return (
    <div className="app-container">
      {/* Sidebar UI controls */}
      <UISidebar />

      {/* R3F 3D Canvas Experience Wrapper with Suspense */}
      <Suspense fallback={<LoadingScreen />}>
        <Experience
          envPath={envMap}
          ior={ior}
          bounces={bounces}
          aberrationStrength={aberrationStrength}
          fresnel={fresnel}
          fastChroma={fastChroma}
          ringColor={ringColor}
          autoRotate={autoRotate}
        />
      </Suspense>

      {/* Decorative premium status badges */}
      <div className="badge-container">
        <div className="badge">PBR ACTIVE</div>
        <div className="badge">120 FPS CAPABLE</div>
      </div>
    </div>
  )
}
