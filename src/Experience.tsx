import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useEnvironment, Center } from '@react-three/drei'
import * as THREE from 'three'
import DiamondRing from './DiamondRing'

interface SceneContentProps {
  envPath: string
  ior: number
  bounces: number
  aberrationStrength: number
  ringColor: string
  autoRotate: boolean
  environmentIntensity: number
}

// Inner scene content to access R3F context and hooks
function SceneContent({
  envPath,
  ior,
  bounces,
  aberrationStrength,
  ringColor,
  autoRotate,
  environmentIntensity,
}: SceneContentProps) {
  // Load environment map dynamically using useEnvironment
  const envMap = useEnvironment({ files: envPath })

  // Set equirectangular mapping for reflections
  envMap.mapping = THREE.EquirectangularReflectionMapping

  return (
    <>
      {/* High-quality studio lights to complement reflections */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-10, 5, -10]}
        intensity={0.5}
      />

      {/* R3F Environment mapping */}
      <Environment map={envMap} environmentIntensity={environmentIntensity} />

      {/* Centered Diamond Ring */}
      <Suspense fallback={null}>
        <Center>
          <DiamondRing
            envMap={envMap}
            ior={ior}
            bounces={bounces}
            aberrationStrength={aberrationStrength}
            ringColor={ringColor}
          />
        </Center>
      </Suspense>

      {/* Floor Grounding Shadows */}
      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.7}
        scale={6}
        blur={2.0}
        far={1.5}
      />

      {/* Camera Controls */}
      <OrbitControls
        makeDefault
        autoRotate={autoRotate}
        autoRotateSpeed={1.0}
        enableDamping
        dampingFactor={0.05}
        minDistance={2.0}
        maxDistance={5.0}
      />
    </>
  )
}

interface ExperienceProps extends SceneContentProps { }

export default function Experience(props: ExperienceProps) {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ background: '#ffffff' }}
        camera={{ position: [0, 0.8, 2.5], fov: 70 }}
        dpr={[1, 2]} // limit to 2 for performance on high-DPI displays
      >
        <Suspense fallback={null}>
          <SceneContent {...props} />
        </Suspense>
      </Canvas>
    </div>
  )
}
