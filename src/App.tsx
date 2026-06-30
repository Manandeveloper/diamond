import { Suspense } from 'react'
// import { useControls, folder } from 'leva'
import Experience from './Experience'
// import UISidebar from './UI_Sidebar'

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
  // Define Leva controls for high-fidelity diamond and scene properties (Commented out)
  /*
  const {
    ior,
    bounces,
    aberrationStrength,
    environmentIntensity,
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
        value: 0.0,
        // min: 0.0,
        // max: 0.1,
        // step: 0.001,
        label: 'Dispersion (Rainbow)',
      },
    }),
    '✨ Scene Settings': folder({
      environmentIntensity: {
        value: 1.0,
        min: 0.0,
        max: 5.0,
        step: 0.05,
        label: 'Env Intensity',
      },
    }),
  })
  */

  // Using default values directly
  const ior = 2.417
  const bounces = 3
  const aberrationStrength = 0.0
  const environmentIntensity = 1.0

  // const envMap = '/hdri/brown_photostudio_02_4k.hdr'
  const envMap = '/hdri/env_gem_001_b9c4533e70.exr'
  const ringColor = '#FFFFF4'
  const autoRotate = false

  return (
    <div className="app-container">
      {/* Sidebar UI controls (Commented out completely) */}
      {/* <UISidebar /> */}

      {/* R3F 3D Canvas Experience Wrapper with Suspense */}
      <Suspense fallback={<LoadingScreen />}>
        <Experience
          envPath={envMap}
          ior={ior}
          bounces={bounces}
          aberrationStrength={aberrationStrength}
          ringColor={ringColor}
          autoRotate={autoRotate}
          environmentIntensity={environmentIntensity}
        />
      </Suspense>

      {/* Decorative premium status badges */}
    </div>
  )
}
